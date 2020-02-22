import { githubOAuth, googleOAuth } from './service';

const Model = {
  namespace: 'oauth',
  state: {
    opened: false,
  },
  effects: {
    *githubOAuth({ payload }, { call, put }) {
      const res = yield call(githubOAuth, payload);
      yield put({
        type: 'auth/changeLoginStatus',
        payload: res,
      });
    },
    *googleOAuth({ payload }, { call, put }) {
      const res = yield call(googleOAuth, payload);
      yield put({
        type: 'auth/changeLoginStatus',
        payload: res,
      });
    },
  },
  reducers: {
    changeOAuth(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
