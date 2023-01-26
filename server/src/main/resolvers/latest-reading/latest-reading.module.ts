import { Module } from '@nestjs/common'

import { DbService } from '../../db.service'
import { LatestReadingResolver } from './latest-reading.resolver'

@Module({ providers: [LatestReadingResolver, DbService] })
class LatestReadingModule {}

export { LatestReadingModule }
