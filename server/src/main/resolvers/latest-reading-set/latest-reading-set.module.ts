import { Module } from '@nestjs/common'

import { DbService } from '../../db.service.js'
import { LatestReadingSetResolver } from './latest-reading-set.resolver.js'
import { Runtime } from '../../runtime.js'

@Module({ providers: [LatestReadingSetResolver, DbService, Runtime] })
class LatestReadingModule {}

export { LatestReadingModule }
