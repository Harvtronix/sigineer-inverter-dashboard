import { build } from 'esbuild'
import path from 'path'

await build({
  platform: 'node',
  target: 'es2021',
  bundle: true,
  external: [
    '@apollo/gateway',
    '@apollo/subgraph',
    '@nestjs/microservices',
    '@nestjs/websockets',
    'apollo-server-fastify',
    'cache-manager',
    'class-transformer',
    'class-validator',
    'fsevents',
    'ts-morph'
  ],
  entryPoints: [path.resolve(process.cwd(), 'dist', 'main', 'index.js')],
  outfile: path.resolve(process.cwd(), 'dist', 'out.js')
})
