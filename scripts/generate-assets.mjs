/**
 * StillHere — Bedrock asset generator (3D claymorphic illustrations).
 *
 * Generates the assets described in the Design System Addendum
 * (Section 3.1) and writes PNGs into /public/assets/. Day-1 one-shot.
 *
 *   node scripts/generate-assets.mjs            # generate every asset
 *   node scripts/generate-assets.mjs hero-gift-box grandma-character
 *                                              # regenerate specific assets
 *
 * Uses Stability AI Stable Image Core on Bedrock (active text-to-image
 * model on this account; Nova Canvas + Titan are marked LEGACY).
 * Region is pinned to us-west-2 — where SD3.5 / Stable Image Core are
 * available — independently of `aws configure get region`.
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const ASSETS_DIR = join(PROJECT_ROOT, "public", "assets");
const ICONS_DIR = join(ASSETS_DIR, "icons");

const MODEL_ID = "stability.stable-image-core-v1:1";
const REGION = process.env.AWS_REGION_IMAGES || "us-west-2";

const MASTER_SUFFIX =
  "3D clay render, soft matte finish, warm terracotta and sage green palette, " +
  "cream background, Pixar-style claymation aesthetic, soft diffuse lighting, " +
  "rounded organic shapes, no sharp edges, pastel earthy tones, miniature " +
  "sculpture feel, subtle shadows, ultra clean, studio quality render";

const HERO = [
  {
    name: "hero-gift-box",
    prompt:
      "A beautiful 3D clay gift box with a sage green ribbon and bow, terra " +
      "cotta colored box, floating hearts and confetti around it, speech " +
      "bubble icons, warm cream background",
  },
  {
    name: "grandma-character",
    prompt:
      "A warm, friendly 3D clay grandmother character, silver-gray hair, " +
      "wearing a soft peach terracotta cardigan over a yellow top, kind " +
      "smile, gentle posture with hands together, Indian grandma appearance",
  },
  {
    name: "hands-gift-sms",
    prompt:
      "3D clay hands passing a gift box to another pair of hands, a floating " +
      "speech bubble with an SMS message and an envelope, confetti and stars " +
      "scattered around",
  },
  {
    name: "record-button",
    prompt:
      "A large 3D clay record button, terra cotta red, with sound wave rings " +
      "emanating from it, organic flowing audio waveform below in terracotta, " +
      "sage and gold colors, small friendly AI robot character with " +
      "headphones in the corner",
  },
  {
    name: "lock-sequence",
    prompt:
      "A row of 3D clay padlocks going from unlocked to locked, terra cotta " +
      "colored, getting smaller in a sequence, with golden sparkle effects",
  },
  {
    name: "wax-seal-default",
    prompt:
      "A 3D clay wax seal, terra cotta colored wax with a ribbon symbol " +
      "impressed in it, sitting on a cream parchment background, golden " +
      "highlights, viewed from above, isolated",
  },
  {
    name: "audio-player",
    prompt:
      "A 3D clay music player card with a circular grandma avatar photo at " +
      "top, a playback scrubber bar in sage green, play pause skip buttons " +
      "in terra cotta, musical notes floating around, claymation aesthetic",
  },
  {
    name: "player-avatar-default",
    prompt:
      "A 3D clay circular avatar silhouette of a warm grandmother figure, " +
      "soft terra cotta and cream colors, gentle smile, centered, isolated " +
      "on a cream background",
  },
];

const ICONS = [
  {
    name: "baby-shoes",
    prompt:
      "A pair of tiny 3D clay baby shoes in terra cotta color, isolated, " +
      "cream background, viewed at a slight angle",
  },
  {
    name: "cooking-utensils",
    prompt:
      "A 3D clay set of cooking utensils (wooden spoon, ladle) in warm " +
      "golden amber colors, isolated, cream background",
  },
  {
    name: "suitcase",
    prompt:
      "A 3D clay vintage travel suitcase in warm brown and terracotta " +
      "colors with leather straps, isolated, cream background",
  },
  {
    name: "wedding-cake",
    prompt:
      "A 3D clay multi-tiered wedding cake in sage green color with a " +
      "small heart on top, isolated, cream background",
  },
  {
    name: "graduation-cap",
    prompt:
      "A 3D clay graduation cap with a terra cotta and soft pink tassel, " +
      "isolated, cream background",
  },
];

function buildBody(text) {
  return JSON.stringify({
    prompt: `${text}. ${MASTER_SUFFIX}`,
    mode: "text-to-image",
    aspect_ratio: "1:1",
    output_format: "png",
    seed: 42,
  });
}

async function generateOne(client, name, text, outPath) {
  process.stdout.write(`  → ${name} ... `);
  try {
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: buildBody(text),
    });
    const response = await client.send(command);
    const payload = JSON.parse(new TextDecoder().decode(response.body));
    const b64 = payload.images?.[0];
    if (!b64) {
      console.log(`SKIP (no image; finish=${JSON.stringify(payload.finish_reasons)})`);
      return false;
    }
    const buf = Buffer.from(b64, "base64");
    await writeFile(outPath, buf);
    console.log(`OK (${(buf.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.log(`SKIP (${err.name}: ${err.message})`);
    return false;
  }
}

async function main() {
  const onlyArgs = process.argv.slice(2);
  const filter = onlyArgs.length > 0 ? new Set(onlyArgs) : null;

  await mkdir(ASSETS_DIR, { recursive: true });
  await mkdir(ICONS_DIR, { recursive: true });

  console.log(`StillHere asset generator`);
  console.log(`  model:  ${MODEL_ID}`);
  console.log(`  region: ${REGION}`);
  console.log(`  out:    ${ASSETS_DIR}`);
  if (filter) console.log(`  filter: ${[...filter].join(", ")}`);
  console.log("");

  const client = new BedrockRuntimeClient({ region: REGION });

  let ok = 0;
  let total = 0;

  console.log("Hero assets:");
  for (const a of HERO) {
    if (filter && !filter.has(a.name)) continue;
    total++;
    const outPath = join(ASSETS_DIR, `${a.name}.png`);
    if (await generateOne(client, a.name, a.prompt, outPath)) ok++;
  }

  console.log("\nPrompt icons:");
  for (const a of ICONS) {
    if (filter && !filter.has(a.name)) continue;
    total++;
    const outPath = join(ICONS_DIR, `${a.name}.png`);
    if (await generateOne(client, a.name, a.prompt, outPath)) ok++;
  }

  console.log(`\nDone. ${ok}/${total} assets generated.`);
  if (ok < total) {
    console.log(
      "Missing assets won't crash the app — screens fall back to plain layouts.",
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
