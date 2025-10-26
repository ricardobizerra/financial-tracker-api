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
    ? T[K] extends Date | Decimal
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
  const [queriedFields, hashDifferentFields] = args;
  const result: SelectObjectReturn<TDatabase> = {};

  for (const field of queriedFields) {
    if (typeof field !== 'string') continue;

    if (field.includes('.')) {
      const [relation, ...nestedPath] = field.split('.');
      const nestedField = nestedPath.join('.');

      if (!result[relation]) {
        result[relation] = { select: {} };
      } else if (result[relation] === true) {
        continue;
      }

      const relationSelect = (result[relation] as { select: any }).select;

      if (nestedField.includes('.')) {
        Object.assign(relationSelect, selectObject<any, any>([nestedField]));
      } else {
        relationSelect[nestedField] = true;
      }
    } else {
      result[field] = true;
    }
  }

  if (hashDifferentFields) {
    for (const [key, fields] of Object.entries(hashDifferentFields)) {
      if (key === 'DEFAULT') continue;

      if (fields && fields.length > 0) {
        const nestedSelect = selectObject<any, any>(
          fields.filter((f) => typeof f === 'string'),
        );
        if (Object.keys(nestedSelect).length > 0) {
          result[key] = { select: nestedSelect };
        }
      }
    }

    const defaultFields = hashDifferentFields.DEFAULT;
    if (defaultFields?.length > 0) {
      const defaultSelect = selectObject<any, any>(
        defaultFields.filter((f) => typeof f === 'string'),
      );
      for (const [key, value] of Object.entries(defaultSelect)) {
        if (!(key in result)) {
          result[key] = value;
        }
      }
    }
  }

  return result;
}
