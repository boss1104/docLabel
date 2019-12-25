import Authorized, { reloadAuthorized } from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import { Button, message, Result } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { router } from 'umi';
import Link from 'umi/link';

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

const AnnotationLayout = connect(({ loading }) => ({
  loading: loading.effects['project/fetchProject'],
}))(props => {
  const {
    dispatch,
    children,
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

  const { id: projectId } = match.params;

  const fetchProject = async () => {
    if (projectId) {
      const res = await dispatch({
        type: 'project/fetchProject',
        payload: projectId,
      });

      if (res && !res.public) {
        router.push('/home');
        message.warn('Project is not ready!');
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

  // get children authority
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const isLoading = loading || !isReady;

  return (
    <>
      {!isLoading && (
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      )}
    </>
  );
});

export default AnnotationLayout;
