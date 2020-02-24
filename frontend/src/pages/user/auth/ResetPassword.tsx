import React, { useState, Fragment } from 'react';

import { Button, Input, message, Result, Form } from 'antd';
import { FormProps } from 'antd/lib/form';
import { useDispatch, useSelector } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { FieldError, FieldData } from 'rc-field-form/lib/interface';

import { Link } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './index.less';

const ResetPassword: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: ConnectState) => state.loading.effects['auth/resetPassword']);

  const [form] = Form.useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const requestForgotPassword: FormProps['onFinish'] = async values => {
    try {
      await dispatch({
        type: 'auth/resetPassword',
        payload: values,
      });
      setIsSubmitted(true);
      message.success('Reset password link has been sent your email!');
    } catch (err) {
      const { data } = err;
      const fields: FieldData[] = [
        {
          name: 'email',
          value: values.email,
          errors: data,
        },
      ];
      form.setFields(fields);
      message.error('Request failed! Try again');
    }
  };

  const { getFieldsError } = form;
  const hasErrors = fieldsError => fieldsError.some(field => field.errors.length > 0);

  return (
    <Fragment>
      {!isSubmitted && (
        <div className={styles.main}>
          <h2>Forgot Password</h2>
          <Form form={form} onFinish={requestForgotPassword}>
            <Form.Item
              name="email"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-resend-activation.email.required',
                  }),
                },
                {
                  type: 'email',
                  message: formatMessage({
                    id: 'user-resend-activation.email.wrong-format',
                  }),
                },
              ]}
            >
              <Input
                size="large"
                placeholder={formatMessage({
                  id: 'user-resend-activation.email.placeholder',
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
              {formatMessage({
                id: 'user-reset-password.email.sent',
              })}{' '}
              {form.getFieldValue('email')}
            </div>
          }
          extra={
            <div className={styles.actions}>
              <Link to="/home">
                <Button size="large" type="primary">
                  <FormattedMessage id="user-reset-password.go-home" />
                </Button>
              </Link>
            </div>
          }
        />
      )}
    </Fragment>
  );
};
export default ResetPassword;
