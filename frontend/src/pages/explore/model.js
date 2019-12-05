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
          count: res.count,
          next: res.next && getPageQuery(res.next),
          previous: res.previous && getPageQuery(res.previous),
        },
      };
      yield put({
        type: 'changeState',
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
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
