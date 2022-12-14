/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';

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
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList, isLogin) =>
  menuList.map($item => {
    const item = { ...$item };
    const isHome = ['/home', '/explore', '/'].includes(item.path);
    if (!isLogin && !isHome) {
      item.hideInMenu = true;
    }
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children, isLogin, isHome) : [],
    };

    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/app',
    },
    currentUser,
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
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
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/app') || {
    authority: undefined,
  };

  const isLogin = currentUser && currentUser.id;

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuDataRender={menuList => menuDataRender(menuList, isLogin)}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [...routers]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, user }) => ({
  collapsed: global.collapsed,
  settings,
  currentUser: user.currentUser,
}))(BasicLayout);
