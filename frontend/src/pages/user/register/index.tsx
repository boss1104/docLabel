import { ConnectState } from '@/models/connect';
import { getFieldsFromErrorData } from '@/utils/utils';
import { Button, Input, message, Popover, Progress } from 'antd';
import Form, { FormProps } from 'antd/lib/form';
import { useDispatch, useSelector } from 'dva';
import React, { useCallback, useState } from 'react';
import { Link, router } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import { FIRST_NAME_MAX_LENGTH, LAST_NAME_MAX_LENGTH, USER_NAME_MAX_LENGTH } from './locales/en-US';
import styles from './style.less';

interface PasswordStatusType {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
}

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="user-register.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="user-register.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="user-register.strength.short" />
    </div>
  ),
};
const passwordProgressMap: PasswordStatusType = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const submitting = useSelector((state: ConnectState) => state.loading.effects['auth/register']);

  const [visible, setVisible] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<keyof PasswordStatusType | undefined>(
    undefined,
  );

  const renderPasswordProgress = useCallback(() => {
    const value = form.getFieldValue('password');
    if (visible) {
      const percent = value.length * 10 > 100 ? 100 : value.length * 10;
      return (
        <div style={{ padding: '4px 0' }}>
          {passwordStatusMap[passwordStatus!]}
          <div className={styles[`progress-${passwordStatus}`]}>
            <Progress
              status={passwordProgressMap[passwordStatus!]}
              className={styles.progress}
              strokeWidth={6}
              percent={percent}
              showInfo={false}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <FormattedMessage id="user-register.strength.msg" />
          </div>
        </div>
      );
    }
    return null;
  }, [passwordStatus, visible]);

  const handleSubmit: FormProps['onFinish'] = async values => {
    try {
      await dispatch({
        type: 'auth/register',
        payload: values,
      });

      message.success('Sign-up successfully');
      router.push({
        pathname: '/user/register-result',
        state: {
          email: form.getFieldValue('email'),
        },
      });
    } catch (err) {
      const fields = getFieldsFromErrorData(err, form.getFieldsValue());
      form.setFields(fields);
      message.error('Registration failed! Try again');
    }
  };

  const onFinishFailed: FormProps['onFinishFailed'] = ({ errorFields }) => {
    form.scrollToField(errorFields[0].name);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 6,
      },
    },
  };

  const hasErrors = form.getFieldsError().some(field => field.errors.length > 0);

  return (
    <div className={styles.main}>
      <h2>
        <FormattedMessage id="user-register.register.register" />
      </h2>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleSubmit}
        name="register"
        onFinishFailed={onFinishFailed}
        initialValues={
          {
            // first_name: 'fn002',
            // last_name: 'ln002',
            // email: 'acc002@gmail.com',
            // username: 'acc002',
            // password: 'secret@123',
            // re_password: 'secret@123',
          }
        }
      >
        <Form.Item
          hasFeedback
          label={formatMessage({
            id: 'user-register.first_name.placeholder',
          })}
          name="first_name"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-register.first_name.required',
              }),
            },
            {
              max: FIRST_NAME_MAX_LENGTH,
              message: formatMessage({
                id: 'user-register.first_name.length',
              }),
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="last_name"
          label={formatMessage({
            id: 'user-register.last_name.placeholder',
          })}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-register.last_name.required',
              }),
            },
            {
              max: LAST_NAME_MAX_LENGTH,
              message: formatMessage({
                id: 'user-register.last_name.length',
              }),
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="username"
          label={formatMessage({
            id: 'user-register.username.placeholder',
          })}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-register.username.required',
              }),
            },
            {
              min: 3,
              message: formatMessage({
                id: 'user-register.username.length',
              }),
            },
            {
              max: USER_NAME_MAX_LENGTH,
              message: formatMessage({
                id: 'user-register.username.length',
              }),
            },
            {
              pattern: /^[a-zA-Z0-9]+$/,
              message: formatMessage({
                id: 'user-register.username.wrong-format',
              }),
            },
          ]}
          shouldUpdate
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="email"
          label={formatMessage({
            id: 'user-register.email.placeholder',
          })}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-register.email.required',
              }),
            },
            {
              type: 'email',
              message: formatMessage({
                id: 'user-register.email.wrong-format',
              }),
            },
          ]}
          shouldUpdate
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          hasFeedback
          required
          label={formatMessage({
            id: 'user-register.password.placeholder',
          })}
        >
          <Popover
            getPopupContainer={node => {
              if (node && node.parentElement) {
                return node.parentElement;
              }
              return node;
            }}
            overlayStyle={{
              width: 250,
            }}
            placement="right"
            content={renderPasswordProgress()}
            visible={visible}
          >
            <Form.Item
              noStyle
              name="password"
              validateFirst
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-register.password.required',
                  }),
                },
                {
                  validator: (rule, value) => {
                    if (visible !== value.length > 0) {
                      setVisible(!visible);
                    }

                    if (value.length >= 10) {
                      setPasswordStatus('ok');
                    } else if (value.length >= 6) {
                      setPasswordStatus('pass');
                    } else {
                      setPasswordStatus('poor');
                      return Promise.reject(rule.message);
                    }
                    return Promise.resolve();
                  },
                  message: formatMessage({
                    id: 'user-register.password.length',
                  }),
                },
              ]}
            >
              <Input.Password size="large" onBlur={() => setVisible(false)} />
            </Form.Item>
          </Popover>
        </Form.Item>
        <Form.Item
          name="re_password"
          hasFeedback
          label={formatMessage({
            id: 'user-register.confirm-password.placeholder',
          })}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-register.confirm-password.required',
              }),
            },
            ({ getFieldValue }) => ({
              validator: (rule, value) => {
                if (!value || value === getFieldValue('password')) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  formatMessage({
                    id: 'user-register.password.twice',
                  }),
                );
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            size="large"
            loading={submitting}
            type="primary"
            htmlType="submit"
            block
            disabled={hasErrors}
          >
            <FormattedMessage id="user-register.register.sign-up" />
          </Button>
          <div className={styles.links}>
            <Link to="/user/login">
              <FormattedMessage id="user-register.register.sign-in" />
            </Link>
            <Link to="/user/resend-activation">
              <FormattedMessage id="user-register.register.resend-activation" />
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
