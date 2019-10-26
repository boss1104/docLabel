import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Input } from 'antd';
import { useFormContext } from '../FormContext';

export default () => {
  const { getFieldDecorator } = useFormContext();
  return (
    <Form.Item
      label={formatMessage({
        id: 'projects-list.description.placeholder',
      })}
    >
      {getFieldDecorator('description', {
        rules: [
          {
            required: true,
            message: formatMessage({
              id: 'projects-list.description.required',
            }),
          },
        ],
      })(<Input.TextArea rows={4} />)}
    </Form.Item>
  );
};
