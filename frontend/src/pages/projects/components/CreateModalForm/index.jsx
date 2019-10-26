import React from 'react';
import { useModalForm } from 'sunflower-antd';
import { Modal, Button, Form, Spin, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import { FormContext } from './FormContext';
import NameInput from './FormItem/NameInput';
import DescriptionInput from './FormItem/DescriptionInput';
import Guideline from './FormItem/Guideline';
import ProjectTypeSelect from './FormItem/ProjectTypeSelect';
import OptionsCheckBox from './FormItem/OptionsCheckBox';

export default Form.create()(props => {
  const { form, onSubmit, errors } = props;
  const { buttonText } = props;
  const { modalProps, formProps, show, formLoading } = useModalForm({
    defaultVisible: false,
    autoSubmitClose: true,
    submit: async formValues => {
      const payload = { ...formValues };
      const { options } = formValues;
      // TODO: make sync formLoading
      delete payload.options;
      options.forEach(val => {
        payload[val] = true;
      });
      payload.resourcetype = payload.project_type;
      const res = await onSubmit(payload);
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
      <Modal {...modalProps} title="Create new project" okText="Submit and Close" width={740}>
        <Spin spinning={formLoading}>
          <Form {...formItemLayout} {...formProps} layout="horizontal">
            <NameInput
              {...(errors &&
                errors.name && {
                  help: formatMessage({
                    id: 'projects-list.name.unique',
                  }),
                  validateStatus: 'error',
                })}
            />
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
      <Button onClick={show}>{buttonText}</Button>
    </FormContext.Provider>
  );
});
