import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, message, Typography } from 'antd';
import { connect } from 'dva';
import React, { useRef, useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './SecurityView.less';

const FormItem = Form.Item;

function SecurityView({ dispatch, currentUser, form, loading }) {
  const viewRef = useRef(undefined);
  const [confirmDirty, setConfirmDirty] = useState(false);

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      form.validateFields(['new_password2'], { force: true });
    }
    callback();
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('new_password1')) {
      callback(
        formatMessage({
          id: 'user-register.password.twice',
        }),
      );
    }
    callback();
  };

  // eslint-disable-next-line @typescript-eslint/camelcase
  const requestConfirmPassword = async ({ new_password1, new_password2 }) => {
    try {
      const res = await dispatch({
        type: 'accountSettings/changePassword',
        payload: {
          new_password1,
          new_password2,
        },
      });

      message.success(res.detail);
    } catch (err) {
      const valueWithError = {};
      if (err.data) {
        Object.entries(err.data).forEach(([key, val]) => {
          valueWithError[key] = {
            value: form.getFieldValue(key),
            errors: [new Error(val[0])],
          };
        });
      }
      form.setFields({ ...valueWithError });
      message.error('Something wrong! Try again');
    }
  };

  const { getFieldDecorator, getFieldsError, validateFields } = form;
  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  return (
    <div className={styles.baseView} ref={viewRef}>
      <div className={styles.form}>
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>Change password</Typography.Text>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onSubmit={e => {
            e.preventDefault();
            validateFields((err, values) => {
              if (!err) {
                requestConfirmPassword(values);
              }
            });
          }}
        >
          <FormItem label="New password" hasFeedback>
            {getFieldDecorator('new_password1', {
              rules: [
                {
                  required: true,
                  message: 'Please enter your new password!',
                },
                {
                  min: 6,
                  message: 'Please enter at least 6 characters!',
                },
                {
                  validator: validateToNextPassword,
                },
              ],
            })(<Input type="password" placeholder="New password" />)}
          </FormItem>
          <FormItem label="Confirm new password" hasFeedback>
            {getFieldDecorator('new_password2', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your new password!',
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            })(
              <Input
                type="password"
                placeholder="Confirm new password"
                onBlur={e => setConfirmDirty(confirmDirty || !!e.target.value)}
              />,
            )}
          </FormItem>

          <FormItem>
            <Button
              htmlType="submit"
              type="primary"
              disabled={hasErrors(getFieldsError())}
              loading={loading}
            >
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}

export default Form.create()(
  connect(({ user, loading }) => ({
    currentUser: user.currentUser,
    loading: loading.effects['accountSettings/changePassword'],
  }))(SecurityView),
);
