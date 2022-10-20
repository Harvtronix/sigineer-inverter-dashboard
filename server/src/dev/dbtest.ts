import { JSONFile, Low } from 'lowdb'

enum HoldingRegister {
  OutputVoltType = 18,
  Serial5 = 23,
  Serial4 = 24,
  Serial3 = 25,
  Serial2 = 26,
  Serial1 = 27
}

enum InputRegister {
  SystemStatus = 0,
  BatteryVolt = 17,
  OutputActivePowerHigh = 9,
  OutputActivePowerLow = 10
}

interface Reading {
  timestamp: number
  holdingRegisters: {
    [register in HoldingRegister]: number
  }
  inputRegisters: {
    [register in InputRegister]: number
  }
}

interface DB {
  readings: Array<Reading>
}

const adapter = new JSONFile<DB>('sample-data-30s-interval.json')

const db = new Low(adapter)
await db.read()

db.data ||= {
  readings: []
}

const results = db.data.readings
  .filter((reading) => reading.timestamp >= 1650601226834)
  .sort((a, b) => a.timestamp - b.timestamp)

console.log(
  results.map((reading) => ({
    time: reading.timestamp,
    outputType: reading.holdingRegisters[HoldingRegister.OutputVoltType],
    batteryVoltage: reading.inputRegisters[InputRegister.BatteryVolt] / 100,
    outputWatts: Number.parseInt(
      reading.inputRegisters[InputRegister.OutputActivePowerHigh].toString() +
        reading.inputRegisters[InputRegister.OutputActivePowerLow].toString()
    )
  }))
)
