/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import withRouter from 'umi/withRouter';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.svg';
/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const footerRender = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return (
      <>
        {/* {defaultDom} */}
        <div
          style={{
            padding: '0px 24px 24px',
            textAlign: 'center',
          }}
        >
          {/* TODO: refer defaultDom design */}
          Doclabel HS
        </div>
      </>
    );
  }

  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const ProjectLayout = props => {
  const { dispatch, children, settings, match } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
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

  return (
    <ProLayout
      logo={logo}
      fixSiderbar
      onCollapse={handleMenuCollapse}
      menuDataRender={menuDataRender}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
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
      breadcrumbRender={(routers = []) => [
        // {
        //   path: '/project/dashboard',
        //   breadcrumbName: formatMessage({
        //     id: 'menu.projectHome',
        //     defaultMessage: 'Project',
        //   }),
        // },
        ...routers,
      ]}
      // Antd Breadcrumb
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      // {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(withRouter(ProjectLayout));
