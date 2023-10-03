import React, { useState } from 'react';
import { map } from 'lodash';
// Antd
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/select';
import { ProFormSelect } from '@ant-design/pro-components';
// Local
import { searchGroup } from '@/services/groups';

const GroupSearch: React.FC<ProFormSelectProps> = (props) => {
  const [options, setOptions] = useState<{ value: string; label: string;}[]>([]);

  const findGroups = async (group: string) => {
    if(group==='') return [];
    return searchGroup(group).then(response => {
        setOptions(map(response, i => ({ value: i.id, label: i.name })));
    }).catch(() => {
      return null;
    });
  }

  return (
    <ProFormSelect
        name="group"
        label="المجموعة"
        {...props}
        rules={[
            {
            required: true,
            message: 'المجموعة ضروري منها!',
            },
        ]}
        fieldProps={{
            options,
            className: "ahmedrhuma-custom-select-input",
            filterOption: false,
            onSearch: findGroups,
            notFoundContent: null,
            labelInValue: true,
            showArrow: false,
            defaultActiveFirstOption: false,
            placeholder: 'إختر المجموعة...',
            showSearch: true
        }}
    />
  );
};

export default GroupSearch;
