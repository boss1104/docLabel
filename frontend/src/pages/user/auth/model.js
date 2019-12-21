import { forgotPassword, confirmPassword } from './service';

const Model = {
  namespace: 'auth',
  state: {},
  effects: {
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
      return { ...state, ...payload };
    },
  },
};
export default Model;
