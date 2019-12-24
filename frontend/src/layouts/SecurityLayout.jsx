import { connect } from 'dva';
import { stringify } from 'querystring';
import React from 'react';
import { Redirect } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';

const SecurityLayout = props => {
  const [isReady, setIsReady] = React.useState(false);
  const { dispatch, children, loading, currentUser, location } = props;
  const isHome = ['/home', '/explore', '/'].includes(location.pathname);

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        await dispatch({
          type: 'user/fetchCurrent',
        });
      } catch (err) {
        console.log('[DEBUG]: fetchCurrentUser -> err', err);
      }
    };

    if (dispatch) {
      fetchCurrentUser();
    }

    dispatch({
      type: 'settings/changeTheme',
    });

    setIsReady(true);
  }, []);
  // You can replace it to your authentication rule (such as check token exists)
  // const isLogin = getAuthorization() !== 'undefined' && getAuthorization() !== null;
  const isLogin = currentUser && currentUser.id;
  const queryString = stringify({
    redirect: window.location.href,
  });

  if ((!isLogin && loading) || !isReady) {
    return <PageLoading />;
  }
  if (!isLogin && !isHome) {
    return <Redirect to={`/user/login?${queryString}`} />;
  }

  return children;
};

export default connect(({ user, loading, settings }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  theme: settings.themeName,
}))(SecurityLayout);
