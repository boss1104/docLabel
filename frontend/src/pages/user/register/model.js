import { register } from './service';

const Model = {
  namespace: 'userRegister',
  state: {
    status: undefined,
    errors: null,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const data = yield call(register, payload);
      console.log('data', data);
      yield put({
        type: 'registerHandle',
        payload: data,
      });
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status, errors: payload.errors };
    },
  },
};
export default Model;
