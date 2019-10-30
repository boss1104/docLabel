import React from 'react';
import { Form, Button, Typography, Card, Spin } from 'antd';
import { Link } from 'umi';

import styles from './index.less';
import { FormContext } from './FormContext';
import NameInput from './FormItems/NameInput';
import DescriptionInput from './FormItems/DescriptionInput';
import ProjectType from './FormItems/ProjectType';
import OptionsCheckBox from './FormItems/OptionsCheckBox';

export default Form.create()(props => {
  const { form, currentProject, onSubmit, loading, errors } = props;

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
    console.log('TCL: values', values);
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <FormContext.Provider value={{ currentProject, form }}>
      <div className={styles.projectInfo}>
        <Card title="Project info">
          <Spin spinning={!!loading}>
            <Typography.Title level={4}>{currentProject.name} </Typography.Title>
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
                  <Link to={`/projects/${currentProject.id}/guide`}>Change project guide line</Link>
                </Typography.Text>
              </Form.Item>
              <OptionsCheckBox {...tailFormItemLayout} />
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </FormContext.Provider>
  );
});
