import { Query, Resolver } from '@nestjs/graphql'

import { DbService } from '../../db.service.js'
import { Reading } from '../../models/reading.js'
import { Runtime } from '../../runtime.js'

@Resolver()
class LatestReadingSetResolver {
  private readonly dbService: DbService
  private readonly runtime: Runtime

  public constructor(dbService: DbService, runtime: Runtime) {
    this.dbService = dbService
    this.runtime = runtime
  }

  @Query(() => [Reading], { name: 'latestReadingSet' })
  async getCurrentReadingSet(): Promise<Array<Reading>> {
    const readings = await this.dbService.getAllReadings()
    const results: Array<Reading> = []

    if (readings.length === 0) {
      throw new Error('No readings')
    }

    // Sort latest readings to the front of the array
    readings.sort((a, b) => b.compare(a))

    this.runtime.inverterPaths.forEach((inverterRef) => {
      const needle = readings.find((reading) => reading.inverterRef === inverterRef)

      needle !== undefined && results.push(needle)
    })

    return results
  }
}

export { LatestReadingSetResolver }
