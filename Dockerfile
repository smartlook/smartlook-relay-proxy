FROM node:16-alpine as base

ENV HOME=/home/node/app
WORKDIR $HOME

COPY package*.json ./

RUN npm i

COPY . .
