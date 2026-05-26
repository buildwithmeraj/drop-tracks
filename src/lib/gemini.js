import { siteConfig } from "@/lib/site";

export const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

const EXTRACTION_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "STRING",
      nullable: true,
      description:
        "A concise summary of the Telegram post, suitable for the notes field.",
    },
    name: {
      type: "STRING",
      nullable: true,
      description:
        "The likely airdrop or campaign name only if explicitly stated or very clear.",
    },
    endDate: {
      type: "STRING",
      nullable: true,
      format: "date",
      description:
        "The end date in YYYY-MM-DD if the post explicitly mentions one. Otherwise null.",
    },
    expectedPaymentDate: {
      type: "STRING",
      nullable: true,
      format: "date",
      description:
        "The expected payment date in YYYY-MM-DD only if explicitly stated. Otherwise null.",
    },
    expectedTgeDate: {
      type: "STRING",
      nullable: true,
      format: "date",
      description:
        "The expected TGE date in YYYY-MM-DD only if explicitly stated. Otherwise null.",
    },
    needsDailyTasks: {
      type: "BOOLEAN",
      nullable: true,
      description:
        "True only if the post explicitly says the user must check in daily, do daily tasks, maintain a streak, or return every day. False only if the post explicitly says no recurring daily task is needed. Otherwise null.",
    },
  },
  required: [
    "summary",
    "name",
    "endDate",
    "expectedPaymentDate",
    "expectedTgeDate",
    "needsDailyTasks",
  ],
};

function normalizeDateValue(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  const date = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return trimmed;
}

function normalizeTextValue(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeBooleanValue(value) {
  if (typeof value !== "boolean") {
    return null;
  }

  return value;
}

export function normalizeGeminiExtraction(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      name: null,
      notes: null,
      endDate: null,
      expectedPaymentDate: null,
      expectedTgeDate: null,
      needsDailyTasks: null,
    };
  }

  return {
    name: normalizeTextValue(payload.name),
    notes: normalizeTextValue(payload.summary),
    endDate: normalizeDateValue(payload.endDate),
    expectedPaymentDate: normalizeDateValue(payload.expectedPaymentDate),
    expectedTgeDate: normalizeDateValue(payload.expectedTgeDate),
    needsDailyTasks: normalizeBooleanValue(payload.needsDailyTasks),
  };
}

function buildPrompt({ postText, link }) {
  return [
    `You are extracting structured airdrop details for ${siteConfig.name}.`,
    "Return null for any field that is missing, unclear, inferred, approximate, or not explicitly stated.",
    "Do not invent dates. Do not guess campaign names unless the post makes them obvious.",
    "The summary should be concise and useful for a user saving notes about the airdrop.",
    "Set needsDailyTasks to true only when the post explicitly mentions daily check-ins, daily tasks, daily claims, or streak-based recurring actions.",
    `Telegram post link: ${link}`,
    "",
    "Post text:",
    postText,
  ].join("\n");
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function requestGeminiStructuredOutput({ apiKey, model, prompt }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: EXTRACTION_SCHEMA,
      },
    }),
    cache: "no-store",
  });

  return response;
}

export async function extractAirdropDetailsWithGemini({ postText, link }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in your environment variables.");
  }

  const prompt = buildPrompt({ postText, link });
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await requestGeminiStructuredOutput({
        apiKey,
        model,
        prompt,
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error("Gemini returned an empty response.");
        }

        let parsed;

        try {
          parsed = JSON.parse(text);
        } catch {
          throw new Error("Gemini returned invalid JSON.");
        }

        return normalizeGeminiExtraction(parsed);
      }

      const errorText = await response.text();
      lastError = `Gemini request failed with ${response.status}: ${errorText.slice(0, 400)}`;

      if (response.status === 503 && attempt < 2) {
        await sleep(750 * 2 ** attempt);
        continue;
      }

      if (response.status === 503) {
        break;
      }

      throw new Error(lastError);
    }
  }

  throw new Error(
    lastError ||
      "Gemini is temporarily unavailable. Please try again in a moment.",
  );
}
