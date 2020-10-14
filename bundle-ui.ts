import { join, resolve } from "https://deno.land/std@0.74.0/path/mod.ts";
import { copySync, emptyDirSync } from "https://deno.land/std@0.74.0/fs/mod.ts";
import { getLogger } from "./logging.ts";

const logger = getLogger();
const uiPath = Deno.args[0];
const OUTPUT_DIR = resolve(uiPath);

copyStaticFiles(resolve("./ui/public"), resolve(uiPath));
bundleJsTo(Deno.realPathSync("./ui/index.jsx"), join(OUTPUT_DIR, "index.js"));

function copyStaticFiles(sourceDir: string, destinationDir: string) {
  logger.info(`Emptying ${destinationDir}...`);
  emptyDirSync(destinationDir);
  logger.info(`Copy ${sourceDir} to ${destinationDir}`);
  copySync(sourceDir, destinationDir, { overwrite: true });
  logger.info(`Static file copied.`);
}

async function bundleJsTo(sourceFile: string, destinationFile: string) {
  getLogger().info(`Bundling UI from ${sourceFile}...`);
  const [_, bundledJs] = await Deno.bundle(sourceFile);

  Deno.writeTextFileSync(
    destinationFile,
    bundledJs,
  );
  getLogger().info(`UI bundled to ${destinationFile}.`);
}
