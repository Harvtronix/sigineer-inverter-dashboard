import { Module } from '@nestjs/common'

import { DbService } from '../../db.service'
import { ReadingResolver } from './reading.resolver'

@Module({ providers: [ReadingResolver, DbService] })
class ReadingModule {}

export { ReadingModule }
