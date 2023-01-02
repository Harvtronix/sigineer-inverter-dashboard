import { Module } from '@nestjs/common'

import { DbService } from '../../db.service.js'
import { LatestReadingResolver } from './latest-reading.resolver.js'

@Module({ providers: [LatestReadingResolver, DbService] })
class LatestReadingModule {}

export { LatestReadingModule }
