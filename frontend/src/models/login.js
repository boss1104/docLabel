import { routerRedux } from 'dva/router';
import { accountLogin, accountLogout } from '@/services/login';
import { setAuthorization, setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

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
      // const urlParams = new URL(window.location.href);
      // const params = getPageQuery();
      // let { redirect } = params;
      // if (redirect) {
      //   const redirectUrlParams = new URL(redirect);
      //   if (redirectUrlParams.origin === urlParams.origin) {
      //     redirect = redirect.substr(urlParams.origin.length + 4);
      //     if (redirect.match(/^\/.*#/)) {
      //       redirect = redirect.substr(redirect.indexOf('#') + 1);
      //     }
      //   } else {
      //     window.location.href = redirect;
      //     return;
      //   }
      // }
      // yield put(routerRedux.replace(redirect || '/'));
      yield put(routerRedux.replace('/'));
    },

    *logout(_, { call, put }) {
      const res = yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {},
      });
      yield put({
        type: 'user/saveCurrentUser',
        payload: {},
      });
      setAuthority();
      reloadAuthorized();
      return res;
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
