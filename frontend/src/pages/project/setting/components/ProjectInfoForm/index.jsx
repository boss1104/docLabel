import React from 'react';
import { Form, Button, Typography, Card, Spin } from 'antd';
import { Link } from 'umi';

import styles from './index.less';
import { FormContext } from './FormContext';
import NameInput from './FormItems/NameInput';
import DescriptionInput from './FormItems/DescriptionInput';
import ProjectType from './FormItems/ProjectType';
import OptionsCheckBox from './FormItems/OptionsCheckBox';

const ProjectInfoForm = Form.create()(
  React.forwardRef((props, ref) => {
    const { form, currentProject, onSubmit, loading, errors } = props;

    React.useImperativeHandle(ref, () => form);

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
    const handleSubmit = e => {
      e.preventDefault();
      const values = form.getFieldsValue();
      if (onSubmit) {
        onSubmit(values);
      }
    };

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);
    const isTouched = Object.keys(form.getFieldsValue()).some(field => form.isFieldTouched(field));

    return (
      <FormContext.Provider value={{ currentProject, form }}>
        <div className={styles.projectInfo}>
          <Card title={<Typography.Title level={4}>Project Infomation</Typography.Title>}>
            <Spin spinning={!!loading}>
              <Form {...formItemLayout} layout="vertical" onSubmit={handleSubmit} hideRequiredMark>
                <NameInput
                  {...(errors &&
                    errors.name && {
                      help: 'Project name already exists',
                      hasFeedback: true,
                      validateStatus: 'error',
                    })}
                />
                <ProjectType />
                <DescriptionInput />
                <Form.Item {...tailFormItemLayout}>
                  <Typography.Text>
                    <Link to={`/projects/${currentProject.id}/guide`}>Change guide line</Link>
                  </Typography.Text>
                </Form.Item>
                <OptionsCheckBox {...tailFormItemLayout} />
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
      </FormContext.Provider>
    );
  }),
);

export default ProjectInfoForm;
