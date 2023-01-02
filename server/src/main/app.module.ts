import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import path from 'path'
import { AllReadingsModule } from './all-readings/all-readings.module.js'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { LatestReadingModule } from './latest-reading/latest-reading.module.js'

@Module({
  imports: [
    // Resolver modules
    LatestReadingModule,
    AllReadingsModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), '..', 'schema.gql')
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
