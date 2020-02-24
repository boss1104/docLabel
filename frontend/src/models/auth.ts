import {
  activation,
  getOAuth,
  login,
  loginOAuth,
  logout,
  register,
  resendActivation,
  resetPassword,
  resetPasswordConfirm,
} from '@/services/auth';
import { setAuthority, setAuthorization } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { getPageQuery } from '@/utils/utils';
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { router } from 'umi';

export interface AuthModelState {
  token?: string;
}

export interface AuthModelType {
  namespace: 'auth';
  state: AuthModelState;
  effects: {
    register: Effect;
    activation: Effect;
    resendActivation: Effect;
    login: Effect;
    logout: Effect;
    resetPassword: Effect;
    resetPasswordConfirm: Effect;
    getOAuth: Effect;
    loginOAuth: Effect;
  };
  reducers: {
    changeAuth: Reducer<AuthModelState>;
  };
}

const Model: AuthModelType = {
  namespace: 'auth',

  state: {
    token: undefined,
  },

  effects: {
    *register({ payload }, { call }) {
      const res = yield call(register, payload);
      return res;
    },

    *activation({ payload }, { call }) {
      const res = yield call(activation, payload);
      return res;
    },

    *resendActivation({ payload }, { call }) {
      const res = yield call(resendActivation, payload);
      return res;
    },

    *login({ payload }, { call, put }) {
      const res = yield call(login, payload);

      yield put({
        type: 'changeAuth',
        payload: {
          token: res.auth_token,
        },
      });

      // /**
      //  * Redirect
      //  */
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params as { redirect: string };
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
      const res = yield call(logout);
      yield put({
        type: 'changeAuth',
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
    *resetPassword({ payload }, { call }) {
      yield call(resetPassword, payload);
    },
    *resetPasswordConfirm({ payload }, { call, put }) {
      const res = yield call(resetPasswordConfirm, payload);
      yield put({
        type: 'changeAuth',
        payload: res,
      });
      return res;
    },
    *getOAuth({ payload }, { call }) {
      const res = yield call(getOAuth, payload);

      return res;
    },
    *loginOAuth({ payload }, { call, put }) {
      const res = yield call(loginOAuth, payload);
      yield put({
        type: 'changeAuth',
        payload: {
          token: res.access,
        },
      });
      return res;
    },
  },

  reducers: {
    changeAuth(state, { payload }) {
      setAuthorization(payload.token);
      return { ...state, ...payload };
    },
  },
};
export default Model;
