import React from 'react';
import { connect } from 'dva';

import styles from './style.less';
import FilterForm from './components/FilterForm';
import Projects from './components/Projects';
import { useWhyDidYouUpdate } from '@/hooks';

function Explore(props) {
  const { location } = props;
  return (
    <div className={styles.coverCardList}>
      <FilterForm location={location} />
      <div className={styles.cardList}>
        <Projects location={location} />
      </div>
    </div>
  );
}

export default connect(({ projects, loading }) => ({
  projects,
  loading: loading.models.projects,
}))(Explore);
