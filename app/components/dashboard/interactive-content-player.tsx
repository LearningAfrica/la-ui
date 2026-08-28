import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import {
  NativeLearningPlayer,
  type NativeInteraction,
} from "./native-learning-player";
import type { NativeDefinition } from "./native-interactive-types";

type Launch = {
  id: string;
  format: "native" | "html5" | "scorm12" | "scorm2004" | "external";
  definition?: NativeDefinition;
  launch_url?: string;
  xapi: {
    enabled: boolean;
    endpoint: string;
    token: string;
    activity_id: string;
  };
};

export function InteractiveContentPlayer({
  contentId,
  onCompleted,
}: {
  contentId: string;
  onCompleted: () => void;
}) {
  const {
    data: launch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["interactive-launch", contentId],
    queryFn: async () =>
      (
        await apiClient.get<Launch>(
          `/api/interactive-content/${contentId}/launch/`
        )
      ).data,
  });
  const scormState = useMemo(
    () => ({ contentId, values: new Map<string, string>() }),
    [contentId]
  ).values;

  useEffect(() => {
    if (!launch || !["scorm12", "scorm2004"].includes(launch.format)) return;

    const complete = (value: string) => {
      if (["completed", "passed"].includes(value.toLowerCase())) onCompleted();
    };
    const api = {
      LMSInitialize: () => "true",
      LMSFinish: () => {
        complete(scormState.get("cmi.core.lesson_status") ?? "");

        return "true";
      },
      LMSGetValue: (key: string) => scormState.get(key) ?? "",
      LMSSetValue: (key: string, value: string) => {
        scormState.set(key, value);

        if (key === "cmi.core.lesson_status") complete(value);

        return "true";
      },
      LMSCommit: () => "true",
      LMSGetLastError: () => "0",
      LMSGetErrorString: () => "No error",
      LMSGetDiagnostic: () => "No error",
    };
    const api2004 = {
      Initialize: () => "true",
      Terminate: () => {
        complete(scormState.get("cmi.completion_status") ?? "");

        return "true";
      },
      GetValue: (key: string) => scormState.get(key) ?? "",
      SetValue: (key: string, value: string) => {
        scormState.set(key, value);

        if (key === "cmi.completion_status" || key === "cmi.success_status")
          complete(value);

        return "true";
      },
      Commit: () => "true",
      GetLastError: () => "0",
      GetErrorString: () => "No error",
      GetDiagnostic: () => "No error",
    };
    const host = window as typeof window & {
      API?: typeof api;
      API_1484_11?: typeof api2004;
    };

    host.API = api;
    host.API_1484_11 = api2004;

    return () => {
      delete host.API;
      delete host.API_1484_11;
    };
  }, [launch, onCompleted, scormState]);

  useEffect(() => {
    if (!launch?.xapi.enabled) return;

    apiClient
      .post(
        launch.xapi.endpoint,
        {
          verb: {
            id: "http://adlnet.gov/expapi/verbs/launched",
            display: { "en-US": "launched" },
          },
          object: { id: launch.xapi.activity_id },
        },
        {
          headers: {
            "X-Experience-API-Version": "2.0.0",
            "X-Experience-API-Token": launch.xapi.token,
          },
        }
      )
      .catch(() => undefined);
  }, [launch]);

  const recordNativeInteraction = useCallback(
    (interaction: NativeInteraction) => {
      if (!launch?.xapi.enabled) return;

      const verbIds = {
        interacted: "http://adlnet.gov/expapi/verbs/interacted",
        answered: "http://adlnet.gov/expapi/verbs/answered",
        completed: "http://adlnet.gov/expapi/verbs/completed",
      };
      const result: Record<string, unknown> = {};

      if (interaction.success !== undefined)
        result.success = interaction.success;

      if (interaction.response) result.response = interaction.response;

      if (interaction.score) result.score = interaction.score;

      if (interaction.verb === "completed") result.completion = true;

      apiClient
        .post(
          launch.xapi.endpoint,
          {
            verb: {
              id: verbIds[interaction.verb],
              display: { "en-US": interaction.verb },
            },
            object: {
              id: `${launch.xapi.activity_id}#${interaction.block.id ?? interaction.block.type}`,
              definition: {
                name: { "en-US": interaction.block.title },
                type: "http://adlnet.gov/expapi/activities/interaction",
              },
            },
            result,
            context: {
              contextActivities: {
                parent: [{ id: launch.xapi.activity_id }],
              },
            },
          },
          {
            headers: {
              "X-Experience-API-Version": "2.0.0",
              "X-Experience-API-Token": launch.xapi.token,
            },
          }
        )
        .catch(() => undefined);
    },
    [launch]
  );

  if (isLoading)
    return <div className="bg-muted h-96 animate-pulse rounded-xl" />;

  if (error || !launch)
    return (
      <div className="text-destructive rounded-xl border p-6">
        The interactive lesson could not be loaded.
      </div>
    );

  if (launch.format === "native")
    return (
      <NativeLearningPlayer
        definition={launch.definition ?? { blocks: [] }}
        onInteraction={recordNativeInteraction}
        onCompleted={onCompleted}
      />
    );

  return (
    <iframe
      src={launch.launch_url}
      title="Interactive lesson"
      className="h-[70vh] min-h-128 w-full rounded-xl border"
      sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-downloads"
      allowFullScreen
    />
  );
}
