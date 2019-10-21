import { routerRedux } from 'dva/router';
import { confirmRegister, accountLogin } from './service';

import { getPageQuery, setAuthority } from './utils';

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },
  effects: {
    *confirm({ payload }, { call, put }) {
      const data = yield call(confirmRegister, payload);
      console.log('data', data);
      yield put({
        type: 'changeLoginStatus',
        payload: data,
      });
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
