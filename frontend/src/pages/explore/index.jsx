import React from 'react';
import { connect } from 'dva';

import styles from './style.less';
import FilterForm from './components/FilterForm';
import Projects from './components/Projects';

const Explore = connect(({ projects, loading }) => ({
  projects,
  loading: loading.models.projects,
}))(props => {
  const { dispatch, projects, loading, location } = props;

  return (
    <div className={styles.coverCardList}>
      <FilterForm location={location} />
      <div className={styles.cardList}>
        <Projects />
      </div>
    </div>
  );
});

export default Explore;
