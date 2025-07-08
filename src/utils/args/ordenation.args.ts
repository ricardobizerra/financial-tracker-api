import { Type } from '@nestjs/common';
import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { getFieldsAndDecoratorForType } from '@nestjs/graphql/dist/schema-builder/utils/get-fields-and-decorator.util';

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});

type OrderableKeys<T, NonOrderableFields extends keyof T> = Exclude<
  keyof T,
  NonOrderableFields
>;

export function Ordenation<
  T extends object,
  NonOrderableFields extends keyof T = never,
>(Model: Type<T>, nonOrderableFields: NonOrderableFields[] = []) {
  const { fields } = getFieldsAndDecoratorForType(Model);

  if (fields.length === 0) {
    throw new Error(
      `Could not detect any fields for ${Model.name}. Make sure your model has @Field decorators or proper class properties.`,
    );
  }

  const orderableFields = fields.filter(
    (field) => !nonOrderableFields.includes(field.name as NonOrderableFields),
  );

  if (orderableFields.length === 0) {
    throw new Error(
      `No orderable fields found for ${Model.name}. All fields are marked as non-orderable. Available fields: ${orderableFields.join(', ')}`,
    );
  }

  const OrderBy: Record<string, string> = {};

  for (const field of orderableFields) {
    OrderBy[field.name] = field.name;
  }

  registerEnumType(OrderBy, {
    name: `Ordenation${Model.name}`,
  });

  @ArgsType()
  abstract class OrdenationType {
    @Field(() => OrderBy, { nullable: true })
    orderBy: OrderableKeys<T, NonOrderableFields>;

    @Field(() => OrderDirection, { nullable: true })
    orderDirection: OrderDirection;
  }

  return OrdenationType;
}
