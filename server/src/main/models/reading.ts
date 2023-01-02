import { Field, ObjectType } from '@nestjs/graphql'

interface LatestReadingVals {
  batteryVoltage: number
  outputWatts: number
  timestamp: number
}

@ObjectType()
class Reading {
  @Field({ name: 'batteryVoltage' })
  public readonly batteryVoltage: number

  @Field({ name: 'outputWatts' })
  public readonly outputWatts: number

  @Field({ name: 'timestamp' })
  public readonly timestamp: number

  constructor(vals: LatestReadingVals) {
    this.batteryVoltage = vals.batteryVoltage
    this.outputWatts = vals.outputWatts
    this.timestamp = vals.timestamp
  }
}

export { Reading }
