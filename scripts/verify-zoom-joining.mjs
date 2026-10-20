// Run the actual join component against a fake Zoom SDK: no live credentials,
// browser permissions, external meetings or recordings are used by these tests.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setImmediate } from "node:timers/promises";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadModule(relativePath, dependencies, globals = {}) {
  const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const exports = {};
  const context = vm.createContext({
    exports,
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    ...globals,
  });
  vm.runInContext(compiled, context);
  return exports;
}

async function mount({ data, error, failure } = {}) {
  const joins = [];
  const stateChanges = [];
  const sdkCalls = [];
  let cleanup;
  let stateIndex = 0;
  const elements = new Map();
  const document = {
    body: {
      style: { overflow: "", paddingRight: "" },
      appendChild(element) { elements.set(element.id, element); },
    },
    getElementById(id) { return elements.get(id); },
    createElement() {
      return {
        dataset: {}, style: {}, id: "",
        remove() { elements.delete(this.id); },
      };
    },
  };
  const sdk = {
    setZoomJSLib() {}, preLoadWasm() {}, prepareWebSDK() {},
    init(options) { options.success(); },
    join(options) {
      joins.push(options);
      if (failure) options.error(failure);
      else options.success();
    },
    record() { sdkCalls.push("record"); },
    leaveMeeting(options) { options.success(); },
  };
  const jsx = (type, props) => ({ type, props });
  const { ZoomMeetingEmbed } = loadModule(
    "../app/components/dashboard/live-sessions/zoom-meeting-embed.tsx",
    {
      react: {
        useEffect(fn) { cleanup = fn(); },
        useState(initial) {
          const index = stateIndex++;
          return [initial, (value) => stateChanges.push({ index, value })];
        },
      },
      "react/jsx-runtime": { jsx, jsxs: jsx },
      "~icons/lucide/loader-2": { default: "loader" },
      "@/features/zoom-calls/zoom-call-queries": {
        useZoomCallJoinInfo: () => ({ data, error, isLoading: false }),
      },
    },
    {
      document,
      window: {
        ZoomMtg: sdk,
        location: { origin: "https://learning.example" },
        setTimeout() {},
      },
      URL,
    }
  );
  const rendered = ZoomMeetingEmbed({ sessionId: "12345678901", leavePath: "/sessions" });
  await setImmediate();
  return { joins, stateChanges, sdkCalls, rendered, cleanup };
}

const participant = {
  role: 0,
  signature: "signed-participant-token",
  meetingNumber: "12345678901",
  userName: "Learner",
  passWord: "passcode",
};

test("the host joins with ZAK without starting recording", async () => {
  const result = await mount({ data: { ...participant, role: 1, zak: "host-zak" } });
  assert.equal(result.joins.length, 1);
  assert.equal(result.joins[0].zak, "host-zak");
  assert.equal(result.joins[0].meetingNumber, participant.meetingNumber);
  assert.equal(result.joins[0].passWord, participant.passWord);
  assert.equal("sdkKey" in result.joins[0], false);
  assert.deepEqual(result.sdkCalls, []);
  result.cleanup();
});

test("a learner joins without a host token or legacy sdkKey", async () => {
  const result = await mount({ data: participant });
  assert.equal(result.joins.length, 1);
  assert.equal("zak" in result.joins[0], false);
  assert.equal("sdkKey" in result.joins[0], false);
  result.cleanup();
});

test("a missing host token fails before invoking Zoom join", async () => {
  const result = await mount({ data: { ...participant, role: 1 } });
  assert.equal(result.joins.length, 0);
  assert.ok(result.stateChanges.some(({ value }) => String(value).includes("Host authorization")));
});

test("Zoom's actual error code is retained for diagnosis", async () => {
  const result = await mount({
    data: participant,
    failure: { result: { errorMessage: "Signature is invalid.", errorCode: 3712 } },
  });
  assert.ok(result.stateChanges.some(({ value }) => String(value).includes("3712")));
  assert.ok(result.stateChanges.some(({ value }) => String(value).includes("Signature is invalid")));
});

test("a backend configuration error reaches the page", async () => {
  const result = await mount({
    error: { response: { data: { error: "Zoom host authorization unavailable." } } },
  });
  assert.ok(JSON.stringify(result.rendered).includes("Zoom host authorization unavailable."));
});

test("tab focus and reconnect cannot trigger a second SDK join", () => {
  const { useZoomCallJoinInfo } = loadModule(
    "../app/features/zoom-calls/zoom-call-queries.ts",
    {
      "@tanstack/react-query": { useQuery: (options) => options },
      "./zoom-call-query-keys": { zoomCallQueryKeys: { joinInfo: (id) => ["join", id] } },
      "@/lib/api": { apiClient: {} },
    }
  );
  const options = useZoomCallJoinInfo("12345678901", true);
  assert.equal(options.refetchOnWindowFocus, false);
  assert.equal(options.refetchOnReconnect, false);
  assert.equal(options.gcTime, 0);
  assert.equal(options.retry, false);
});