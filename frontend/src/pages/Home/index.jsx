import React from 'react';
import { enquireScreen } from 'enquire-js';

import { connect } from 'dva';
import Feature2 from './components/Feature2';
import Teams0 from './components/Teams0';
import Content0 from './components/Content0';
import Footer0 from './components/Footer0';

import {
  Feature20DataSource,
  Teams00DataSource,
  Content00DataSource,
  Footer00DataSource,
} from './data.source';
import styles from './index.less';
import { useWhyDidYouUpdate } from '@/hooks';
import { HomeProvider } from './components/HomeContext';

let initIsMobile;
enquireScreen(b => {
  initIsMobile = b;
});

const { location } = window;

function Home(props) {
  const { isDark } = props;
  // useWhyDidYouUpdate('Home', props);
  const [isMobile, setIsMobile] = React.useState(initIsMobile);
  const [show, setShow] = React.useState(!location.port);

  const domRef = React.useRef(null);

  React.useEffect(() => {
    enquireScreen(b => {
      setIsMobile(!!b);
    });
    if (location.port) {
      setTimeout(() => {
        setShow(true);
      }, 500);
    }
  }, []);

  const children = [
    <Feature2 id="Feature2_0" key="Feature2_0" dataSource={Feature20DataSource} />,
    <Teams0 id="Teams0_0" key="Teams0_0" dataSource={Teams00DataSource} />,
    <Content0 id="Content0_0" key="Content0_0" dataSource={Content00DataSource} />,
    // <Footer0 id="Footer0_0" key="Footer0_0" dataSource={Footer00DataSource} />,
  ];

  const getContext = () => ({
    isDark,
    isMobile,
  });

  return (
    <HomeProvider value={getContext()}>
      <div className={styles.mainHome} ref={domRef}>
        {show && children}
      </div>
    </HomeProvider>
  );
}

export default connect(({ settings }) => ({
  isDark: settings.navTheme === 'dark',
}))(Home);
