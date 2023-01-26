import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule, registerEnumType } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import path from 'path'

import { SortOrder } from './interfaces'
import { AllReadingsModule } from './resolvers/all-readings/all-readings.module'
import { LatestReadingModule } from './resolvers/latest-reading/latest-reading.module'
import { ReadingModule } from './resolvers/reading/reading.module'

@Module({
  imports: [
    // Resolver modules
    AllReadingsModule,
    LatestReadingModule,
    ReadingModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), '..', 'schema.gql'),
      persistedQueries: false
    }),

    ServeStaticModule.forRoot({
      // Note: this only works when run from the root of the repo (this is what docker does)
      rootPath: path.join(process.cwd(), 'client', 'dist')
    })
  ]
})
export class AppModule {
  constructor() {
    registerEnumType(SortOrder, { name: 'SortOrder' })
  }
}
