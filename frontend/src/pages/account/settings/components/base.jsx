import { Button, Form, Input, Select, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import styles from './BaseView.less';
import { useWhyDidYouUpdate } from '@/hooks';
import { getAuthorization } from '@/utils/authority';

const FormItem = Form.Item;
const { Option } = Select;

const AvatarView = React.memo(props => {
  const { avatar, uploadProps, uploading } = props;
  useWhyDidYouUpdate('AvatarView', props);
  return (
    <Fragment>
      <div className={styles.avatar_title}>
        <FormattedMessage id="accountSettings.basic.avatar" defaultMessage="Avatar" />
      </div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload {...uploadProps} showUploadList={false}>
        <div className={styles.button_view}>
          <Button icon="upload" loading={uploading}>
            <FormattedMessage
              id="accountSettings.basic.change-avatar"
              defaultMessage="Change avatar"
            />
          </Button>
        </div>
      </Upload>
    </Fragment>
  );
});

@connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.effects['accountSettings/updateAccount'],
}))
class BaseView extends Component {
  view = undefined;

  state = {
    uploading: false,
  };

  uploadProps = {
    name: 'avatar',
    action: '/api/user/',
    method: 'PATCH',
    headers: {
      Authorization: `Token ${getAuthorization()}`,
    },
    beforeUpload: () => {},
    onChange: info => {
      console.log('[DEBUG]: BaseView -> uploadProps -> info', info);
      if (info.file.status === 'uploading') {
        this.setState({ uploading: true });
        return;
      }
      if (info.file.status === 'done') {
        this.setState({ uploading: false });
        this.props.dispatch({
          type: 'user/saveCurrentUser',
          payload: info.file.response,
        });
        message.success('Avatar changed successfully');
      } else if (info.file.status === 'error') {
        message.error('Avatar upload failed.');
      }
    },
  };

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      console.log('[DEBUG]: BaseView -> fieldsValue', fieldsValue);
      if (!err) {
        try {
          await dispatch({
            type: 'accountSettings/updateAccount',
            payload: {
              ...fieldsValue,
            },
          });
          message.success(
            formatMessage({
              id: 'accountSettings.basic.update.success',
            }),
          );
        } catch (error) {
          console.log('[DEBUG]: BaseView -> error', error.data);

          message.error(
            formatMessage({
              id: 'accountSettings.basic.update.failed',
            }),
          );
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { uploading } = this.state;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem
              label={formatMessage({
                id: 'accountSettings.basic.fullname',
              })}
            >
              {getFieldDecorator('full_name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'accountSettings.basic.fullname-message',
                      },
                      {},
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={formatMessage({
                id: 'accountSettings.basic.email',
              })}
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'accountSettings.basic.email-message',
                      },
                      {},
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>

            <Button type="primary" onClick={this.handlerSubmit} loading={loading}>
              <FormattedMessage
                id="accountSettings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView
            avatar={this.getAvatarURL()}
            uploadProps={this.uploadProps}
            uploading={uploading}
          />
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
