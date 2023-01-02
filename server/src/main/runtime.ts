import { NodeEnv } from './interfaces.js'

class Runtime {
  public readonly nodeEnv: NodeEnv

  public constructor() {
    this.nodeEnv = process.env.NODE_ENV === 'production' ? NodeEnv.Production : NodeEnv.Development
  }
}

export { Runtime }
