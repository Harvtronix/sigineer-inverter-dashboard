import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import path from 'path'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { WowModule } from './wow/wow.module.js'

@Module({
  imports: [
    // Resolver modules
    WowModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), '..', 'schema.gql')
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
