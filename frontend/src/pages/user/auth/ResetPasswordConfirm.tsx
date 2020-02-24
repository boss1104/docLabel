import { Button, Input, message, Result, Form, Alert } from 'antd';
import { connect, useSelector, useDispatch } from 'dva';
import React, { Fragment, useState } from 'react';
import { Link, RouterTypes } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ConnectState } from '@/models/connect';
import { FormProps } from 'antd/lib/form';
import styles from './index.less';

const ResetPasswordConfirm: React.FC<RouterTypes> = ({ match }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const loading = useSelector(
    (state: ConnectState) => state.loading.effects['auth/resetPasswordConfirm'],
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string[]>([]);

  const { getFieldsError } = form;
  const hasErrors = fieldsError => fieldsError.some(field => field.errors.length > 0);

  const requestConfirmPassword: FormProps['onFinish'] = async values => {
    try {
      const { params } = match;
      await dispatch({
        type: 'auth/resetPasswordConfirm',
        payload: {
          ...values,
          ...params,
        },
      });

      setIsSubmitted(true);
    } catch (err) {
      const { data }: { data: Record<string, string[]> } = err;
      setError(Object.values(data)[0]);
      message.error('Something wrong. Try again!');
    }
  };

  return (
    <Fragment>
      {!isSubmitted && (
        <div className={styles.main}>
          <h2>Confirm change password</h2>
          {error.length > 0 && (
            <Alert
              style={{
                marginBottom: 24,
              }}
              message={error[0]}
              type="error"
              showIcon
            />
          )}

          <Form form={form} onFinish={requestConfirmPassword}>
            <Form.Item
              hasFeedback
              name="new_password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password!',
                },
                {
                  min: 6,
                  message: 'Please enter at least 6 characters!',
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder={formatMessage({
                  id: 'user-reset-password.password.new-password',
                })}
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="re_new_password"
              dependencies={['new_password']}
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password!',
                },
                ({ getFieldValue }) => ({
                  validator: (rule, value) => {
                    if (!value || value === getFieldValue('new_password')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      formatMessage({
                        id: 'user-reset-password.password.twice',
                      }),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder={formatMessage({
                  id: 'user-reset-password.password.re-new-password',
                })}
              />
            </Form.Item>
            <Form.Item>
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
            </Form.Item>
          </Form>
        </div>
      )}
      {isSubmitted && (
        <Result
          status="success"
          title={
            <div className={styles.title}>
              <FormattedMessage id="user-reset-password.email.success" />
            </div>
          }
          extra={
            <div className={styles.actions}>
              <Link to="/user/login">
                <Button size="large" type="primary">
                  <FormattedMessage id="user-reset-password.go-login" />
                </Button>
              </Link>
            </div>
          }
        />
      )}
    </Fragment>
  );
};
export default ResetPasswordConfirm;
