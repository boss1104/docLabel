import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import { accountLogin, accountLogout } from '@/services/login';
import { setAuthorization, setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
// import { reloadAuthorized } from '@/utils/Authorized';
// import { reloadAuthorizationInterceptors } from '@/utils/request';

const Model = {
  namespace: 'login',
  state: {},
  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(accountLogin, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: res,
      });

      /**
       * Redirect
       */
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length + 4);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },

    *logout(_, { call, put }) {
      const { redirect } = getPageQuery(); // redirect
      const response = yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {},
      });
      reloadAuthorized();
      setAuthority();
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
      message.success(
        formatMessage({
          id: 'user-login.login.logout-message',
        }),
      );
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthorization(payload.key);
      return { ...state, ...payload };
    },
  },
};
export default Model;
