import {
  Router,
  RouterMiddleware,
} from "https://deno.land/x/oak@v6.2.0/router.ts";
import { js } from "./httpResponse.ts";
import { getLogger } from "./logging.ts";

const serveStaticFiles = (root: string): RouterMiddleware =>
  async (ctx) => {
    const path = ctx.params.path || "index.html";
    await ctx.send({ root, path });
  };

export const singlePageAppRouter = async (
  root: string,
  compileJavascript: boolean,
) => {
  const router = new Router();

  if (compileJavascript) {
    const appJsPath = "./ui/index.jsx";

    getLogger().debug("Bundling JS...");
    const [, bundledJs] = await Deno.bundle(Deno.realPathSync(appJsPath));
    getLogger().debug("JS Bundling finished.");

    router.get("/index.js", (ctx) => js(ctx, bundledJs));
  }

  return router
    .get("/", serveStaticFiles(root))
    .get("/:path", serveStaticFiles(root));
};
