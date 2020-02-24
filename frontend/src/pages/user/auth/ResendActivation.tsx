import { ConnectState } from '@/models/connect';
import { Button, Input, message, Result } from 'antd';
import Form, { FormProps } from 'antd/lib/form';
import { useDispatch, useSelector } from 'dva';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { Fragment, useState } from 'react';
import { Link, router, RouterTypes } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const ResendActivation: React.FC<RouterTypes> = ({ match }) => {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state: ConnectState) => state.loading.effects['auth/resendActivation'],
  );
  const [form] = Form.useForm();
  //
  const [isSubmitted, setIsSubmitted] = useState(false);

  console.log('[DEBUG]: getFieldsError', form.getFieldsError());

  const requestResendActivation: FormProps['onFinish'] = async values => {
    try {
      const res = await dispatch({
        type: 'auth/resendActivation',
        payload: values,
      });
      setIsSubmitted(true);
      message.success('Request successfully!');
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

  return (
    <Fragment>
      {!isSubmitted && (
        <div className={styles.main}>
          <h2>Resend activation email</h2>
          <Form form={form} onFinish={requestResendActivation}>
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
                // disabled={}
                block
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.back}>
            <a type="link" onClick={() => router.goBack()}>
              Back
            </a>
          </div>
        </div>
      )}
      {isSubmitted && (
        <Result
          status="success"
          title={
            <div className={styles.title}>
              <FormattedMessage id="user-resend-activation.email.sent" />
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
export default ResendActivation;
