import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { getAuthorization, setAuthority } from '@/utils/authority';

@connect(({ user, loading, settings }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  theme: settings.themeName,
}))
class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/changeTheme',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;

    // You can replace it to your authentication rule (such as check token exists)
    const isLogin = getAuthorization() !== 'undefined' && getAuthorization() !== null;
    const queryString = stringify({
      redirect: window.location.href,
    });
    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default SecurityLayout;
