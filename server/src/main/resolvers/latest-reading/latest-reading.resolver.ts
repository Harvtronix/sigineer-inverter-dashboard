import { Query, Resolver } from '@nestjs/graphql'

import { DbService } from '../../db.service'
import { Reading } from '../../models/reading'

@Resolver()
class LatestReadingResolver {
  private readonly dbService: DbService

  public constructor(dbService: DbService) {
    this.dbService = dbService
  }

  @Query(() => Reading, { name: 'latestReading' })
  async getCurrentReading(): Promise<Reading> {
    const readings = await this.dbService.getAllReadings()

    readings.sort((a, b) => a.compare(b))

    const reading = readings.at(-1)

    if (!reading) {
      throw new Error('No readings')
    }

    return reading
  }
}

export { LatestReadingResolver }
