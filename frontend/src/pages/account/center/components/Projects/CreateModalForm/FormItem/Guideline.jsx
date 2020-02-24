import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Typography } from 'antd';
import { useFormContext } from '../FormContext';

export default () => {
  const { getFieldDecorator } = useFormContext();
  return (
    <Form.Item
      label={formatMessage({
        id: 'projects-list.guideline.placeholder',
      })}
    >
      {getFieldDecorator('guideline', {
        initialValue: formatMessage({
          id: 'projects-list.guideline.code',
        }),
      })(
        <Typography.Text code>
          <FormattedMessage id="projects-list.guideline.code" />
        </Typography.Text>,
      )}
    </Form.Item>
  );
};
