import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

const Contributor = props => {
  const { dispatch } = props;
  return (
    <div className={styles.main}>
      <div>Contributors | Invite contributor</div>
      <div>Label Tables</div>
    </div>
  );
};

export default connect(({ contributor, loading }) => ({
  contributor,
  loading: loading.models.contributor,
}))(Contributor);
