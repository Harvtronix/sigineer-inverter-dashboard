import { Module } from '@nestjs/common'

import { DbService } from '../../db.service.js'
import { ReadingResolver } from './reading.resolver.js'

@Module({ providers: [ReadingResolver, DbService] })
class ReadingModule {}

export { ReadingModule }
