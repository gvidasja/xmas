ARG BASE_IMAGE=node:alpine

FROM ${BASE_IMAGE} as build

WORKDIR /build
COPY . .
RUN yarn && yarn build

FROM ${BASE_IMAGE}

WORKDIR /app
COPY --from=build /build/dist dist
COPY package.json .
COPY yarn.lock .
RUN yarn --production

ENV NODE_ENV production
ENV UI_PATH /app/dist/client

ENTRYPOINT [ "node", "dist/server" ]

