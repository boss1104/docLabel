import { ConnectState } from '@/models/connect';
import { loginProviders, loginProviderSettings } from '@/pages/constants';
import { Alert, Col, Icon, message, Row, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import React, { useEffect, useRef, useState } from 'react';
import NewWindow from 'react-new-window';
import { Link, router } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Form, { FormComponentProps } from 'antd/lib/form/Form';

import { LoginParamsType } from '@/services/auth';
import styles from './style.less';

const nonFieldErrors = {
  'E-mail is not verified.': 'user-login.login.email-not-verified',
  'Unable to log in with provided credentials.': 'user-login.login.invalid-credentials',
};

const Login: React.FC<FormComponentProps> = ({ form }) => {
  const dispatch = useDispatch();
  const submitting = useSelector<ConnectState>(state => state.loading.effects['login/login']);
  const opened = useSelector<ConnectState>(state => state.oauth.opened);
  const { getFieldDecorator } = form;

  const [autoLogin, setAutoLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState('google');

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

  const changeAutoLogin = e => {
    setAutoLogin(e.target.checked);
  };

  const handleSubmit = async (err: any, values: LoginParamsType) => {
    if (!err) {
      try {
        await dispatch({
          type: 'auth/login',
          payload: { ...values },
        });
        setError(null);
        message.success('Welcome!');
      } catch (e) {
        const { data } = e;
        setError(data.non_field_errors[0]);
      }
    }
  };

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

  const handlePortalLogin = ($key: string) => {
    setKey($key);
    dispatch({
      type: 'oauth/changeOAuth',
      payload: {
        opened: true,
      },
    });
  };

  const newWindowUnloaded = () => {
    dispatch({
      type: 'oauth/changeOAuth',
      payload: {
        opened: false,
      },
    });
  };

  const getUrl = () => {
    const { authorizationUri, scope, clientId, redirectUri } = loginProviderSettings[key];
    if (key === 'github') {
      return `${authorizationUri}?scope=${scope}&client_id=${clientId}`;
    }

    if (key === 'google') {
      return (
        `${authorizationUri}?scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}` +
        '&response_type=code&access_type=offline'
      );
    }
    return '';
  };

  return (
    <div className={styles.main}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          form.validateFields(handleSubmit);
        }}
      >
        <h2>
          <FormattedMessage id="user-login.login.title" />
        </h2>
        {error && !submitting && renderMessage(error)}
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'user-login.username.required',
                }),
              },
            ],
          })(
            <Input
              placeholder={formatMessage({
                id: 'user-login.login.username',
              })}
              size="large"
              id="username"
              prefix={<Icon type="user" className={styles.prefixIcon} />}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'user-login.password.required',
                }),
              },
            ],
          })(
            <Input
              placeholder={`${formatMessage({
                id: 'user-login.login.password',
              })}`}
              size="large"
              type="password"
              prefix={<Icon type="lock" className={styles.prefixIcon} />}
              onPressEnter={e => {
                e.preventDefault();
                form.validateFields(handleSubmit);
              }}
            />,
          )}
        </Form.Item>
        <Row type="flex" justify="end">
          {/* <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
            <FormattedMessage id="user-login.login.remember-me" />
          </Checkbox> */}
          <Col>
            <Link className={styles.forgotPassword} to="/user/forgot-password">
              <FormattedMessage id="user-login.login.forgot-password" />
            </Link>
          </Col>
        </Row>
        <Form.Item>
          <Button
            size="large"
            className={styles.submit}
            type="primary"
            htmlType="submit"
            loading={Boolean(submitting)}
          >
            <FormattedMessage id="user-login.login.login" />
          </Button>
        </Form.Item>
        <div className={styles.other}>
          {opened && (
            <NewWindow
              url={getUrl()}
              title={`Social login with ${loginProviders[key].title}`}
              onUnload={() => newWindowUnloaded()}
              features={{ left: 200, top: 200, width: 500, height: 650 }}
            />
          )}
          <FormattedMessage id="user-login.login.sign-in-with" />
          {Object.entries(loginProviders).map(([$key, val]) => (
            <Icon
              key={$key}
              type={val.type}
              className={styles.icon}
              theme={val.theme}
              onClick={() => handlePortalLogin($key)}
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

export default Form.create<FormComponentProps>()(Login);
