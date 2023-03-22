# Development (hot-reload)
FROM node:18-alpine as dev

ENV HOME=/home/node/app
WORKDIR $HOME

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "npm", "run", "dev" ]

# Build for production
FROM node:18-alpine as build

ENV HOME=/home/node/app
WORKDIR $HOME

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

# Production
FROM node:18-alpine as prod

ENV HOME=/home/node/app
ENV NODE_ENV=production
ENV PROXY_PORT=8000

WORKDIR $HOME

COPY --from=build /home/node/app/build ./build
COPY --from=build /home/node/app/package*.json ./

RUN npm ci --only=production

EXPOSE 8000

USER node

CMD [ "node", "build/index.js" ]
