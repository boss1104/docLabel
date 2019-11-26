import React from 'react';
import { Form, Button, Typography, Card, Spin, Input, Checkbox, message } from 'antd';
import { Link } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import styles from './index.less';
import { PROJECT_TYPE } from '@/pages/constants';

const ProjectInfoForm = connect(({ project, loading }) => ({
  currentProject: project.currentProject,
  loading: loading.effects['setting/updateProject'],
}))(props => {
  const { dispatch, form, currentProject, loading } = props;

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
          const msg = formatMessage({
            id: 'projects-list.name.unique',
          });
          valueWithError[key] = {
            value: form.getFieldValue(key),
            errors: [new Error(msg)],
          };
        });
      }
      form.setFields({ ...valueWithError });
      message.error('Something wrong! Try again!');
    }
  };

  React.useEffect(() => {
    if (currentProject) {
      form.setFieldsValue({
        name: currentProject.name,
        description: currentProject.description,
        collaborative_annotation: currentProject.collaborative_annotation,
        randomize_document_order: currentProject.randomize_document_order,
      });
    }
  }, [currentProject]);

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);
  const isTouched = Object.keys(form.getFieldsValue()).some(field => form.isFieldTouched(field));

  return (
    <div className={styles.projectInfo}>
      <Card title={<Typography.Title level={4}>Project Infomation</Typography.Title>}>
        <Spin spinning={!!loading}>
          <Form {...formItemLayout} layout="vertical" onSubmit={handleSubmit} hideRequiredMark>
            <Form.Item
              label={formatMessage({
                id: 'projects-list.name.placeholder',
              })}
            >
              {form.getFieldDecorator('name', {
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
            <Form.Item
              label={formatMessage({
                id: 'projects-list.project_type.label',
              })}
            >
              {currentProject.project_type && PROJECT_TYPE[currentProject.project_type].tag}
            </Form.Item>
            <Form.Item
              label={formatMessage({
                id: 'projects-list.description.placeholder',
              })}
            >
              {form.getFieldDecorator('description', {
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
            <Form.Item {...tailFormItemLayout}>
              <Typography.Text>
                <Link to={`/projects/${currentProject.id}/guide`}>Change guide line</Link>
              </Typography.Text>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {form.getFieldDecorator('randomize_document_order', {
                valuePropName: 'checked',
              })(
                <Checkbox value="randomize_document_order">
                  {formatMessage({
                    id: 'projects-list.randomize_document_order.placeholder',
                  })}
                </Checkbox>,
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {form.getFieldDecorator('collaborative_annotation', {
                valuePropName: 'checked',
              })(
                <Checkbox value="collaborative_annotation">
                  {formatMessage({
                    id: 'projects-list.collaborative_annotation.placeholder',
                  })}
                </Checkbox>,
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
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

export default Form.create()(ProjectInfoForm);
