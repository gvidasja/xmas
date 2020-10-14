FROM node:alpine as build

WORKDIR /build
COPY . .
RUN yarn && yarn build

FROM node:alpine

WORKDIR /app
COPY --from=build /build/dist dist
COPY package.json .
COPY yarn.lock .
RUN yarn --production

ENV NODE_ENV production
ENV UI_PATH /app/dist/client

ENTRYPOINT [ "node", "dist/server" ]

