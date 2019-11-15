import { fetchMyProject } from './service';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'accountCenter',
  state: {
    myProjects: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchMyProject({ payload }, { call, put }) {
      const res = yield call(fetchMyProject, { ...payload, mine: 1 });

      const ret = {
        list: Array.isArray(res.results) ? res.results : [],
        pagination: {
          count: res.count,
          next: res.next ? getPageQuery(res.next) : null,
          prev: res.previous ? getPageQuery(res.previous) : null,
        },
      };

      yield put({
        type: 'changeState',
        payload: {
          myProjects: ret,
        },
      });

      return ret;
    },
  },
  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
