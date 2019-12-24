import { accountLogin, accountLogout } from '@/services/login';
import { setAuthorization, setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { router } from 'umi';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    key: undefined,
  },
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
      router.replace(redirect || '/');
    },

    *logout(_, { call, put }) {
      const res = yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          key: undefined,
        },
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
