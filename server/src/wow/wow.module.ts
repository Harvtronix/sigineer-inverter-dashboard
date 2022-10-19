import { Module } from '@nestjs/common'

import { WowResolver } from './wow.resolver'

@Module({ providers: [WowResolver] })
class WowModule {}

export { WowModule }
