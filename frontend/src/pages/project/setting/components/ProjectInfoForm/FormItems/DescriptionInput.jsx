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
        id: 'projects-list.description.placeholder',
      })}
      {...props}
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
        initialValue: currentProject.description,
      })(<Input.TextArea rows={4} />)}
    </Form.Item>
  );
};
