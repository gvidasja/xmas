import { unauthorized } from "./httpResponse.ts";
import type { Middleware } from "https://deno.land/x/oak@v6.2.0/mod.ts";

export const singleUserBasicAuth = (
  username: string,
  password: string,
): Middleware =>
  async (ctx, next) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader) {
      return (unauthorized(ctx, "Authorization header not provided"));
    }

    const encodedAuth = (authHeader.match(/Basic (.+)/) || [])[1];

    if (!encodedAuth) {
      return unauthorized(ctx, "invalid Authorization header");
    }

    const [requestUsername, requestPassword] = atob(encodedAuth).split(":");

    if ((requestUsername !== username) || (requestPassword !== password)) {
      return unauthorized(
        ctx,
        `invalid username or password ${requestUsername}:${requestPassword}:${username}:${password}`,
      );
    }

    return next();
  };
