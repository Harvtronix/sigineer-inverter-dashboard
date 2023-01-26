import { build } from 'esbuild'
import path from 'path'

await build({
  platform: 'node',
  target: 'es2020',
  bundle: true,
  external: [
    '@apollo/gateway',
    '@apollo/subgraph',
    '@fastify/static',
    '@nestjs/microservices',
    '@nestjs/websockets',
    'apollo-server-fastify',
    'cache-manager',
    'class-transformer',
    'class-validator',
    'fsevents',
    'serialport', // Not compatible with esbuild bundling
    'ts-morph'
  ],
  entryPoints: [path.resolve(process.cwd(), 'dist', 'main', 'index.js')],
  outfile: path.resolve(process.cwd(), 'dist', 'out.cjs')
})
