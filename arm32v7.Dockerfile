FROM arm32v7/node:alpine as build

WORKDIR /build
COPY . .
RUN yarn && yarn build
RUN ls -al

FROM arm32v7/node:alpine

WORKDIR /app
COPY --from=build /build/dist dist
COPY ./src/public dist/public
COPY package.json .
COPY yarn.lock .
RUN yarn --production

ENTRYPOINT [ "node", "dist" ]

