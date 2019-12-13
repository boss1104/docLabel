import { connect } from 'dva';
import React from 'react';
import FilterForm from './components/FilterForm';
import Projects from './components/Projects';
import styles from './style.less';

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
