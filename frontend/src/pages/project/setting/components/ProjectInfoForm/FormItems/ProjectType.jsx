import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Typography } from 'antd';
import { useFormContext } from '../FormContext';
import { PROJECT_TYPE } from '../../constants';

export default () => {
  const { currentProject } = useFormContext();

  return (
    <Form.Item
      label={formatMessage({
        id: 'projects-list.project_type.label',
      })}
    >
      <Typography.Text code>{PROJECT_TYPE[currentProject.project_type].label}</Typography.Text>
    </Form.Item>
  );
};
