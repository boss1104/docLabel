import { queryProjectList, requestJoinProject } from './service';
import { arrayToObject, getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'projects',
  state: {
    list: {},
    pagination: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryProjectList, payload);
      const ret = {
        list: arrayToObject(res.results, 'id'),
        pagination: {
          total: res.count,
          next: res.next && getPageQuery(res.next),
          previous: res.previous && getPageQuery(res.previous),
        },
      };
      yield put({
        type: 'changeProjects',
        payload: ret,
      });
      return ret;
    },
    *requestJoinProject({ payload }, { call }) {
      const res = yield call(requestJoinProject, payload);

      return res;
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
