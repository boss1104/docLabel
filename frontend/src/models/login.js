import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { accountLogin, accountLogout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { reloadAuthorizationInterceptors } from '@/utils/request';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      console.log(response);

      yield put({
        type: 'changeLoginStatus',
        payload: { ...response },
      });

      // Login successfully
      if (response.status === 'success') {
        reloadAuthorized();
        reloadAuthorizationInterceptors();
        // Stored token
        const { remember } = payload;
        if (remember) {
          // TODO
          // localStorage.setItem('access_token', response.access_token);
          // localStorage.setItem('refresh_token', reposonse.refresh_token);
        }
        // Redirect
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *logout(_, { call, put }) {
      const { redirect } = getPageQuery(); // redirect
      const response = yield call(accountLogout);
      console.log(response);
      // changeLoginStatus
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
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
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.access_token);
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
