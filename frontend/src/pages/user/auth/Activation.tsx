import { ConnectState } from '@/models/connect';
import { SmileTwoTone } from '@ant-design/icons';
import { Button, message, Result } from 'antd';
import { useDispatch, useSelector } from 'dva';
import React from 'react';
import { router, RouterTypes } from 'umi';
import { FormattedMessage } from 'umi-plugin-react/locale';

import styles from './Activation.less';

interface ActivationProps extends RouterTypes {}

const Activation: React.FC<ActivationProps> = ({ match }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: ConnectState) => state.loading.effects['auth/activation']);

  const confirmEmail = async () => {
    const { params } = match;
    if (params) {
      try {
        await dispatch({
          type: 'auth/activation',
          payload: params,
        });
        message.success('Account has been activated successfully!');

        router.push({
          pathname: '/user/login',
        });
      } catch (e) {
        message.error('Something wrong. Try again!');
      }
    }
  };

  return (
    <div className={styles.activation}>
      <h2>
        <FormattedMessage id="user-activation.verify-email" />
      </h2>
      <Result
        className={styles.activationResult}
        icon={<SmileTwoTone />}
        title={
          <div className={styles.title}>
            <FormattedMessage id="user-activation.result.msg" />
          </div>
        }
        extra={
          <div className={styles.extraBtn}>
            <Button type="primary" onClick={confirmEmail} loading={loading}>
              <FormattedMessage id="user-activation.confirm" />
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Activation;
