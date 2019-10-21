import {
  Button,
  Col,
  Form,
  Input,
  Popover,
  Progress,
  Row,
  Select,
  message,
  Checkbox,
  DatePicker,
  Modal,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import styles from './style.less';
import { USER_FULLNAME_MAX_LENGTH, USER_NAME_MAX_LENGTH, NOT_VALID_CHARS } from './locales/en-US';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
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
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ userRegister, loading }) => ({
  userRegister,
  submitting: loading.effects['userRegister/submit'],
}))
class Register extends Component {
  state = {
    confirmBirth: true,
    birth: null,
    ageHelp: '',
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentDidMount() {
    const { form } = this.props;
    form.setFieldsValue({
      fullname: 'lovecopob',
      name: 'account001',
      email_addr: 'lovecopob@vxmail.top',
      password: 'B2123ilu',
      confirm: 'B2123ilu',
      consent: true,
    });
  }

  componentDidUpdate() {
    const { userRegister, form } = this.props;
    const account = form.getFieldValue('email_addr');

    if (userRegister.status === 'success') {
      message.success('Registration success!');
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  checkAge = () => {
    let { confirmBirth, ageHelp } = this.state;
    const { birth } = this.state;
    const age = moment().diff(birth, 'years');
    const isLegal = age >= 16;
    if (!birth) {
      confirmBirth = false;
      ageHelp = formatMessage({
        id: 'user-register.birth.required',
      });
    } else if (!isLegal) {
      confirmBirth = false;
      ageHelp = '';
      Modal.warning({
        title: 'You must be 16+ years old to create an account',
        content:
          "However, you can still participate as an anonymous user as you don't need an account for doing so.",
      });
    } else {
      confirmBirth = true;
      ageHelp = '';
    }
    this.setState({
      ageHelp,
      confirmBirth,
    });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'userRegister/submit',
            payload: { ...values },
          });
        }
      },
    );
  };

  checkFullname = (rule, value, callback) => {
    const { form } = this.props;

    if (value && (value.length > USER_FULLNAME_MAX_LENGTH || value.length < 3)) {
      callback(
        formatMessage({
          id: 'user-register.fullname.length',
        }),
      );
    } else {
      callback();
    }
  };

  checkUsername = (rule, value, callback) => {
    const { form } = this.props;
    if (value && (value.length > USER_NAME_MAX_LENGTH || value.length < 3)) {
      callback(
        formatMessage({
          id: 'user-register.username.length',
        }),
      );
    } else if (value && !value.match(/^[a-zA-Z0-9]+$/)) {
      callback(
        formatMessage({
          id: 'user-register.username.wrong-format',
        }),
      );
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback(
        formatMessage({
          id: 'user-register.password.twice',
        }),
      );
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: formatMessage({
          id: 'user-register.password.required',
        }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }

      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting, dispatch, userRegister } = this.props;
    const { getFieldDecorator } = form;
    const { errors } = userRegister;
    const { count, prefix, help, visible, confirmBirth, ageHelp } = this.state;
    return (
      <div className={styles.main}>
        <h2>
          <FormattedMessage id="user-register.register.register" />
        </h2>
        <div>
          {confirmBirth ? (
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('fullname', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'user-register.fullname.required',
                      }),
                    },
                    {
                      validator: this.checkFullname,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({
                      id: 'user-register.fullname.placeholder',
                    })}
                  />,
                )}
              </FormItem>
              <FormItem
                {...(errors &&
                  errors.name && {
                    help: errors.name[0],
                    validateStatus: 'error',
                  })}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'user-register.username.required',
                      }),
                    },
                    {
                      validator: this.checkUsername,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({
                      id: 'user-register.username.placeholder',
                    })}
                  />,
                )}
              </FormItem>
              <FormItem
                {...(errors &&
                  errors.email_addr && {
                    help: errors.email_addr[0],
                    validateStatus: 'error',
                  })}
              >
                {getFieldDecorator('email_addr', {
                  rules: [
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
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({
                      id: 'user-register.email.placeholder',
                    })}
                  />,
                )}
              </FormItem>
              <FormItem help={help}>
                <Popover
                  getPopupContainer={node => {
                    if (node && node.parentNode) {
                      return node.parentNode;
                    }

                    return node;
                  }}
                  content={
                    <div
                      style={{
                        padding: '4px 0',
                      }}
                    >
                      {passwordStatusMap[this.getPasswordStatus()]}
                      {this.renderPasswordProgress()}
                      <div
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <FormattedMessage id="user-register.strength.msg" />
                      </div>
                    </div>
                  }
                  overlayStyle={{
                    width: 240,
                  }}
                  placement="right"
                  visible={visible}
                >
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        validator: this.checkPassword,
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      type="password"
                      placeholder={formatMessage({
                        id: 'user-register.password.placeholder',
                      })}
                    />,
                  )}
                </Popover>
              </FormItem>
              <FormItem>
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'user-register.confirm-password.required',
                      }),
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder={formatMessage({
                      id: 'user-register.confirm-password.placeholder',
                    })}
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('consent', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>
                    <FormattedMessage id="user-register.consent.content" />
                  </Checkbox>,
                )}
              </FormItem>
              <FormItem>
                <Button
                  size="large"
                  loading={submitting}
                  className={styles.submit}
                  type="primary"
                  htmlType="submit"
                >
                  <FormattedMessage id="user-register.register.register" />
                </Button>
                <Link className={styles.login} to="/user/login">
                  <FormattedMessage id="user-register.register.sign-in" />
                </Link>
              </FormItem>
            </Form>
          ) : (
            <Form>
              <h4>
                To create an account you must be 16+ years old. Please enter your date of birth
              </h4>
              <FormItem validateStatus={ageHelp && 'error'} help={ageHelp}>
                <DatePicker
                  size="large"
                  className={styles.datePicker}
                  onChange={(date, dateString) => {
                    this.setState({ birth: date });
                  }}
                />
              </FormItem>
              <FormItem>
                <Button size="large" type="primary" onClick={this.checkAge}>
                  <FormattedMessage id="user-register.check-age" />
                </Button>
              </FormItem>
            </Form>
          )}
        </div>
      </div>
    );
  }
}

export default Form.create()(Register);
