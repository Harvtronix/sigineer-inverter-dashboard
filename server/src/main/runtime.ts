import { NodeEnv } from './interfaces.js'
import { Injectable } from '@nestjs/common'

@Injectable()
class Runtime {
  public readonly nodeEnv: NodeEnv
  public readonly inverterPaths: Array<string>

  public constructor() {
    this.nodeEnv = process.env.NODE_ENV === 'production' ? NodeEnv.Production : NodeEnv.Development

    // For example: INVERTER_PATHS=/dev/ttyUSB0,/dev/ttyUSB1
    this.inverterPaths = process.env.INVERTER_PATHS ? process.env.INVERTER_PATHS.split(',') : []

    console.log(new Date(), 'nodeEnv:      ', this.nodeEnv)
    console.log(new Date(), 'inverterPaths:', this.inverterPaths)
  }
}

export { Runtime }
