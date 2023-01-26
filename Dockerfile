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

# This dep is not compatible with esbuild so it is installed "externally"
RUN npm install serialport

# Server files
COPY --from=builder /app/server/dist/out.cjs server/dist/out.cjs

# Client files
COPY --from=builder /app/client/dist client/dist

EXPOSE 3000

CMD ["node", "server/dist/out.cjs"]
