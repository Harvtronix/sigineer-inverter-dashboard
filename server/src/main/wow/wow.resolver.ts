import { Query, Resolver } from '@nestjs/graphql'

import { Wow } from './wow.js'

@Resolver(Wow)
export class WowResolver {
  @Query(() => [Wow])
  wow(): Wow[] {
    return [new Wow("it's a name")]
  }
}
