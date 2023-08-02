import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module.js'
import { DbService } from './db.service.js'
import { readInverterData } from './read-all-inverter-data.js'
import { Runtime } from './runtime.js'

const INVERTER_READ_INTERVAL = 30000 // ms
const PORT = process.env.PORT ?? 3000
const runtime = new Runtime()

function createReadInterval() {
  const db = new DbService()

  const fxn = async () => {
    try {
      const rawReadings = await readInverterData(runtime)
      await Promise.all(rawReadings.map((rawReading) => db.insertRawReading(rawReading)))
    } catch (err) {
      console.error(new Date(), 'Error encountered while reading inverter data', err)
    }

    setTimeout(() => {
      fxn()
    }, INVERTER_READ_INTERVAL)
  }

  console.log(new Date(), 'Queuing initial data retrieval')
  setTimeout(() => {
    fxn()
  }, INVERTER_READ_INTERVAL)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)
}

createReadInterval()
bootstrap()

// TODO: the db now has raw readings from multiple inverters in it, keyed by inverterRef.
// Need to adjust the graphql endpoints to become aware of this.
