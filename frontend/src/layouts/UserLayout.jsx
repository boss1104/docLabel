import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link, router } from 'umi';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { GithubOutlined } from '@ant-design/icons';
import SelectLang from '@/components/SelectLang';
import { getAuthorization } from '@/utils/authority';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import LayoutFooter from './components/LayoutFooter';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    dispatch,
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);

  React.useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'settings/changeTheme',
      });
    }
  }, []);

  const isLogin = getAuthorization() !== 'undefined' && getAuthorization() !== null;

  if (isLogin) {
    router.push('/');
  }

  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/home">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Doclabel</span>
              </Link>
            </div>
            <div className={styles.desc}>{`${'The text annotation for your teams'}`}</div>
          </div>
          {children}
        </div>
        <LayoutFooter />
      </div>
    </React.Fragment>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
