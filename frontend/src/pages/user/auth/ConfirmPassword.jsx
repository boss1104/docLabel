import React, { useState, Fragment } from 'react';
import { Button, Form, Input, message, Result } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { Link } from 'umi';
import styles from './index.less';

const FormItem = Form.Item;

function ConfirmPassword({ dispatch, form, loading, match }) {
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { getFieldDecorator, getFieldsError, validateFields } = form;
  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  // eslint-disable-next-line @typescript-eslint/camelcase
  const requestConfirmPassword = async ({ new_password1, new_password2 }) => {
    try {
      const { uid, token } = match.params;
      if (uid && token) {
        const res = await dispatch({
          type: 'auth/confirmPassword',
          payload: {
            uid,
            token,
            new_password1,
            new_password2,
          },
        });

        setIsSubmitted(true);
        message.success(res.detail);
      }
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

  return (
    <Fragment>
      {!isSubmitted && (
        <div className={styles.main}>
          <h2>Confirm Change Password</h2>
          <Form
            onSubmit={e => {
              e.preventDefault();
              validateFields((err, values) => {
                if (!err) {
                  requestConfirmPassword(values);
                }
              });
            }}
          >
            <FormItem hasFeedback>
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
              })(<Input size="large" type="password" placeholder="New password" />)}
            </FormItem>
            <FormItem hasFeedback>
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
                  size="large"
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
                size="large"
                disabled={hasErrors(getFieldsError())}
                block
                loading={loading}
              >
                Submit
              </Button>
            </FormItem>
          </Form>
        </div>
      )}
      {isSubmitted && (
        <Result
          status="success"
          title={<div className={styles.title}>Your password has been changed successfully! </div>}
          extra={
            <div className={styles.actions}>
              <Link to="/user/login">
                <Button size="large" type="primary">
                  Go to login
                </Button>
              </Link>
            </div>
          }
        />
      )}
    </Fragment>
  );
}
export default Form.create()(
  connect(({ loading }) => ({
    loading: loading.effects['auth/forgotPassword'],
  }))(ConfirmPassword),
);
