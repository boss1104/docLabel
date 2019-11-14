import { register, confirmRegister } from './service';

const Model = {
  namespace: 'userRegister',
  state: {},
  effects: {
    *submit({ payload }, { call, put }) {
      const res = yield call(register, payload);
      yield put({
        type: 'changeRegister',
        payload: res,
      });

      return res;
    },
    *confirm({ payload }, { call, put }) {
      const res = yield call(confirmRegister, payload);
      yield put({
        type: 'changeRegister',
        payload: res,
      });

      return res;
    },
  },
  reducers: {
    changeRegister(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
