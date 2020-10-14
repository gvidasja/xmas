import type { Context } from "https://deno.land/x/oak@v6.2.0/context.ts";

export const json = <T>(ctx: Context, obj: T, status = 200) => {
  ctx.response.status = status;
  ctx.response.headers.set("Content-Type", "application/json; charset=utf-8");
  ctx.response.body = JSON.stringify(obj);
};

export const js = (ctx: Context, content: string) => {
  ctx.response.headers.set("Content-Type", "text/javascript; charset=utf-8");
  ctx.response.body = content;
};

export const unauthorized = (ctx: Context, message: string) => {
  ctx.response.status = 401;
  ctx.response.headers.set(
    "WWW-Authenticate",
    `Basic realm=xmas.gvidasja.com, charset=UTF-8, error=${message}`,
  );
};
