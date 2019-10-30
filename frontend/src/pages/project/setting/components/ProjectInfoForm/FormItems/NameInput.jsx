import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Input } from 'antd';
import { useFormContext } from '../FormContext';

export default props => {
  const {
    form: { getFieldDecorator },
    currentProject,
  } = useFormContext();

  return (
    <Form.Item
      label={formatMessage({
        id: 'projects-list.name.placeholder',
      })}
      {...props}
    >
      {getFieldDecorator('name', {
        initialValue: currentProject.name,
        rules: [
          {
            required: true,
            message: formatMessage({
              id: 'projects-list.name.required',
            }),
          },
          {
            max: 100,
            message: formatMessage({
              id: 'projects-list.name.toolong',
            }),
          },
        ],
      })(<Input />)}
    </Form.Item>
  );
};
