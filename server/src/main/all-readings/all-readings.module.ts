import { Module } from '@nestjs/common'
import { DbService } from '../db.service.js'

import { AllReadingsResolver } from './all-readings.resolver.js'

@Module({ providers: [AllReadingsResolver, DbService] })
class AllReadingsModule {}

export { AllReadingsModule }
