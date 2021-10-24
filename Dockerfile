FROM denoland/deno:alpine as build

WORKDIR /app
COPY src/client scripts/bundle-client.ts ./
RUN deno run --unstable --allow-net --allow-write --allow-read bundle-client.ts public index.js dist

FROM denoland/deno:alpine

WORKDIR /app
ENV ENV=prod
ENV UI_PATH=/app/dist

COPY src/server-deno .
RUN deno cache --unstable server.ts
COPY --from=build /app/dist dist

CMD [ "deno", "run", "--allow-write", "--allow-net", "--allow-read", "--allow-env", "server.ts" ]