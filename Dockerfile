FROM node:16-alpine as builder
WORKDIR /app

COPY . .

RUN npm install

RUN NODE_ENV=production npm run all:build
RUN NODE_ENV=production npm run all:bundle

###

FROM node:16-alpine
WORKDIR /app

ENV NODE_ENV=production

# Server files
COPY --from=builder /app/server/dist/out.cjs server/dist/out.cjs

# Client files
COPY --from=builder /app/client/dist client/dist
COPY --from=builder /app/client/.next/static client/.next/static

EXPOSE 3000

CMD ["node", "server/dist/out.cjs"]
