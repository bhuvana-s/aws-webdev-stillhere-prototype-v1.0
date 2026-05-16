/**
 * StillHere — Title generation (AWS Bedrock).
 *
 * Per Prototype-Spec-v2 Section 7.1:
 *   - Primary:    anthropic.claude-haiku-4-5-20251001-v1:0
 *   - Fallback 1: anthropic.claude-3-5-haiku-20241022-v1:0
 *   - Fallback 2: anthropic.claude-3-haiku-20240307-v1:0
 *   - Static fallback: hardcoded title for the selected prompt.
 *
 * The static map is keyed by the Addendum prompt IDs so it tracks
 * lib/prompts.ts.
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Bedrock now requires inference-profile IDs (not raw model IDs) for these
// Anthropic models on-demand. The "us." prefix is the US cross-region profile.
const MODEL_IDS = [
  "us.anthropic.claude-haiku-4-5-20251001-v1:0",
  "us.anthropic.claude-3-5-haiku-20241022-v1:0",
  "us.anthropic.claude-3-haiku-20240307-v1:0",
];

const STATIC_FALLBACKS: Record<string, string> = {
  "1": "The morning you came into the world",
  "2": "A taste of home",
  "3": "The day I leapt forward",
  "4": "Our wedding day",
  "5": "What I learned the hard way",
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  let promptId = "1";
  let promptText = "";
  try {
    const body = await req.json();
    promptId = String(body.promptId ?? "1");
    promptText = String(body.promptText ?? "");
  } catch {
    /* fall through to static */
  }

  const region = process.env.AWS_REGION || "us-east-1";
  const client = new BedrockRuntimeClient({ region });

  const userMsg = `A grandparent just recorded a story responding to:
"${promptText}". Suggest a 4-8 word warm, intimate title.
Reply with ONLY the title, no quotes, no other text.`;

  const errors: string[] = [];
  for (const modelId of MODEL_IDS) {
    try {
      const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 50,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const response = await client.send(command);
      const payload = JSON.parse(new TextDecoder().decode(response.body));
      const title = payload.content?.[0]?.text?.trim();
      if (title) {
        return Response.json({ title, source: modelId });
      }
    } catch (err) {
      const name = err instanceof Error ? err.name : "Unknown";
      const msg = err instanceof Error ? err.message : String(err);
      const errLine = `${modelId}: ${name}: ${msg}`;
      console.warn(`[generate-title] ${errLine}`);
      errors.push(errLine);
      continue;
    }
  }

  // TEMP: always include diagnostics in the response. Revert once Bedrock
  // works end-to-end on the deployed Lambda.
  return Response.json({
    title: STATIC_FALLBACKS[promptId] ?? "Your story",
    source: "static",
    region,
    errors,
  });
}
