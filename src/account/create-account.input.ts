import { Field, InputType, ID } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';

@InputType()
export class CreateAccountInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ID)
  institutionConnectionId: string;

  @Field(() => GraphQLDecimal)
  initialBalance: Decimal;

  @Field(() => Boolean)
  isActive: boolean;
}
