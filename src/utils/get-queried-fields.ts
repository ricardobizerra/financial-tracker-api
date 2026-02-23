import { FieldNode, GraphQLResolveInfo, SelectionSetNode } from 'graphql';

export function getQueriedFields<TModel extends Record<string, any>>(
  info: GraphQLResolveInfo,
  fieldName: string,
  paginatedQuery = true,
): (keyof TModel)[] {
  const fieldNode = info.fieldNodes.find(
    (node) => node.name.value === fieldName,
  );

  if (!fieldNode || !fieldNode.selectionSet) {
    return [] as unknown as (keyof TModel)[];
  }

  if (!!paginatedQuery) {
    const edgesField = findFieldByName(fieldNode.selectionSet, 'edges');

    if (!edgesField || !edgesField.selectionSet) {
      return [] as unknown as (keyof TModel)[];
    }

    const nodeField = findFieldByName(edgesField.selectionSet, 'node');

    if (!nodeField || !nodeField.selectionSet) {
      return [] as unknown as (keyof TModel)[];
    }

    return extractFields(
      nodeField.selectionSet,
      info,
    ) as unknown as (keyof TModel)[];
  }

  return extractFields(
    fieldNode.selectionSet,
    info,
  ) as unknown as (keyof TModel)[];
}

const findFieldByName = (
  selectionSet: SelectionSetNode,
  fieldName: string,
): FieldNode | undefined => {
  return selectionSet.selections.find(
    (selection): selection is FieldNode =>
      selection.kind === 'Field' && selection.name.value === fieldName,
  );
};

const extractFields = (
  selectionSet: SelectionSetNode,
  info: GraphQLResolveInfo,
  parentPath?: string,
): string[] => {
  const fields: string[] = [];

  for (const selection of selectionSet.selections) {
    if (selection.kind === 'Field' && !selection.name.value.startsWith('_')) {
      const currentPath = parentPath
        ? `${parentPath}.${selection.name.value}`
        : selection.name.value;

      if (selection.selectionSet) {
        fields.push(
          ...extractFields(selection.selectionSet, info, currentPath),
        );
      } else {
        fields.push(currentPath);
      }
    } else if (selection.kind === 'InlineFragment' && selection.selectionSet) {
      fields.push(...extractFields(selection.selectionSet, info, parentPath));
    } else if (selection.kind === 'FragmentSpread') {
      const fragment = info.fragments[selection.name.value];
      if (fragment) {
        fields.push(...extractFields(fragment.selectionSet, info, parentPath));
      }
    }
  }

  return fields;
};
