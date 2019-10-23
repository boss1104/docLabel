import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Result, Icon, message } from 'antd';
import React from 'react';
import { connect } from 'dva';
import styles from './style.less';

const RegisterConfirm = ({ dispatch, match }) => {
  const confirmEmail = () => {
    const { params } = match;
    if (params) {
      dispatch({
        type: 'userRegisterConfirm/confirm',
        payload: params,
      });
    }
  };

  const actions = (
    <div className={styles.actions}>
      <Button size="large" type="primary" onClick={confirmEmail}>
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
        // subTitle={<FormattedMessage id="user-register-confirm.redirect"></FormattedMessage>}
        extra={actions}
      />
    </div>
  );
};

export default connect(({ userLogin, loading }) => ({
  userLogin,
  submitting: loading.effects['userLogin/confirm'],
}))(RegisterConfirm);
