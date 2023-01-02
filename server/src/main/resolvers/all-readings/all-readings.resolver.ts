import { Args, Int, Query, Resolver } from '@nestjs/graphql'

import { DbService } from '../../db.service.js'
import { SortOrder } from '../../interfaces.js'
import { Reading } from '../../models/reading.js'

@Resolver()
class AllReadingsResolver {
  private readonly dbService: DbService

  public constructor(dbService: DbService) {
    this.dbService = dbService
  }

  @Query(() => [Reading], { name: 'allReadings' })
  async getAllReadings(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('sort', { type: () => SortOrder, nullable: true }) sortOrder?: SortOrder
  ): Promise<Array<Reading>> {
    let readings = await this.dbService.getAllReadings()

    switch (sortOrder) {
      case SortOrder.asc:
        readings.sort((a, b) => a.compare(b))
        break
      case SortOrder.desc:
        readings.sort((a, b) => b.compare(a))
        break
      default:
        break
    }

    if (limit && limit > 0) {
      readings = readings.slice(0, limit)
    }

    return readings
  }
}

export { AllReadingsResolver }
