import { HoldingRegister, InputRegister, NodeEnv, RawReading } from './interfaces.js'
import { Runtime } from './runtime.js'
import { SigineerInverter } from './sigineer-inverter.js'

async function readInverterData(runtime: Runtime): Promise<RawReading> {
  if (runtime.nodeEnv === NodeEnv.Development) {
    return readDevData()
  } else {
    return await readProdData(runtime)
  }
}

function readDevData(): RawReading {
  return {
    timestamp: new Date().toISOString(),
    holdingRegisters: {
      [HoldingRegister.OutputVoltType]: 1,
      [HoldingRegister.Serial1]: 1,
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

async function readProdData(runtime: Runtime): Promise<RawReading> {
  // Guard -- no inverter paths available
  if (runtime.inverterPaths.length === 0 || !runtime.inverterPaths[0]) {
    throw new Error('No inverter paths found. Export them via "INVERTER_PATHS" envvar')
  }

  // TODO: handle multiple inverters
  const inverter = new SigineerInverter(runtime.inverterPaths[0])

  const holdingRegisterData = await inverter.readRegisters('holding')
  const inputRegisterData = await inverter.readRegisters('input')

  return {
    timestamp: new Date().toISOString(),
    holdingRegisters: holdingRegisterData as RawReading['holdingRegisters'],
    inputRegisters: inputRegisterData as RawReading['inputRegisters']
  }
}

export { readInverterData }
