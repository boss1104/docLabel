/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { router } from 'umi';
import Authorized, { reloadAuthorized } from '@/utils/Authorized';
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
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
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

const footerRender = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
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

const AnnotationLayout = connect(({ global, settings, loading }) => ({
  collapsed: global.collapsed,
  settings,
  loading: loading.effects['project/fetchProject'],
}))(props => {
  const {
    dispatch,
    children,
    match,
    settings,
    location = {
      pathname: '/app',
    },
    loading,
  } = props;
  /**
   * constructor
   */
  const [isReady, setIsReady] = React.useState(false);

  const { id: projectId } = match.params;

  const fetchProject = async () => {
    if (projectId) {
      const res = await dispatch({
        type: 'project/fetchProject',
        payload: projectId,
      });

      if (res && !res.public) {
        router.push('/home');
      } else {
        reloadAuthorized();
      }

      setIsReady(true);
    }
  };

  React.useEffect(() => {
    if (dispatch) {
      fetchProject();
    }
    return () => {
      dispatch({
        type: 'project/cleanProject',
      });
    };
  }, [projectId]);

  React.useEffect(() => {
    dispatch({
      type: 'settings/getSetting',
    });
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
      menuDataRender={menuDataRender}
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
      // footerRender={footerRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
      disableMobile
      contentStyle={{ margin: 0 }}
    >
      {!isLoading && (
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      )}
    </ProLayout>
  );
});

export default AnnotationLayout;
