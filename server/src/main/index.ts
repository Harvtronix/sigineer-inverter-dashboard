import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module.js'
import { DbService } from './db.service.js'
import { readInverterData } from './read-inverter-data.js'
import { Runtime } from './runtime.js'

const INVERTER_READ_INTERVAL = 30000 // ms
const PORT = process.env.PORT || 4000
const runtime = new Runtime()

function createReadInterval() {
  const db = new DbService()

  setInterval(async () => {
    const rawReading = await readInverterData(runtime)
    await db.insertRawReading(rawReading)
  }, INVERTER_READ_INTERVAL)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)
}

createReadInterval()
bootstrap()
