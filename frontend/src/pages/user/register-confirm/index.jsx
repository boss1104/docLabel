import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Button, Result, Icon, message } from 'antd';
import Link from 'umi/link';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/projects">
      <Button size="large" type="primary">
        <FormattedMessage id="user-register-confirm.register-result.view-projects" />
      </Button>
    </Link>
  </div>
);

const RegisterConfirm = ({ location, dispatch }) => {
  useEffect(() => {
    // http://localhost:8000/user/register-confirm?key=.eJxNyjsKgDAMANC7ZBaxdXMSLyKxjSCkTelHBfHuVnBwfbwL1sLs0REMwLKTkSALNPARGiPF565T1cjhxjNaG_953M_X2yyhnoApHRJtHZNWut-4VDXiE_kMQ46F7gc7lSgJ.XaHA8Q.ZBmFxMaBXEWTDoM4sjDkkOdBMz4
    const {
      search,
      query: { key },
    } = location;
    console.log('location', location);
    if (key) {
      dispatch({
        type: 'userLogin/confirm',
        payload: search,
      });
    } else {
      message.warn('The address missing key');
    }
  }, []);

  return (
    <Result
      className={styles.registerConfirm}
      icon={<Icon type="smile" theme="twoTone" />}
      title={
        <div className={styles.title}>
          <FormattedMessage id="user-register-confirm.result.msg" />
        </div>
      }
      subTitle={<FormattedMessage id="user-register-confirm.redirect"></FormattedMessage>}
      // extra={actions}
    />
  );
};

export default connect(({ userLogin, loading }) => ({
  userLogin,
  submitting: loading.effects['userLogin/confirm'],
}))(RegisterConfirm);
