import { Args, Query, Resolver } from '@nestjs/graphql'

import { DbService } from '../../db.service.js'
import { Reading } from '../../models/reading.js'

@Resolver()
class ReadingResolver {
  private readonly dbService: DbService

  public constructor(dbService: DbService) {
    this.dbService = dbService
  }

  @Query(() => Reading, { name: 'reading', nullable: true })
  async getReading(@Args('timestamp') timestamp: Date): Promise<Reading | undefined> {
    const readings = await this.dbService.getAllReadings()

    return readings.find((reading) => reading.timestamp.getTime() === timestamp.getTime())
  }
}

export { ReadingResolver }
