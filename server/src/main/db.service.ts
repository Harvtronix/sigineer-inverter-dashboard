import { Injectable } from '@nestjs/common'
import { JSONFile, Low } from 'lowdb'

import { DB } from './interfaces.js'
import { Reading } from './models/reading.js'

@Injectable()
export class DbService {
  private readonly dbFile = '../sample-data-30s-interval.json'
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
}

// const results = db.data.readings
//   .filter((reading) => reading.timestamp >= 1650601226834)
//   .sort((a, b) => a.timestamp - b.timestamp)

// console.log(
//   results.map((reading) => ({
//     time: reading.timestamp,
//     outputType: reading.holdingRegisters[HoldingRegister.OutputVoltType],
//     batteryVoltage: reading.inputRegisters[InputRegister.BatteryVolt] / 100,
//     outputWatts: Number.parseInt(
//       reading.inputRegisters[InputRegister.OutputActivePowerHigh].toString() +
//         reading.inputRegisters[InputRegister.OutputActivePowerLow].toString()
//     )
//   }))
// )
