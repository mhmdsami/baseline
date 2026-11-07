import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = join(root, "assets/icon.svg");
const appDir = join(root, "src/app");
const svg = await readFile(source);

const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

await writeFile(join(appDir, "icon.svg"), svg);
await writeFile(join(appDir, "icon.png"), await png(64));
await writeFile(join(appDir, "apple-icon.png"), await png(180));

// A static fallback card, used by platforms that will not accept a generated image.
await writeFile(join(appDir, "opengraph-image.alt.txt"), "baseline. A Next.js starter with a portable core.\n");

console.log("assets: regenerated icon.svg, icon.png, apple-icon.png");
