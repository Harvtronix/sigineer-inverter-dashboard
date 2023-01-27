import ModbusRTU from 'modbus-serial'
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU'

interface RegisterData {
  [key: number]: number
}

const registerRanges = {
  holding: [
    [0, 40 - 0 + 1],
    [43, 51 - 43 + 1],
    [57, 73 - 57 + 1],
    [76, 80 - 76 + 1],
    [161, 162 - 161 + 1]
  ] as Array<[number, number]>,
  input: [
    [0, 78 - 0 + 1],
    [80, 82 - 80 + 1],
    [90, 102 - 90 + 1],
    [117, 130 - 117 + 1],
    [145, 145 - 145 + 1],
    [180, 224 - 180 + 1],
    [360, 381 - 360 + 1]
  ] as Array<[number, number]>
}

const BAUD_RATE = 9600

class SigineerInverter {
  /**
   * Converts a set of register values to a string of ascii characters.
   */
  public static registersToAscii(...registerValues: Array<number>) {
    const serial = registerValues
      .map((word) => [word >>> 8, word & 0xff])
      .reduce((prev, cur) => prev.concat(cur), [])

    return String.fromCharCode(...serial)
  }

  private readonly addr: string

  private get connection(): Promise<ModbusRTU> {
    return new Promise((resolve) => {
      const c = new ModbusRTU()
      c.connectRTUBuffered(this.addr, { baudRate: BAUD_RATE }).then(async () => {
        console.log(c.isOpen)
        console.log(c.getID())
        console.log(await c.readInputRegisters(0, 1))
        resolve(c)
      })
    })
  }

  public constructor(addr: string) {
    this.addr = addr
  }

  /**
   * Reads from the specified set of registers on the inverter. This is a serial connection
   * operation and therefore may take some time to complete.
   */
  public async readRegisters(registerType: keyof typeof registerRanges) {
    const inverter = await this.connection
    console.log(inverter)
    console.log(
      await inverter.readInputRegisters(
        registerRanges['input'][0]?.[0] || 0,
        registerRanges['input'][0]?.[1] || 0
      )
    )
    const dataMap: RegisterData = {}
    let readFunction: (dataAddress: number, length: number) => Promise<ReadRegisterResult>

    switch (registerType) {
      case 'holding':
        readFunction = inverter.readHoldingRegisters.bind(inverter)
        break
      case 'input':
        readFunction = inverter.readInputRegisters.bind(inverter)
        break
    }

    try {
      // Read each of the registers within the range
      for (const range of registerRanges[registerType]) {
        console.log(range)
        const response = await readFunction(range[0], range[1])

        let curRegister = range[0]
        response.data.forEach((registerValue: number) => {
          dataMap[curRegister] = registerValue
          curRegister++
        })
      }
    } catch (e) {
      // Quietly dismiss this error to gracefully fall into the connection-close logic
      console.error(e)
    }

    return new Promise((resolve: (value: RegisterData) => void) => {
      inverter.close(() => {
        resolve(dataMap)
      })
    })
  }
}

export { SigineerInverter }
