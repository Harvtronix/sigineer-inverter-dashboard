import { RawReading } from '../interfaces'

abstract class Inverter {
  abstract readRawData(): Promise<RawReading>
}

export { Inverter }
