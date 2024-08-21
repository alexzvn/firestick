FROM oven/bun:1.1-alpine as Builder

WORKDIR /webview

ADD web/package.json web/bun.lockb ./
RUN bun install
ADD web .

RUN bunx vite build

FROM node:22-alpine as Runner

WORKDIR /app

ADD server/package.json server/yarn.lock ./
RUN yarn install --production

ADD server .
COPY --from=Builder /webview/dist ./public

EXPOSE 3000

CMD touch .env && node --import tsx --env-file=.env index.ts