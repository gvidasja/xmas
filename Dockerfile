FROM node:alpine as build

WORKDIR /build
COPY . .
RUN yarn && yarn build
RUN ls -al

FROM node:alpine as run

WORKDIR /app
COPY --from=build /build/dist dist
COPY src/public /dist/public
COPY package.json .
COPY yarn.lock .
RUN yarn --production

ENTRYPOINT [ "node", "dist" ]

