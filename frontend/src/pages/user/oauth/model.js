import { githubOAuth } from './service';

const Model = {
  namespace: 'oauth',
  state: {
    opened: false,
  },
  effects: {
    *githubOAuth({ payload }, { call, put }) {
      const res = yield call(githubOAuth, payload);
      yield put({
        type: 'login/changeLoginStatus',
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
