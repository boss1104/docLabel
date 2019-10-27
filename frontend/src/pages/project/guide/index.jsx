import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

const Guide = props => {
  const { dispatch } = props;
  return <div className={styles.main}>Markdown editor side 2 side</div>;
};

export default connect(({ guide, loading }) => ({
  guide,
  loading: loading.models.guide,
}))(Guide);
