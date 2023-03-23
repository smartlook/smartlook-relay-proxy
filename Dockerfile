ARG NODE_VERSION=18
ARG PNPM_VERSION=7
ARG COMMIT_SHA="unknown"

################################################################
#                                                              #
#                     Prepare alpine image                     #
#                                                              #
################################################################

FROM node:${NODE_VERSION}-alpine as node-alpine

ARG PNPM_VERSION

RUN apk --no-cache add curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN npm install --global pnpm@${PNPM_VERSION}

################################################################
#                                                              #
#                   Prepare distroless image                   #
#                                                              #
################################################################

FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian11:nonroot as node-distroless

################################################################
#                                                              #
#        Install all dependencies and build TypeScript         #
#                                                              #
################################################################

FROM node-alpine as build-js

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm fetch

COPY tsconfig.base.json tsconfig.base.json
COPY tsconfig.prod.json tsconfig.prod.json
COPY src src

RUN pnpm install --offline --frozen-lockfile
RUN ./node_modules/.bin/tsc --project ./tsconfig.prod.json

################################################################
#                                                              #
#  Install only production dependencies & prune unused files   #
#                                                              #
################################################################

FROM node-alpine as install-prod-deps

ENV NODE_ENV="production"

COPY --from=build-js package.json package.json
COPY --from=build-js pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm fetch
RUN pnpm install --offline --frozen-lockfile --prod
RUN node-prune

################################################################
#                                                              #
#             Copy only necessary data for runtime             #
#                                                              #
################################################################

FROM node-distroless as final

ARG COMMIT_SHA

ENV NODE_OPTIONS="--enable-source-maps"
ENV NODE_ENV="production"
ENV COMMIT_SHA=${COMMIT_SHA}

COPY --from=build-js --chown=nonroot:nonroot package.json package.json
COPY --from=build-js --chown=nonroot:nonroot build build
COPY --from=install-prod-deps --chown=nonroot:nonroot node_modules node_modules

USER nonroot:nonroot
CMD ["./build/src/main.js"]
