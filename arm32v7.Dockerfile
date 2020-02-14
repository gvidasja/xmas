FROM arm32v7/node:alpine as build

WORKDIR /build
COPY . .
RUN yarn && yarn build
RUN ls -al

FROM arm32v7/node:alpine

WORKDIR /app
COPY --from=build /build/dist dist
COPY package.json .
COPY yarn.lock .
RUN yarn --production

ENV NODE_ENV production

ENTRYPOINT [ "node", "dist/server" ]

