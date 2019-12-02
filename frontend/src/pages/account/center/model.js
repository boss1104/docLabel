import { fetchMyProject } from './service';
import { getPageQuery } from '@/utils/utils';

const getConversionObject = res => ({
  list: Array.isArray(res.results) ? res.results : [],
  pagination: {
    count: res.count,
    next: res.next ? getPageQuery(res.next) : null,
    prev: res.previous ? getPageQuery(res.previous) : null,
  },
});

const Model = {
  namespace: 'accountCenter',
  state: {
    myProjects: {
      list: [],
      pagination: {},
    },
    myContributions: {
      list: [],
      pagination: {},
    },
    myApprovals: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchMyProject({ payload }, { put, call }) {
      const res = yield call(fetchMyProject, { ...payload, role_project: 'admin' });
      const ret = getConversionObject(res);
      yield put({
        type: 'changeState',
        payload: {
          myProjects: ret,
        },
      });

      return ret;
    },
    *fetchMyContribution({ payload }, { put, call }) {
      const res = yield call(fetchMyProject, { ...payload, role_project: 'annotator' });
      const ret = getConversionObject(res);
      yield put({
        type: 'changeState',
        payload: {
          myContributions: ret,
        },
      });

      return ret;
    },
    *fetchMyApproval({ payload }, { put, call }) {
      const res = yield call(fetchMyProject, { ...payload, role_project: 'approver' });
      const ret = getConversionObject(res);
      yield put({
        type: 'changeState',
        payload: {
          myApprovals: ret,
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
