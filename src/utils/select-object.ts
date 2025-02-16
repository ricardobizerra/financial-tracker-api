type ExtraModelFields<TModel, TDatabase> = Exclude<
  keyof TModel,
  keyof TDatabase
>;

type RequiredHashFields<TModel, TDatabase> =
  ExtraModelFields<TModel, TDatabase> extends never
    ? Record<string, never>
    : {
        [K in ExtraModelFields<TModel, TDatabase>]: (keyof TDatabase)[];
      };

type SelectObjectParams<TModel, TDatabase> =
  ExtraModelFields<TModel, TDatabase> extends never
    ? [queriedFields: (keyof TModel)[]]
    : [
        queriedFields: (keyof TModel)[],
        hashDifferentFields: RequiredHashFields<TModel, TDatabase>,
      ];

type SelectObjectReturn<TDatabase> = Partial<Record<keyof TDatabase, true>>;

export function selectObject<
  TDatabase extends Record<string, any>,
  TModel extends Partial<TDatabase>,
>(
  ...args: SelectObjectParams<TModel, TDatabase>
): SelectObjectReturn<TDatabase> {
  const [queriedFields, hashDifferentFields] = args as SelectObjectParams<
    TModel,
    TDatabase
  >;

  return queriedFields.reduce((acc, field) => {
    if (
      !!hashDifferentFields &&
      Object.prototype.hasOwnProperty.call(hashDifferentFields, field)
    ) {
      const hashedFields = hashDifferentFields[
        field as keyof RequiredHashFields<TModel, TDatabase>
      ] as (keyof TDatabase)[];

      const hashedSelectObject = selectObject<TDatabase, TDatabase>(
        hashedFields,
      );

      return { ...acc, ...hashedSelectObject };
    }

    return { ...acc, [field]: true };
  }, {} as SelectObjectReturn<TDatabase>);
}
