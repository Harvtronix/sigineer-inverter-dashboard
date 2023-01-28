FROM node:18 as builder
WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN npm install

RUN npm run all:build
RUN npm run all:bundle

###

FROM node:18
WORKDIR /app

ENV NODE_ENV=production

# This dep is not compatible with esbuild so it is installed "externally"
RUN npm -g install serialport

# Server files
COPY --from=builder /app/server/dist/out.cjs server/dist/out.cjs

# Client files
COPY --from=builder /app/client/dist client/dist

EXPOSE 3000

CMD ["node", "server/dist/out.cjs"]
