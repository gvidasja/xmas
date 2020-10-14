import { join, resolve } from "https://deno.land/std@0.74.0/path/mod.ts";
import { copySync, emptyDirSync } from "https://deno.land/std@0.74.0/fs/mod.ts";
import { getLogger } from "https://deno.land/std@0.74.0/log/mod.ts";

const logger = getLogger();
const [staticDir, jsPath, outputDir] = Deno.args;
const OUTPUT_DIR = resolve(outputDir);

copyStaticFiles(resolve(staticDir), resolve(outputDir));
bundleJsTo(Deno.realPathSync(jsPath), join(OUTPUT_DIR, "index.js"));

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
