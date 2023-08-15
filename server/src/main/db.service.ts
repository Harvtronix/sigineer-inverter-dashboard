import { Injectable } from '@nestjs/common'
import { JSONFile, Low } from 'lowdb'

import { DB, RawReading } from './interfaces.js'
import { Reading } from './models/reading.js'

@Injectable()
export class DbService {
  private readonly dbFile = './db.json'
  private readonly adapter: JSONFile<DB>
  private readonly db: Low<DB>

  public constructor() {
    this.adapter = new JSONFile<DB>(this.dbFile)
    this.db = new Low(this.adapter)
  }

  private async getData() {
    await this.db.read()

    this.db.data ||= {
      readings: []
    }

    return this.db.data
  }

  public async getAllReadings() {
    const data = await this.getData()

    return data.readings.map((reading) => new Reading(reading))
  }

  public async insertRawReadings(...rawReadings: Array<RawReading>) {
    const data = await this.getData()

    rawReadings.forEach((rawReading) => data.readings.push(rawReading))
    return this.db.write()
  }
}
