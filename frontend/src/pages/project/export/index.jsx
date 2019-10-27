import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

const Extract = props => {
  const { dispatch } = props;
  return <div className={styles.main}>Download data</div>;
};

export default connect(({ extract, loading }) => ({
  extract,
  loading: loading.models.extract,
}))(Extract);
