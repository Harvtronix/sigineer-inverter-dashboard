import { NodeEnv } from './interfaces.js'

class Runtime {
  public readonly nodeEnv: NodeEnv
  public readonly inverterPaths: Array<string>

  public constructor() {
    this.nodeEnv = process.env.NODE_ENV === 'production' ? NodeEnv.Production : NodeEnv.Development

    // For example: INVERTER_PATHS=/dev/ttyUSB0,/dev/ttyUSB1
    this.inverterPaths = process.env.INVERTER_PATHS ? process.env.INVERTER_PATHS.split(',') : []

    console.log('nodeEnv:      ', this.nodeEnv)
    console.log('inverterPaths:', this.inverterPaths)
  }
}

export { Runtime }
