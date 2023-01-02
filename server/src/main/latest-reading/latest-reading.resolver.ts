import { Query, Resolver } from '@nestjs/graphql'
import { DbService } from '../db.service.js'

import { Reading } from '../models/reading.js'

@Resolver()
export class LatestReadingResolver {
  private readonly dbService: DbService

  public constructor(dbService: DbService) {
    this.dbService = dbService
  }

  @Query(() => Reading, { name: 'latestReading' })
  async getCurrentReading(): Promise<Reading> {
    const readings = await this.dbService.getAllReadings()

    const reading = this.dbService.sort(readings).at(-1)

    if (!reading) {
      throw new Error('No readings')
    }

    return new Reading({
      batteryVoltage: this.dbService.getBatteryVoltage(reading),
      outputWatts: this.dbService.getOutputWatts(reading),
      timestamp: reading.timestamp
    })
  }
}
