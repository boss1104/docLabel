import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/explore">
      <Button size="large" type="primary">
        <FormattedMessage id="userandregister-result.register-result.view-projects" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="userandregister-result.register-result.msg"
          values={{
            email: location.state ? location.state.account : 'AntDesign@example.com',
          }}
        />
      </div>
    }
    subTitle={
      <div>
        <p>
          <FormattedMessage id="userandregister-result.register-result.activation-email" />
        </p>
        <p>
          <FormattedMessage id="userandregister-result.register-result.amazing" />
        </p>
      </div>
    }
    extra={actions}
  />
);

export default RegisterResult;
