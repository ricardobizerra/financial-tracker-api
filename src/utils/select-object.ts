import { Decimal } from '@prisma/client/runtime/library';

type ExtraModelFields<TDatabase, TModel> = Exclude<
  keyof TModel,
  keyof TDatabase
>;

type RequiredHashFields<TDatabase, TModel> =
  ExtraModelFields<TDatabase, TModel> extends never
    ? Record<string, never> & {
        DEFAULT: (keyof TDatabase)[];
      }
    : {
        [K in ExtraModelFields<TDatabase, TModel>]: (keyof TDatabase)[];
      } & {
        DEFAULT?: (keyof TDatabase)[];
      };

type SelectObjectParams<TDatabase, TModel> =
  ExtraModelFields<TDatabase, TModel> extends never
    ? [
        queriedFields: (keyof TModel)[],
        hashDifferentFields?: RequiredHashFields<TDatabase, TModel>,
      ]
    : [
        queriedFields: (keyof TModel)[],
        hashDifferentFields: RequiredHashFields<TDatabase, TModel>,
      ];

type ScalarFields<T> = {
  [K in keyof T]: T[K] extends object | undefined | null
    ? T[K] extends Date | Decimal | Array<string>
      ? K
      : never
    : K;
}[keyof T];

type RelationFields<T> = Exclude<keyof T, ScalarFields<T>>;

type SelectObjectReturn<TDatabase> = Partial<{
  [K in ScalarFields<TDatabase>]: boolean;
}> &
  Partial<{
    [K in RelationFields<TDatabase>]:
      | boolean
      | { select: SelectObjectReturn<any> };
  }>;

export function selectObject<
  TDatabase extends Record<string, any>,
  TModel extends Partial<TDatabase>,
>(
  ...args: SelectObjectParams<TDatabase, TModel>
): SelectObjectReturn<TDatabase> {
  const [rawQueriedFields, hashDifferentFields] = args;

  const IGNORED_DYNAMIC_FIELDS = new Set([
    'availableLimit',
    'unpaidBalance',
    'usagePercentage',
    'currentBilling',
    'payableBillings',
    'currentBillingAmount',
    'totalInvested',
    'totalAmount',
  ]);

  const queriedFields = rawQueriedFields.filter((field) => {
    const parts = (field as string).split('.');
    return !parts.some((part) => IGNORED_DYNAMIC_FIELDS.has(part));
  });

  const processFields = (fields: (keyof TDatabase)[]) =>
    selectObject<TDatabase, TDatabase>(fields);

  const reduceFields = (
    acc: SelectObjectReturn<TDatabase>,
    field: keyof TModel,
  ) => {
    if (hashDifferentFields && field in hashDifferentFields) {
      const hashedFields = hashDifferentFields[
        field as keyof RequiredHashFields<TDatabase, TModel>
      ] as (keyof TDatabase)[];
      return { ...acc, ...processFields(hashedFields) };
    }

    if ((field as string).includes('.')) {
      const [relation, ...subFields] = (field as string).split('.');
      const subField = subFields.join('.');

      // Se a relation não existe, cria como objeto com select
      if (!acc[relation]) {
        acc[relation] = { select: {} };
      }

      // Se a relation existe mas é true (não é objeto), converte para objeto com select
      if (
        acc[relation] === true ||
        typeof acc[relation] !== 'object' ||
        !('select' in acc[relation])
      ) {
        acc[relation] = { select: {} };
      }

      if (subField.includes('.')) {
        reduceFields(acc[relation].select, subField);
      } else {
        acc[relation].select[subField] = true;
      }
      return acc;
    }

    return { ...acc, [field]: true };
  };

  const reducedFields = queriedFields.reduce(
    reduceFields,
    {} as SelectObjectReturn<TDatabase>,
  );

  if (!hashDifferentFields?.DEFAULT) {
    return reducedFields;
  }

  const defaultFields = processFields(hashDifferentFields.DEFAULT);

  return { ...reducedFields, ...defaultFields };
}
