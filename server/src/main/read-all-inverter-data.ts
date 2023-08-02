import { HoldingRegister, InputRegister, NodeEnv, RawReading } from './interfaces.js'
import { Runtime } from './runtime.js'
import { SigineerInverter } from './inverters/sigineer-inverter.js'

const INVERTER_READ_TIMEOUT = 15000

async function readInverterData(runtime: Runtime): Promise<RawReading[]> {
  console.log(new Date(), 'Reading inverter data')

  if (runtime.nodeEnv === NodeEnv.Development) {
    return [readDevData(1), readDevData(2)]
  } else {
    return await readProdData(runtime)
  }
}

function readDevData(serial: number): RawReading {
  return {
    inverterRef: 'inverter-' + serial,
    timestamp: new Date().toISOString(),
    holdingRegisters: {
      [HoldingRegister.OutputVoltType]: 1,
      [HoldingRegister.Serial1]: serial,
      [HoldingRegister.Serial2]: 1,
      [HoldingRegister.Serial3]: 1,
      [HoldingRegister.Serial4]: 1,
      [HoldingRegister.Serial5]: 1
    },
    inputRegisters: {
      [InputRegister.BatteryVolt]: Math.round(Math.random() * 3000) + 2800, // 2800 - 5800 millivolts
      [InputRegister.OutputActivePowerHigh]: Math.round(Math.random() * 0x0),
      [InputRegister.OutputActivePowerLow]: Math.round(Math.random() * 0xffff),
      [InputRegister.SystemStatus]: 0
    }
  }
}

async function readProdData(runtime: Runtime): Promise<Array<RawReading>> {
  // Guard -- no inverter paths available
  if (runtime.inverterPaths.length === 0 || !runtime.inverterPaths[0]) {
    throw new Error('No inverter paths found. Export them via "INVERTER_PATHS" envvar')
  }

  const promises = runtime.inverterPaths.map((inverterRef) => {
    // In the future, this could be adjusted to accommodate more than one inverter type
    const inverter = new SigineerInverter(inverterRef)

    return inverter.readRawData()
  })

  return Promise.all(promises)
}

export { readInverterData }
