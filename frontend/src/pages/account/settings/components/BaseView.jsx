import { Button, Form, Input, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { connect } from 'dva';

import styles from './BaseView.less';
import { getAuthorization } from '@/utils/authority';

const FormItem = Form.Item;

const AvatarView = React.memo(props => {
  const { avatar, uploadProps, uploading } = props;
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

function BaseView({ dispatch, currentUser, form, loading }) {
  const { getFieldDecorator } = form;
  const viewRef = useRef(undefined);

  const [uploading, setUploading] = useState(false);

  const setBaseInfo = () => {
    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  useEffect(() => {
    setBaseInfo();
    return () => {};
  }, []);

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  };

  const handlerSubmit = event => {
    event.preventDefault();
    form.validateFields(async (err, fieldsValue) => {
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
          message.error(
            formatMessage({
              id: 'accountSettings.basic.update.failed',
            }),
          );
        }
      }
    });
  };

  return (
    <div className={styles.baseView} ref={viewRef}>
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
          {/* <FormItem
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
          </FormItem> */}

          <Button type="primary" onClick={handlerSubmit} loading={loading}>
            <FormattedMessage
              id="accountSettings.basic.update"
              defaultMessage="Update Information"
            />
          </Button>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView
          avatar={getAvatarURL()}
          uploadProps={{
            name: 'avatar',
            action: '/api/user/',
            method: 'PATCH',
            headers: {
              Authorization: `Token ${getAuthorization()}`,
            },
            beforeUpload: () => {},
            onChange: info => {
              if (info.file.status === 'uploading') {
                setUploading(true);
                return;
              }
              if (info.file.status === 'done') {
                setUploading(false);
                dispatch({
                  type: 'user/saveCurrentUser',
                  payload: info.file.response,
                });
                message.success('Avatar changed successfully');
              } else if (info.file.status === 'error') {
                message.error('Avatar upload failed.');
              }
            },
          }}
          uploading={uploading}
        />
      </div>
    </div>
  );
}

export default Form.create()(
  connect(({ user, loading }) => ({
    currentUser: user.currentUser,
    loading: loading.effects['accountSettings/updateAccount'],
  }))(BaseView),
);
