import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Typography, Select, InputNumber, message, Spin } from 'antd';
import { connect } from 'dva';

import styles from './index.less';

const TaskSettings = connect(({ loading, project }) => ({
  currentProject: project.currentProject,
  loading: loading.effects['setting/updateProject'],
}))(props => {
  const { dispatch, form, currentProject, loading } = props;

  /**
   * Handler
   */

  const handleSubmit = async e => {
    e.preventDefault();
    const values = form.getFieldsValue();
    try {
      await dispatch({
        type: 'setting/updateProject',
        payload: values,
      });
      message.success('Successfully updated!');
    } catch ({ data }) {
      const valueWithError = {};
      if (data) {
        Object.entries(data).forEach(([key, val]) => {
          // const msg = formatMessage({
          //   id: messageID[val[0]],
          // });
          valueWithError[key] = {
            value: form.getFieldValue(key),
            errors: [new Error(val[0])],
          };
        });
      }
      form.setFields({ ...valueWithError });
      message.error('Something wrong! Try again!');
    }
  };

  /**
   * Effects
   */
  React.useEffect(() => {
    if (currentProject) {
      form.setFieldsValue({
        annotator_per_example: currentProject.annotator_per_example,
      });
    }
  }, [currentProject]);

  /**
   * Variables
   */

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  };
  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);
  const isTouched = Object.keys(form.getFieldsValue()).some(field => form.isFieldTouched(field));

  return (
    <div className={styles.taskSettings}>
      <Card title={<Typography.Title level={4}>Task settings</Typography.Title>}>
        <Spin spinning={!!loading}>
          <Form {...formItemLayout} layout="vertical" onSubmit={handleSubmit} hideRequiredMark>
            <Form.Item label="Task redundancy">
              {form.getFieldDecorator('annotator_per_example')(
                <InputNumber min={1} max={100} style={{ width: 150 }} />,
              )}
            </Form.Item>

            <Form.Item label="Task scheduler">
              {form.getFieldDecorator('task_scheduler')(
                <Select style={{ width: 150 }}>
                  <Select.Option value="">1</Select.Option>
                  <Select.Option value="">2</Select.Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                htmlType="submit"
                type="primary"
                disabled={hasErrors(form.getFieldsError()) || !isTouched}
              >
                Update
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
});

export default Form.create()(React.memo(TaskSettings));
