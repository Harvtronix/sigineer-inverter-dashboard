import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { DbService } from './db.service'
import { readInverterData } from './read-inverter-data'
import { Runtime } from './runtime'

const INVERTER_READ_INTERVAL = 30000 // ms
const PORT = process.env.PORT || 3000
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
