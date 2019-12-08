import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import TopBanner from './components/TopBanner';
import FeatureCards from './components/FeatureCards';
import ProjectsBanner from './components/ProjectsBanner';

function Home(props) {
  const [state, setState] = React.useState();
  return (
    <div className={styles.main}>
      <TopBanner />
      <FeatureCards />
      <ProjectsBanner />
    </div>
  );
}
export default React.memo(Home);
