import { Field, ObjectType } from '@nestjs/graphql'

import { InputRegister, RawReading } from '../interfaces.js'

@ObjectType()
class Reading {
  @Field({ name: 'inverterRef' })
  public readonly inverterRef: string

  @Field({ name: 'batteryVoltage' })
  public readonly batteryVoltage: number

  @Field({ name: 'outputWatts' })
  public readonly outputWatts: number

  @Field({ name: 'timestamp' })
  public readonly timestamp: Date

  constructor(rawReading: RawReading) {
    this.inverterRef = rawReading.inverterRef
    this.batteryVoltage = getBatteryVoltage(rawReading)
    this.outputWatts = getOutputWatts(rawReading)
    this.timestamp = new Date(rawReading.timestamp)
  }

  public compare(to: Reading) {
    if (this.timestamp === to.timestamp) {
      return 0
    }

    if (this.timestamp < to.timestamp) {
      return -1
    }

    return 1
  }
}

function getBatteryVoltage(rawReading: RawReading) {
  return rawReading.inputRegisters[InputRegister.BatteryVolt] / 100
}

function getOutputWatts(rawReading: RawReading) {
  return (
    Number.parseInt(
      rawReading.inputRegisters[InputRegister.OutputActivePowerHigh].toString() +
        rawReading.inputRegisters[InputRegister.OutputActivePowerLow].toString()
    ) / 10
  )
}

export { Reading }
