import { register } from './service';

const Model = {
  namespace: 'userRegister',
  state: {
    status: undefined,
    data: {},
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const data = yield call(register, payload);
      const { statusCode } = data;
      if (statusCode) {
        delete data.statusCode;
      }
      yield put({
        type: 'registerHandle',
        payload: {
          status: !statusCode,
          data,
        },
      });
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status, data: payload.data };
    },
  },
};
export default Model;
