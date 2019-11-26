import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { router } from 'umi';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { getAuthorization } from '@/utils/authority';

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
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Doclabel</span>
              </Link>
            </div>
            <div className={styles.desc}>Doclabel</div>
          </div>
          {children}
        </div>
        <DefaultFooter />
      </div>
    </React.Fragment>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
