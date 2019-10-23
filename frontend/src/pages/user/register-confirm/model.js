import { routerRedux } from 'dva/router';
import { confirmRegister } from './service';

const Model = {
  namespace: 'userRegisterConfirm',
  state: {
    status: undefined,
  },
  effects: {
    *confirm({ payload }, { call, put }) {
      console.log('payload', payload);
      const data = yield call(confirmRegister, payload);
      console.log('data', data);
      const { detail: status } = data;
      yield put({
        type: 'changeConfirmStatus',
        payload: {
          status,
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        }),
      );
    },
  },
  reducers: {
    changeConfirmStatus(state, { payload }) {
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
