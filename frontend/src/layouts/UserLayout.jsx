import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link, router } from 'umi';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import { Icon } from 'antd';
import SelectLang from '@/components/SelectLang';
import { getAuthorization } from '@/utils/authority';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

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

  const defaultFooterDom = (
    <DefaultFooter
      copyright="2019 ICT"
      links={[
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );

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
        {defaultFooterDom}
      </div>
    </React.Fragment>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
