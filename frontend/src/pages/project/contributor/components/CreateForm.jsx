import { Form, Icon, Modal, Typography, Radio, message, Select, AutoComplete, Button } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { ROLE_LABELS } from '@/pages/constants';

const { Option } = Select;

const CreateForm = connect(({ loading }) => ({
  loadingProject: loading.effects['name/fetchCurrent'],
}))(props => {
  const { dispatch, modalVisible, setModalVisible, form, otherUsers, roles } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const handleOnSubmit = e => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      const user = otherUsers.find(item => item.username === values.user);
      if (!user) {
        form.setFields({
          user: {
            value: form.getFieldValue('user'),
            errors: [new Error('Not an exsiting user!')],
          },
        });
        return;
      }

      if (!err && user) {
        try {
          const res = await dispatch({
            type: 'contributor/addRole',
            payload: {
              user: user.id,
              role: values.role,
            },
          });
          message.success('Successfully add user to project');
          setModalVisible(false);
        } catch (error) {
          const { data } = error;
          message.error('Something wrong! Try again!');
        }
      }
    });
  };

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  return (
    <Modal
      destroyOnClose
      title="Add New User"
      visible={modalVisible}
      footer={null}
      width={600}
      onCancel={() => setModalVisible(false)}
    >
      <Form layout="horizontal" {...formItemLayout} onSubmit={handleOnSubmit}>
        <Form.Item label="User name">
          {form.getFieldDecorator('user', {
            rules: [{ required: true, message: 'Please choose a user' }],
          })(
            <AutoComplete
              dataSource={otherUsers.map(item => item.username)}
              placeholder="Input username"
              filterOption={(inputValue, option) =>
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />,
          )}
        </Form.Item>
        <Form.Item label="Role">
          {form.getFieldDecorator('role', {
            rules: [{ required: true, message: 'Please select user role!' }],
          })(
            <Select placeholder="Select a role">
              {roles &&
                roles.length !== 0 &&
                roles.map(item => (
                  <Option key={item.id} value={item.id}>
                    {ROLE_LABELS[item.name]}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
          <Button htmlType="submit" type="primary" disabled={hasErrors(form.getFieldsError())}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default Form.create()(CreateForm);
