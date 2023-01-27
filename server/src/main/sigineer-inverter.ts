import ModbusRTU from 'modbus-serial'
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU'

interface RegisterData {
  [key: number]: number
}

const registerRanges = {
  holding: [
    [0, 74],
    [76, 5],
    [161, 2]
  ] as Array<[number, number]>,
  input: [
    [0, 83],
    [90, 13],
    [117, 14],
    [145, 1],
    [180, 45],
    [360, 22]
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
      c.connectRTUBuffered(this.addr, { baudRate: BAUD_RATE }).then(() => {
        console.log(c.isOpen)
        console.log(c.getID())
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
    const dataMap: RegisterData = {}
    let readFunction: (...args: Array<number>) => Promise<ReadRegisterResult>

    switch (registerType) {
      case 'holding':
        readFunction = inverter.readHoldingRegisters
        break
      case 'input':
        readFunction = inverter.readInputRegisters
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
