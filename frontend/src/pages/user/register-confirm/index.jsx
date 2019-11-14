import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Result, Icon, message } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import styles from './style.less';

const RegisterConfirm = ({ dispatch, match, loading }) => {
  const confirmEmail = async () => {
    const { params } = match;
    if (params) {
      try {
        await dispatch({
          type: 'userRegister/confirm',
          payload: params,
        });
        message.success('Successfully confirm email!');

        router.push({
          pathname: '/user/login',
        });
      } catch (e) {
        message.error('Something wrong. Try again!');
      }
    }
  };

  const actions = (
    <div className={styles.actions}>
      <Button size="large" type="primary" onClick={confirmEmail} loading={loading}>
        <FormattedMessage id="user-register-confirm.confirm" />
      </Button>
    </div>
  );

  return (
    <div className={styles.main}>
      <h2>
        <FormattedMessage id="user-register-confirm.verify-email" />
      </h2>
      <Result
        className={styles.registerConfirm}
        icon={<Icon type="smile" theme="twoTone" />}
        title={
          <div className={styles.title}>
            <FormattedMessage id="user-register-confirm.result.msg" />
          </div>
        }
        extra={actions}
      />
    </div>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['userRegister/confirm'],
}))(RegisterConfirm);
