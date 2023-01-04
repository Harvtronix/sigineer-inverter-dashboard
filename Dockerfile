FROM node:16-alpine as builder
WORKDIR /app

COPY . .

RUN npm install

RUN NODE_ENV=production npm run all:build
RUN NODE_ENV=production npm --workspace server run bundle

###

FROM node:16-alpine
WORKDIR /app

ENV NODE_ENV=production

RUN npm install concurrently

# Server files
COPY --from=builder /app/server/dist/out.js server/dist/out.js

# Client files
COPY --from=builder /app/client/.next/standalone .
COPY --from=builder /app/client/.next/static client/.next/static

EXPOSE 3000
EXPOSE 4000

CMD ["npx", "concurrently", "node client/server.js", "node server/dist/out.js"]
