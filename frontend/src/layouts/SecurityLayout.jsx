import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { message } from 'antd';
import PageLoading from '@/components/PageLoading';
import { getAuthorization, setAuthority } from '@/utils/authority';
import themes from '@/themes';

const defaultVars = require('./vars.json');

@connect(({ user, loading, settings }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  theme: settings.themeName,
}))
class SecurityLayout extends React.Component {
  constructor(props) {
    super(props);

    const themeName = props.theme && themes[props.theme] ? props.theme : 'default';
    const vars = this.getThemeVars(themeName);

    this.state = {
      isReady: false,
    };

    if (!window.less || !window.less.modifyVars) {
      return;
    }

    // no need to delay modifyVars
    window.less
      .modifyVars(this.extractTheme(vars))
      .then(() => {
        // message.success('Theme loaded !');
      })
      .catch(() => {
        message.error('Failed to update theme');
      });
  }

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  extractTheme = vars => {
    const theme = {};
    Object.keys(vars).forEach(key => {
      theme[key] = vars[key].value;
    });

    return theme;
  };

  getThemeVars = themeName => {
    const vars = {};
    const cacheTheme = JSON.parse(localStorage.getItem(themeName));
    const theme = {
      ...themes[themeName],
      ...cacheTheme,
    };

    defaultVars.forEach(group => {
      group.children.forEach(item => {
        let { value } = item;
        if (item.name in theme) {
          value = theme[item.name];
        } else if (item.type === 'number') {
          value = `${value}${item.unit}`;
        }

        vars[item.name] = {
          ...item,
          value,
        };
      });
    });

    return vars;
  };

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
