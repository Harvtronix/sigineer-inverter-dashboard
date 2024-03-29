import ModbusRTU from 'modbus-serial'
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU'
import { Inverter } from './inverter.js'
import { RawReading } from '../interfaces.js'

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
    [145, /* 145 - 145 + */ 1],
    [180, 224 - 180 + 1],
    [360, 381 - 360 + 1]
  ] as Array<[number, number]>
}

const BAUD_RATE = 9600
const INVERTER_READ_TIMEOUT = 15000

class SigineerInverter extends Inverter {
  private readonly addr: string
  private connection?: ModbusRTU

  public constructor(addr: string) {
    super()
    this.addr = addr
  }

  private async connect() {
    const c = new ModbusRTU()
    await c.connectRTUBuffered(this.addr, { baudRate: BAUD_RATE })
    this.connection = c

    console.log(new Date(), 'connection established to', this.addr)
  }

  private disconnect() {
    return new Promise<void>((resolve) => {
      if (!this.connection) {
        resolve()
        return
      }

      this.connection.close(() => {
        console.log(new Date(), 'closed connection to', this.addr)
        resolve()
      })
    })
  }

  /**
   * Reads from the specified set of registers on the inverter. This is a serial connection
   * operation and therefore may take some time to complete.
   */
  private async readRegisters(registerType: keyof typeof registerRanges) {
    console.log(new Date(), '-> readRegisters', registerType)

    if (!this.connection) {
      throw new Error('Not connected to inverter')
    }

    const dataMap: RegisterData = {}
    let readFunction: (dataAddress: number, length: number) => Promise<ReadRegisterResult>

    switch (registerType) {
      case 'holding':
        readFunction = this.connection.readHoldingRegisters.bind(this.connection)
        break
      case 'input':
        readFunction = this.connection.readInputRegisters.bind(this.connection)
        break
    }

    // Read each of the registers within the range
    for (const range of registerRanges[registerType]) {
      const response = await readFunction(range[0], range[1])

      let curRegister = range[0]
      response.data.forEach((registerValue: number) => {
        dataMap[curRegister] = registerValue
        curRegister++
      })
    }

    console.log(new Date(), '<- readRegisters', dataMap)
    return dataMap
  }

  public override async readRawData(): Promise<RawReading> {
    let holdingRegisterData
    let inputRegisterData

    await this.connect()

    try {
      holdingRegisterData = await Promise.race([
        this.readRegisters('holding'),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Inverter read timeout')), INVERTER_READ_TIMEOUT)
        })
      ])
      inputRegisterData = await Promise.race([
        this.readRegisters('input'),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Inverter read timeout')), INVERTER_READ_TIMEOUT)
        })
      ])
    } finally {
      // Attempt a disconnect without failing the presumed-successful read operation
      try {
        await this.disconnect()
      } catch {}
    }

    return {
      inverterRef: this.addr,
      timestamp: new Date().toISOString(),
      holdingRegisters: holdingRegisterData as RawReading['holdingRegisters'],
      inputRegisters: inputRegisterData as RawReading['inputRegisters']
    }
  }
}

/**
 * Converts a set of register values to a string of ascii characters.
 */
function registersToAscii(...registerValues: Array<number>) {
  const serial = registerValues
    .map((word) => [word >>> 8, word & 0xff])
    .reduce((prev, cur) => prev.concat(cur), [])

  return String.fromCharCode(...serial)
}

export { SigineerInverter, registersToAscii }
