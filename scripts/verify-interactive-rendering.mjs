import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";

const server = await createServer({
  appType: "custom",
  server: { middlewareMode: true },
});

const launchPlayerSource = await readFile(
  new URL(
    "../app/components/dashboard/interactive-content-player.tsx",
    import.meta.url
  ),
  "utf8"
);

if (!launchPlayerSource.includes("<NativeLearningPlayer")) {
  throw new Error(
    "The learner launch component is not wired to NativeLearningPlayer."
  );
}

if (launchPlayerSource.includes("function NativePlayer(")) {
  throw new Error("The legacy static native renderer is still present.");
}

const activities = [
  {
    block: {
      id: "matching-check",
      type: "matching",
      title: "Match risk and response",
      items: [
        { left: "Visible soil erosion", right: "Protective soil cover" },
        { left: "Uncertain pest symptom", right: "Seek guidance" },
      ],
    },
    expected: ["Visible soil erosion", "Protective soil cover"],
  },
  {
    block: {
      id: "sequence-check",
      type: "sequence",
      title: "Sequence a field decision",
      items: [{ title: "Observe the field" }, { title: "Act and monitor" }],
    },
    expected: ["Observe the field", "Act and monitor", "Check order"],
  },
  {
    block: {
      id: "scenario-check",
      type: "scenario",
      title: "Respond to a dry spell",
      content: "The crop is losing moisture.",
      choices: [
        { text: "Review conditions", feedback: "Good", correct: true },
        { text: "Ignore the risk", feedback: "Try again", correct: false },
      ],
    },
    expected: [
      "The crop is losing moisture.",
      "Review conditions",
      "Ignore the risk",
    ],
  },
];

try {
  const { NativeLearningPlayer } = await server.ssrLoadModule(
    "/app/components/dashboard/native-learning-player.tsx"
  );

  for (const { block, expected } of activities) {
    const html = renderToStaticMarkup(
      React.createElement(NativeLearningPlayer, {
        definition: {
          version: 2,
          presentationMode: "journey",
          motionIntensity: "playful",
          showProgress: true,
          showPoints: true,
          showStreak: true,
          showCelebration: true,
          completionMode: "all",
          blocks: [{ ...block, required: true, points: 10 }],
        },
      })
    );

    for (const text of expected) {
      if (!html.includes(text)) {
        throw new Error(`${block.type} activity did not render: ${text}`);
      }
    }

    for (const text of [
      "Lesson progress",
      "Correct-answer streak",
      "Experience points",
    ]) {
      if (!html.includes(text)) {
        throw new Error(
          `${block.type} activity did not render game indicator: ${text}`
        );
      }
    }
  }

  console.log(
    "Interactive journey rendering passed for matching, sequence, and scenario activities."
  );
} finally {
  await server.close();
}

// Some development plugins keep diagnostic handles alive after Vite closes.
// This command is a finite CI verification, so finish explicitly on success.
process.exit(0);