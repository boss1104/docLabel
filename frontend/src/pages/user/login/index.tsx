import { ConnectState } from '@/models/connect';
import { LOGIN_PROVIDERS, ProviderTypes } from '@/pages/constants';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Input, message, Row } from 'antd';
import Form, { FormProps } from 'antd/lib/form';
import { useDispatch, useSelector } from 'dva';
import React, { useEffect, useState } from 'react';
import NewWindow from 'react-new-window';
import { Link, router } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './style.less';

const Login: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const submitting = useSelector((state: ConnectState) => state.loading.effects['auth/login']);
  const [opened, setOpened] = useState(false);
  const [provider, setProvider] = useState<ProviderTypes>('google-oauth2');

  const [error, setError] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    window.addEventListener('storage', event => {
      if (event.key === 'antd-pro-authorization') {
        router.replace('/');
      }
    });
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  const onFinish: FormProps['onFinish'] = async values => {
    try {
      await dispatch({
        type: 'auth/login',
        payload: { ...values },
      });
      setError('');
      message.success('Welcome!');
    } catch (err) {
      const { data } = err;
      setError(data.non_field_errors[0]);
    }
  };

  const onFinishFailed: FormProps['onFinishFailed'] = () => {};

  const renderMessage = (content: string) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  const handlePortalLogin = async ($key: ProviderTypes) => {
    try {
      const res = await dispatch({
        type: 'auth/getOAuth',
        payload: $key,
      });
      const { authorization_url: authorizationUrl }: { authorization_url: string } = res as any;
      if (authorizationUrl) {
        setUrl(authorizationUrl);
        setOpened(true);
        setProvider($key);
      }
    } catch (err) {
      console.log('[DEBUG]: handlePortalLogin -> err', err);
    }
  };

  return (
    <div className={styles.main}>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          username: 'acc004',
          password: 'secret@123',
        }}
      >
        <h2>
          <FormattedMessage id="user-login.login.title" />
        </h2>
        {error && !submitting && renderMessage(error)}
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-login.username.required',
              }),
            },
          ]}
        >
          <Input
            placeholder={formatMessage({
              id: 'user-login.login.username',
            })}
            size="large"
            id="username"
            prefix={<UserOutlined className={styles.prefixIcon} />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-login.password.required',
              }),
            },
          ]}
        >
          <Input.Password
            placeholder={`${formatMessage({
              id: 'user-login.login.password',
            })}`}
            size="large"
            prefix={<LockOutlined className={styles.prefixIcon} />}
            onPressEnter={onFinish}
          />
        </Form.Item>
        <Row justify="end">
          {/* <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
            <FormattedMessage id="user-login.login.remember-me" />
          </Checkbox> */}
          <Col>
            <Link className={styles.forgotPassword} to="/user/reset-password">
              <FormattedMessage id="user-login.login.reset-password" />
            </Link>
          </Col>
        </Row>
        <Form.Item>
          <Button
            size="large"
            className={styles.submit}
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
          >
            <FormattedMessage id="user-login.login.login" />
          </Button>
        </Form.Item>
        <div className={styles.other}>
          {opened && (
            <NewWindow
              url={url}
              title={`Social login with ${
                LOGIN_PROVIDERS.find(p => p.provider === provider)?.title
              }`}
              onUnload={() => {
                setOpened(false);
              }}
              features={{ left: 200, top: 200, width: 500, height: 650 }}
            />
          )}
          <FormattedMessage id="user-login.login.sign-in-with" />
          {LOGIN_PROVIDERS.map(({ IconProvider, provider: $provider }) => (
            <IconProvider
              key={$provider}
              className={styles.icon}
              onClick={() => handlePortalLogin($provider)}
            />
          ))}
          <Link className={styles.register} to="/user/register">
            <FormattedMessage id="user-login.login.signup" />
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
