import { Module } from '@nestjs/common'

import { WowResolver } from './wow.resolver.js'

@Module({ providers: [WowResolver] })
class WowModule {}

export { WowModule }
