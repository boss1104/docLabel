import React from 'react';
import { useModalForm } from 'sunflower-antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button, Spin, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import { connect } from 'dva';
import { router } from 'umi';
import { FormContext } from './FormContext';
import NameInput from './FormItem/NameInput';
import DescriptionInput from './FormItem/DescriptionInput';
import Guideline from './FormItem/Guideline';
import ProjectTypeSelect from './FormItem/ProjectTypeSelect';
import OptionsCheckBox from './FormItem/OptionsCheckBox';

const messageID = {
  'project with this name already exists.': 'projects-list.name.unique',
};

const CreateModalForm = connect(({ loading }) => ({
  loading: loading.effects['project/createProject'],
}))(props => {
  const { form, dispatch, errors } = props;
  const { buttonText } = props;

  const { modalProps, formProps, show, close, formLoading } = useModalForm({
    defaultVisible: false,
    autoSubmitClose: true,
    autoResetForm: true,
    submit: async formValues => {
      const payload = { ...formValues };
      const { options } = formValues;
      delete payload.options;
      options.forEach(val => {
        payload[val] = true;
      });
      payload.resourcetype = payload.project_type;
      console.log('[DEBUG]: payload', payload);
      try {
        const res = await dispatch({
          type: 'project/createProject',
          payload,
        });
        message.success(`Successfully created!${res.name}`);
        router.push(`/projects/${res.id}/dashboard`);
        form.resetFields();
        close();
      } catch (error) {
        const valueWithError = {};
        if (error.data) {
          Object.entries(error.data).forEach(([key, val]) => {
            const msg = formatMessage({
              id: messageID[val[0]],
            });
            valueWithError[key] = {
              value: form.getFieldValue(key),
              errors: [new Error(msg)],
            };
          });
        }
        form.setFields({ ...valueWithError });
        message.error('Something wrong! Try again');
      }
    },
    form,
  });

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  return (
    <FormContext.Provider value={form}>
      <Modal {...modalProps} title="Create new project" footer={null} width={740}>
        <Spin spinning={formLoading}>
          <Form {...formItemLayout} {...formProps} layout="horizontal">
            <NameInput />
            <DescriptionInput />
            <Guideline />
            <ProjectTypeSelect />
            <OptionsCheckBox />
            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <div className={props.className}>
        <Button onClick={show} size="large">
          {buttonText}
        </Button>
      </div>
    </FormContext.Provider>
  );
});

export default Form.create()(CreateModalForm);
