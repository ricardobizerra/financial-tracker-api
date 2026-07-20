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
  institutionLinkId: string;

  @Field(() => GraphQLDecimal)
  initialBalance: Decimal;

  @Field(() => Date, { nullable: true })
  startDate: Date | string;

  @Field(() => Boolean)
  isActive: boolean;
}
