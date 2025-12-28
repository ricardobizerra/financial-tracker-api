import {
  PaymentMethod,
  TransactionCreateWithoutUserInput,
  TransactionStatus,
} from '@/lib/graphql/prisma-client';
import { Field, ID, InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput extends OmitType(
  TransactionCreateWithoutUserInput,
  [
    'id',
    'createdAt',
    'updatedAt',
    'destinyAccount',
    'sourceAccount',
    'cardBilling',
    'status', // Excluir status - será calculado pelo backend
  ] as const,
) {
  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: keyof typeof PaymentMethod;

  @Field(() => TransactionStatus, { nullable: true })
  status?: keyof typeof TransactionStatus;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Se true e a data for hoje, marca como COMPLETED. Se false ou não informado, usa PLANNED para hoje.',
  })
  isCompleted?: boolean;

  @Field(() => ID, {
    nullable: true,
  })
  sourceAccountId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  destinyAccountId?: string;
}
