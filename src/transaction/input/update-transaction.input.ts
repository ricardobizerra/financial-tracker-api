import { PaymentMethod, TransactionStatus } from '@/lib/graphql/prisma-client';
import { Field, ID, InputType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: keyof typeof PaymentMethod;

  @Field(() => TransactionStatus, { nullable: true })
  status?: keyof typeof TransactionStatus;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Se true e a data for hoje, marca como COMPLETED. Se false ou não informado, usa PLANNED para hoje.',
  })
  isCompleted?: boolean;
}
