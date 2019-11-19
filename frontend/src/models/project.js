import pathToRegexp from 'path-to-regexp';
import { queryCurrent, createProject } from '@/services/project';
import { arrayToObject } from '@/utils/utils';

const UserModel = {
  namespace: 'project',
  state: {
    currentProject: {},
    list: [],
    pagination: {},
  },
  effects: {
    *fetchProject({ payload }, { call, put }) {
      // payload ~ params
      const response = yield call(queryCurrent, payload);
      // console.log('TCL: *fetchProject -> response', response);
      yield put({ type: 'saveCurrentProject', payload: response });
    },
    *createProject({ payload }, { call, put }) {
      const res = yield call(createProject, payload);
      const ret = res;
      yield put({
        type: 'changeProjectState',
        payload: ret,
      });
      return ret;
    },
  },
  reducers: {
    saveCurrentProject(state, action) {
      return { ...state, currentProject: action.payload || {} };
    },
    changeProjectState(state, action) {
      return { ...state, ...action.payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const match = pathToRegexp('/projects/:id/(.*)').exec(pathname);
        if (match && history.action === 'POP') {
          dispatch({
            type: 'fetchProject',
            payload: match[1],
          });
        }
      });
    },
  },
};
export default UserModel;
