import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Wow {
  @Field({ name: 'name' })
  public name: string

  constructor(name: string) {
    this.name = name
  }
}

export { Wow }
