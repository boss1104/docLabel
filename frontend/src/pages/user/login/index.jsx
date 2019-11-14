import { Alert, Checkbox, Button, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Username, Password, Submit } = LoginComponents;

const nonFieldErrors = {
  'E-mail is not verified.': 'user-login.login.email-not-verified',
  'Unable to log in with provided credentials.': 'user-login.login.invalid-credentials',
};

@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    autoLogin: true,
    error: false,
  };

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
        message.success('Successfully login!');
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

  render() {
    const { submitting } = this.props;
    const { type, autoLogin, error } = this.state;
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
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              <FormattedMessage id="user-login.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
          <div className={styles.other}>
            <FormattedMessage id="user-login.login.sign-in-with" />
            {/* <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" /> */}
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
