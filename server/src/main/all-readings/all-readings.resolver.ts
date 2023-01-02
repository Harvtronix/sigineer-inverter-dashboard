import { Query, Resolver } from '@nestjs/graphql'
import { DbService } from '../db.service.js'
import { Reading } from '../models/reading.js'

@Resolver()
export class AllReadingsResolver {
  private readonly dbService: DbService

  public constructor(dbService: DbService) {
    this.dbService = dbService
  }

  @Query(() => [Reading], { name: 'allReadings' })
  async getAllReadings(): Promise<Array<Reading>> {
    const readings = await this.dbService.getAllReadings()
    const sortedReadings = this.dbService.sort(readings)

    return sortedReadings.map(
      (reading) =>
        new Reading({
          batteryVoltage: this.dbService.getBatteryVoltage(reading),
          outputWatts: this.dbService.getOutputWatts(reading),
          timestamp: reading.timestamp
        })
    )
  }
}
