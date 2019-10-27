import { fetch } from './service';

const Model = {
  namespace: 'dashboard',
  state: {
    status: undefined,
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      // const response = yield call(fetch, payload);
      // yield put({
      //   type: 'changeProjects',
      //   payload: {
      //     ...response,
      //     list: response.results,
      //   },
      // });
    },
  },
  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
