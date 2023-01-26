import { Module } from '@nestjs/common'

import { DbService } from '../../db.service'
import { AllReadingsResolver } from './all-readings.resolver'

@Module({ providers: [AllReadingsResolver, DbService] })
class AllReadingsModule {}

export { AllReadingsModule }
