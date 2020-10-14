FROM hayd/deno:alpine as build

WORKDIR /app
COPY src/ui scripts/bundle-ui.ts ./
RUN deno run --unstable --allow-net --allow-write --allow-read bundle-ui.ts public index.jsx dist

FROM hayd/deno:alpine

WORKDIR /app
ENV ENV=prod
ENV UI_PATH=/app/dist

COPY src/server .
RUN deno cache --unstable server.ts
COPY --from=build /app/dist dist

CMD [ "deno", "run", "--allow-write", "--allow-net", "--allow-read", "--allow-env", "server.ts" ]