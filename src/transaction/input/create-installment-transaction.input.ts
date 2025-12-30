import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Prisma } from '@prisma/client';

@InputType()
export class CreateInstallmentTransactionInput {
  @Field(() => String, { description: 'Descrição da transação' })
  description: string;

  @Field(() => GraphQLDecimal, { description: 'Valor total da compra' })
  totalAmount: Prisma.Decimal;

  @Field(() => Int, { description: 'Número de parcelas' })
  totalInstallments: number;

  @Field(() => Date, { description: 'Data da primeira parcela' })
  startDate: Date;

  @Field(() => ID, { description: 'ID da conta cartão de crédito' })
  sourceAccountId: string;
}
