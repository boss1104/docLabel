import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Checkbox } from 'antd';
import { useFormContext } from '../FormContext';

export default props => {
  const {
    form: { getFieldDecorator },
    currentProject,
  } = useFormContext();

  return (
    <>
      <Form.Item {...props}>
        {getFieldDecorator('randomize_document_order', {
          valuePropName: 'checked',
          initialValue: currentProject.randomize_document_order,
        })(
          <Checkbox value="randomize_document_order">
            {formatMessage({
              id: 'projects-list.randomize_document_order.placeholder',
            })}
          </Checkbox>,
        )}
      </Form.Item>
      <Form.Item {...props}>
        {getFieldDecorator('collaborative_annotation', {
          valuePropName: 'checked',
          initialValue: currentProject.collaborative_annotation,
        })(
          <Checkbox value="collaborative_annotation">
            {formatMessage({
              id: 'projects-list.collaborative_annotation.placeholder',
            })}
          </Checkbox>,
        )}
      </Form.Item>
    </>
  );
};
