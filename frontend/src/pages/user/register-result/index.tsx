import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Result, Typography } from 'antd';
import { RouterTypes, Link } from 'umi';
import React from 'react';
import styles from './style.less';

const RegisterResult: React.FC<RouterTypes> = ({ location }) => {
  const { state } = location;

  return (
    <Result
      className={styles.registerResult}
      status="success"
      title={
        <div className={styles.title}>
          <FormattedMessage id="userandregister-result.register-result.msg" />
          <Typography.Title level={3}>
            {state ? state?.email : 'doclabel@example.com'}
          </Typography.Title>
        </div>
      }
      subTitle={<FormattedMessage id="userandregister-result.register-result.activation-email" />}
      extra={
        <div className={styles.actions}>
          <p>
            <FormattedMessage id="userandregister-result.register-result.amazing" />
          </p>
          <Link to="/user/register">
            <Button size="large">
              <FormattedMessage id="userandregister-result.register-result.back" />
            </Button>
          </Link>
          <Link to="/explore">
            <Button size="large" type="primary">
              <FormattedMessage id="userandregister-result.register-result.view-projects" />
            </Button>
          </Link>
        </div>
      }
    />
  );
};

export default RegisterResult;
