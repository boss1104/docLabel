import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Checkbox, Row, Col } from 'antd';
import { useFormContext } from '../FormContext';

export default () => {
  const { getFieldDecorator } = useFormContext();

  return (
    <Form.Item
      label={formatMessage({
        id: 'projects-list.options.label',
      })}
    >
      {getFieldDecorator('options', {
        initialValue: [],
      })(
        <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            <Col span={24}>
              <Checkbox value="randomize_document_order">
                {formatMessage({
                  id: 'projects-list.randomize_document_order.placeholder',
                })}
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="collaborative_annotation">
                {formatMessage({
                  id: 'projects-list.collaborative_annotation.placeholder',
                })}
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>,
      )}
    </Form.Item>
  );
};
