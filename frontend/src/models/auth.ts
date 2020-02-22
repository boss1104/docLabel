import { Reducer } from 'redux';
import { Effect } from 'dva';

import {
  login,
  logout,
  register,
  activation,
  forgotPassword,
  confirmPassword,
} from '@/services/auth';
import { setAuthorization, setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { router } from 'umi';
import { getPageQuery } from '@/utils/utils';

export interface AuthModelState {
  token?: string;
}

export interface AuthModelType {
  namespace: 'auth';
  state: AuthModelState;
  effects: {
    register: Effect;
    activation: Effect;
    login: Effect;
    logout: Effect;
    forgotPassword: Effect;
    confirmPassword: Effect;
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
    *register({ payload }, { call, put }) {
      const res = yield call(register, payload);
      return res;
    },
    *activation({ payload }, { call, put }) {
      const res = yield call(activation, payload);
      yield put({
        type: 'changeAuth',
        payload: res,
      });

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
      // const urlParams = new URL(window.location.href);
      // const params = getPageQuery();
      // let { redirect } = params as { redirect: string };
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
      // router.replace(redirect || '/');
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
    *forgotPassword({ payload }, { call, put }) {
      const res = yield call(forgotPassword, payload);
      yield put({
        type: 'changeAuth',
        payload: res,
      });
      return res;
    },
    *confirmPassword({ payload }, { call, put }) {
      const res = yield call(confirmPassword, payload);
      yield put({
        type: 'changeAuth',
        payload: res,
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
