import { connect, mapReadPretty, observer, useField } from '@formily/react';
import { Select, SelectProps, Tag } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelfAndChildrenCollections } from '../../../collection-manager/action-hooks';
import { useCollection_deprecated, useCollectionManager_deprecated } from '../../../collection-manager/hooks';
import { useCompile } from '../../hooks';
import { FilterContext } from '../filter/context';

export type CollectionSelectProps = SelectProps<any, any> & {
  filter?: (item: any, index: number, array: any[]) => boolean;
  isTableOid?: boolean;
};

function useOptions({ filter, isTableOid }: CollectionSelectProps) {
  const compile = useCompile();
  const field: any = useField();
  const ctx: any = useContext(FilterContext);
  const collection = useCollection_deprecated();
  const targetCollection = isTableOid && (ctx?.field?.collectionName || ctx?.collectionName || collection.name);
  const inheritCollections = useSelfAndChildrenCollections(targetCollection);
  const { collections = [] } = useCollectionManager_deprecated();
  const currentCollections = field?.dataSource
    ? collections.filter((v) => {
        return field?.dataSource.find((i) => i.value === v.name) || field?.dataSource.includes(v.name);
      })
    : collections;
  const filtered =
    typeof filter === 'function'
      ? ((inheritCollections || currentCollections) as any[]).filter(filter)
      : inheritCollections || currentCollections;
  return filtered
    .filter((item) => !item.hidden)
    .map((item) => ({
      label: compile(item.title || item.label),
      value: item.name || item.value,
      color: item.category?.color,
    }));
}

export const CollectionSelect = connect(
  (props: CollectionSelectProps) => {
    const { filter, ...others } = props;
    const options = useOptions(props);
    const { t } = useTranslation();
    return (
      <Select
        // @ts-ignore
        role="button"
        data-testid="select-collection"
        placeholder={t('Select collection')}
        popupMatchSelectWidth={false}
        {...others}
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? '').includes(input.toLocaleLowerCase()) ||
          (option?.value.toString().toLowerCase() ?? '').includes(input.toLocaleLowerCase())
        }
        options={options}
      />
    );
  },
  mapReadPretty(
    observer(
      (props: CollectionSelectProps) => {
        const { mode } = props;
        const compile = useCompile();
        const options = useOptions(props).filter((option) => {
          if (mode === 'multiple') {
            return (props.value ?? []).includes(option.value);
          }
          return props.value === option.value;
        });

        return (
          <div>
            {options.map((option) => (
              <Tag key={option.value} color={option.color}>
                {compile(option.label)}
              </Tag>
            ))}
          </div>
        );
      },
      { displayName: 'CollectionSelectObserver' },
    ),
  ),
);
