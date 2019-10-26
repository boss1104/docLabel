import { message } from 'antd';
import { queryProjectList, createProject } from './service';

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
    *createProject({ payload }, { call, put }) {
      let res = yield call(createProject, payload);
      console.log('TCL: *createProject -> res', res);
      const { statusCode } = res;

      if (statusCode) {
        delete res.statusCode;
      } else {
        res = null;
        message.success('Project has been created successfully !');
      }
      yield put({
        type: 'changeProjects',
        payload: {
          errors: res,
          status: !statusCode,
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
