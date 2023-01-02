import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule, registerEnumType } from '@nestjs/graphql'
import path from 'path'

import { SortOrder } from './interfaces.js'
import { AllReadingsModule } from './resolvers/all-readings/all-readings.module.js'
import { LatestReadingModule } from './resolvers/latest-reading/latest-reading.module.js'
import { ReadingModule } from './resolvers/reading/reading.module.js'

@Module({
  imports: [
    // Resolver modules
    AllReadingsModule,
    LatestReadingModule,
    ReadingModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), '..', 'schema.gql')
    })
  ]
})
export class AppModule {
  constructor() {
    registerEnumType(SortOrder, { name: 'SortOrder' })
  }
}
