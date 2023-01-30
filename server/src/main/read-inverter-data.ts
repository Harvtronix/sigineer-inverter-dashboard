import { HoldingRegister, InputRegister, NodeEnv, RawReading } from './interfaces.js'
import { Runtime } from './runtime.js'
import { SigineerInverter } from './sigineer-inverter.js'

const INVERTER_READ_TIMEOUT = 15000

async function readInverterData(runtime: Runtime): Promise<RawReading> {
  console.log(new Date(), 'Reading inverter data')

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

  let holdingRegisterData
  let inputRegisterData
  // TODO: handle multiple inverters
  const inverter = new SigineerInverter(runtime.inverterPaths[0])

  inverter.connect()

  try {
    holdingRegisterData = await Promise.race([
      inverter.readRegisters('holding'),
      new Promise((_, reject) => {
        setTimeout(reject, INVERTER_READ_TIMEOUT)
      })
    ])
    inputRegisterData = await Promise.race([
      inverter.readRegisters('input'),
      new Promise((_, reject) => {
        setTimeout(reject, INVERTER_READ_TIMEOUT)
      })
    ])
  } finally {
    try {
      await inverter.disconnect()
    } catch {}
  }

  return {
    timestamp: new Date().toISOString(),
    holdingRegisters: holdingRegisterData as RawReading['holdingRegisters'],
    inputRegisters: inputRegisterData as RawReading['inputRegisters']
  }
}

export { readInverterData }
