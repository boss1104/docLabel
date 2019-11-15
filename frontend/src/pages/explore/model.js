import { message } from 'antd';
import { queryProjectList } from './service';

const Model = {
  namespace: 'projects',
  state: {
    count: null,
    next: null,
    previous: null,
    list: [],
    page: 1,

    // Create state
    status: undefined,
    errors: null,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      // console.log('payload', payload);
      const response = yield call(queryProjectList, payload);
      yield put({
        type: 'changeProjects',
        payload: {
          ...response,
          list: response.results,
        },
      });
    },
  },
  reducers: {
    changePage(state, action) {
      return { ...state, page: action.payload };
    },
    changeProjects(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
