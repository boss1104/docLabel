import { fetch } from './service';

const Model = {
  namespace: 'contributor',
  state: {
    status: undefined
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      // const response = yield call(fetch, payload);
      // yield put({
      //   type: 'changeState',
      //   payload: {
      //     ...response,
      //   },
      // });
    }
  },
  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
export default Model;
