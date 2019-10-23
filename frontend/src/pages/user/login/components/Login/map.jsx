import { Icon } from 'antd';
import React from 'react';
import styles from './index.less';

export default {
  Username: {
    props: {
      size: 'large',
      id: 'username',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'username',
    },
    rules: [
      {
        required: true,
        message: 'Please enter your username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: 'password',
    },
    rules: [
      {
        required: true,
        message: 'Please enter your password!',
      },
    ],
  },
};
