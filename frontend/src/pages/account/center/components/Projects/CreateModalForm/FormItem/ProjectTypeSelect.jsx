import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Select } from 'antd';
import { useFormContext } from '../FormContext';
import { PROJECT_TYPE } from '@/pages/constants';

export default () => {
  const { getFieldDecorator } = useFormContext();

  return (
    <Form.Item
      label={formatMessage({
        id: 'projects-list.project_type.label',
      })}
    >
      {getFieldDecorator('project_type', {
        rules: [
          {
            required: true,
            message: formatMessage({
              id: 'projects-list.project_type.required',
            }),
          },
        ],
      })(
        <Select
          placeholder={formatMessage({
            id: 'projects-list.project_type.placeholder',
          })}
        >
          {Object.keys(PROJECT_TYPE).map(key => (
            <Select.Option value={key} key={key}>
              {PROJECT_TYPE[key].label}
            </Select.Option>
          ))}
        </Select>,
      )}
    </Form.Item>
  );
};
