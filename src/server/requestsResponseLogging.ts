import type { Middleware } from "https://deno.land/x/oak@v6.2.0/middleware.ts";
import type { Logger } from "https://deno.land/std@0.74.0/log/logger.ts";

export const requestResponseLogging = (logger: Logger): Middleware =>
  async (ctx, next) => {
    await next();
    logger.info(
      `${ctx.request.method} ${ctx.request.url}: ${ctx.response.status}`,
    );
  };
