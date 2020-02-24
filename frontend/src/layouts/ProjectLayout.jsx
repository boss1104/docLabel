/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, router } from 'umi';
import { connect } from 'dva';
import { ArrowLeftOutlined, GithubOutlined } from '@ant-design/icons';
import { Result, Button, Spin, List, Typography } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import Authorized, { reloadAuthorized } from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import LayoutFooter from './components/LayoutFooter';
/**
 * use Authorized check all menu item
 */

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const ProjectLayout = connect(({ global, settings, loading }) => ({
  collapsed: global.collapsed,
  settings,
  loading: loading.effects['project/fetchProject'],
}))(props => {
  const {
    dispatch,
    children,
    settings,
    match,
    location = {
      pathname: '/app',
    },
    loading,
  } = props;
  /**
   * constructor
   */
  const [isReady, setIsReady] = React.useState(false);

  const fetchCurrentProject = async () => {
    const res = await dispatch({
      type: 'project/fetchProject',
      payload: match.params.id,
    });
    reloadAuthorized();
    setIsReady(true);
    // if (!res.current_users_role.is_project_admin) {
    //   router.push('/exception/403');
    // }
  };

  useEffect(() => {
    if (dispatch) {
      fetchCurrentProject();
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  // get children authority
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const isLoading = loading || !isReady;

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      links={[
        <Link to="/account/center">
          <ArrowLeftOutlined /> Center
        </Link>,
      ]}
      menuDataRender={menuDataRender}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        let { path } = menuItemProps;
        if (match.path !== match.url) {
          // Compute the right path
          Object.keys(match.params).forEach(key => {
            path = path.replace(`:${key}`, match.params[key]);
          });
        }

        return <Link to={path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [...routers]}
      // Antd Breadcrumb
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={<LayoutFooter />}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
      layout="sidemenu"
      fixedHeader={false}
    >
      {!isLoading && (
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      )}
    </ProLayout>
  );
});

export default ProjectLayout;
