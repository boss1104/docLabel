import React, { useState, Fragment } from 'react';
import { Button, Form, Input, message, Result } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { Link } from 'umi';
import styles from './index.less';

const FormItem = Form.Item;

function ForgotPassword({ dispatch, form, loading }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const requestForgotPassword = async ({ email }) => {
    try {
      const res = await dispatch({
        type: 'auth/forgotPassword',
        payload: {
          email,
        },
      });
      setIsSubmitted(true);
      message.success(res.detail);
    } catch (err) {
      console.log('[DEBUG]: requestForgotPassword -> err', err);
    }
  };

  const { getFieldDecorator, getFieldsError, validateFields } = form;
  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  return (
    <Fragment>
      {!isSubmitted && (
        <div className={styles.main}>
          <h2>Forgot Password</h2>
          <Form
            onSubmit={e => {
              e.preventDefault();
              validateFields((err, values) => {
                if (!err) {
                  requestForgotPassword(values);
                }
              });
            }}
          >
            <FormItem hasFeedback>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Email is required !' },
                  {
                    type: 'email',
                    message: formatMessage({
                      id: 'user-register.email.wrong-format',
                    }),
                  },
                ],
              })(<Input placeholder="Enter your email" size="large" />)}
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
          title={
            <div className={styles.title}>
              Confirm email sended to {form.getFieldValue('email')}
            </div>
          }
          extra={
            <div className={styles.actions}>
              <Link to="/home">
                <Button size="large" type="primary">
                  Go Home
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
  }))(ForgotPassword),
);
