import { ConnectState } from '@/models/connect';
import { Button, DatePicker, Form, Input, message, Modal, Popover, Progress } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { useDispatch, useSelector } from 'dva';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import {
  USER_FULLNAME_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
} from './locales/en-US';
import styles from './style.less';

const FormItem = Form.Item;

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

const Register: React.FC<FormComponentProps> = ({ form }) => {
  const { getFieldDecorator } = form;
  const dispatch = useDispatch();
  const auth = useSelector<ConnectState>(state => state.auth);
  const submitting = useSelector<ConnectState>(state => state.loading.effects['auth/register']);

  const [confirmBirth, setConfirmBirth] = useState(true);
  const [birth, setBirth] = useState<Moment | null>(null);
  const [ageHelp, setAgeHelp] = useState('');
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [visible, setVisible] = useState(false);
  const [help, setHelp] = useState('');

  useEffect(() => {
    form.setFieldsValue({
      // full_name: 'account001',
      // username: 'account001',
      // email: 'jefaf39409@hideemail.net',
      // password1: 'secret@123',
      // password2: 'secret@123',
    });
  }, []);

  const checkAge = () => {
    const age = moment().diff(birth!, 'years');
    const isLegal = age >= 16;
    let $confirmBirth;
    let $ageHelp;
    if (!birth) {
      $confirmBirth = false;
      $ageHelp = formatMessage({
        id: 'user-register.birth.required',
      });
    } else if (!isLegal) {
      $confirmBirth = false;
      $ageHelp = '';
      Modal.warning({
        title: 'You must be 16+ years old to create an account',
        content:
          "However, you can still participate as an anonymous user as you don't need an account for doing so.",
      });
    } else {
      $confirmBirth = true;
      $ageHelp = '';
    }
    setAgeHelp($ageHelp);
    setConfirmBirth($confirmBirth);
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password1');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const handleSubmit = () => {
    form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        try {
          const res = await dispatch({
            type: 'userRegister/submit',
            payload: values,
          });

          message.success(res.detail);
          router.push({
            pathname: '/user/register-result',
            state: {
              account: form.getFieldValue('email'),
            },
          });
        } catch (error) {
          const { data } = error;
          Object.entries(data).forEach(([key, value]) => {
            data[key] = {
              value: form.getFieldValue(key),
              errors: [new Error(value[0])],
            };
          });

          form.setFields({ ...data });
          message.error('Something wrong! Try again');
        }
      }
    });
  };

  const checkUsername = (rule, value, callback) => {
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

  const checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password1')) {
      callback(
        formatMessage({
          id: 'user-register.password.twice',
        }),
      );
    } else {
      callback();
    }
  };

  const checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: formatMessage({
          id: 'user-register.password.required',
        }),
        visible: true,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (value.length < 6) {
        callback('error');
        if (!visible) {
          this.setState({
            visible: !!value,
          });
        }
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['password2'], {
            force: true,
          });
        }
        callback();
      }
    }
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password1');
    const passwordStatus = getPasswordStatus();
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

  return (
    <div className={styles.main}>
      <h2>
        <FormattedMessage id="user-register.register.register" />
      </h2>
      <div>
        {confirmBirth && (
          <Form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormItem>
              {getFieldDecorator('first_name', {
                rules: [
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
                ],
              })(
                <Input
                  size="large"
                  placeholder={formatMessage({
                    id: 'user-register.first_name.placeholder',
                  })}
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('last_name', {
                rules: [
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
                ],
              })(
                <Input
                  size="large"
                  placeholder={formatMessage({
                    id: 'user-register.last_name.placeholder',
                  })}
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'user-register.username.required',
                    }),
                  },
                  {
                    validator: checkUsername,
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
            <FormItem>
              {getFieldDecorator('email', {
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
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
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
                      validator: checkPassword,
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
              {getFieldDecorator('re_password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'user-register.confirm-password.required',
                    }),
                  },
                  {
                    validator: checkConfirm,
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
              <Button
                size="large"
                loading={Boolean(submitting)}
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
        )}
        {/* Age restriction */}
        {!confirmBirth && (
          <Form>
            <h4>To create an account you must be 16+ years old. Please enter your date of birth</h4>
            <FormItem validateStatus={ageHelp && 'error'} help={ageHelp}>
              <DatePicker
                size="large"
                className={styles.datePicker}
                onChange={(date, dateString) => {
                  setBirth(date);
                }}
              />
            </FormItem>
            <FormItem>
              <Button size="large" type="primary" onClick={checkAge}>
                <FormattedMessage id="user-register.check-age" />
              </Button>
            </FormItem>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Form.create()(Register);
