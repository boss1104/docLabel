import { Alert, Col, Icon, message, Row, Button } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import NewWindow from 'react-new-window';
import { router } from 'umi';
import LoginComponents from './components/Login';
import styles from './style.less';
import { loginProviders, loginProviderSettings } from '@/pages/constants';

const { Username, Password, Submit } = LoginComponents;

const nonFieldErrors = {
  'E-mail is not verified.': 'user-login.login.email-not-verified',
  'Unable to log in with provided credentials.': 'user-login.login.invalid-credentials',
};

@connect(({ login, loading, oauth }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  opened: oauth.opened,
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    autoLogin: true,
    error: false,
    key: 'google',
  };

  componentDidMount() {
    window.addEventListener('storage', event => {
      if (event.key === 'antd-pro-authorization') {
        router.replace('/');
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('storage', () => {});
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = async (err, values) => {
    const { autoLogin } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      try {
        await dispatch({
          type: 'login/login',
          payload: { ...values },
        });
        this.setState({
          error: false,
        });
        message.success('Welcome!');
      } catch (e) {
        const { data } = e;
        this.setState({
          error: data.non_field_errors[0],
        });
      }
    }
  };

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  handlePortalLogin = $key => {
    const { dispatch } = this.props;
    this.setState({ key: $key });
    dispatch({
      type: 'oauth/changeOAuth',
      payload: {
        opened: true,
      },
    });
  };

  newWindowUnloaded = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'oauth/changeOAuth',
      payload: {
        opened: false,
      },
    });
  };

  getUrl = () => {
    const { key } = this.state;
    const { authorizationUri, scope, clientId } = loginProviderSettings[key];
    return `${authorizationUri}?scope=${scope}&client_id=${clientId}`;
  };

  render() {
    const { submitting, opened } = this.props;
    const { type, autoLogin, error, key } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
            form.setFieldsValue({
              username: 'account001',
              password: 'secret@123',
            });
          }}
        >
          <h2>
            <FormattedMessage id="user-login.login.title" />
            {/* <Button */}
            {/*  onClick={() => { */}
            {/*    const { dispatch } = this.props; */}
            {/*    dispatch({ */}
            {/*      type: 'login/logout', */}
            {/*    }); */}
            {/*  }} */}
            {/* > */}
            {/*  Logout */}
            {/* </Button> */}
            {/* <Button */}
            {/*  onClick={() => { */}
            {/*    const { dispatch } = this.props; */}
            {/*    dispatch({ */}
            {/*      type: 'user/fetchCurrent', */}
            {/*    }); */}
            {/*  }} */}
            {/* > */}
            {/*  Me */}
            {/* </Button> */}
          </h2>
          {error &&
            !submitting &&
            this.renderMessage(
              formatMessage({
                id: nonFieldErrors[error],
              }),
            )}
          <Username
            name="username"
            placeholder={formatMessage({
              id: 'user-login.login.username',
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'user-login.username.required',
                }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage({
              id: 'user-login.login.password',
            })}`}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'user-login.password.required',
                }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();

              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
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
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
          <div className={styles.other}>
            {opened && (
              <NewWindow
                url={this.getUrl()}
                title={`Social login with ${loginProviders[key].title}`}
                onUnload={() => this.newWindowUnloaded()}
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
                onClick={() => this.handlePortalLogin($key)}
              />
            ))}
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="user-login.login.signup" />
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
