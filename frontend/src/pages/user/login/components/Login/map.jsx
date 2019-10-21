import { Icon } from 'antd';
import React from 'react';
import styles from './index.less';

export default {
  Email: {
    props: {
      size: 'large',
      id: 'email',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: 'Please enter your email!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Please enter your password!',
      },
    ],
  },
};
