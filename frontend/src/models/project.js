import pathToRegexp from 'path-to-regexp';
import { queryCurrent, createProject } from '@/services/project';
import { arrayToObject } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';

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

      return response;
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
    *cleanProject({ payload }, { put }) {
      yield put({
        type: 'saveCurrentProject',
        payload: {},
      });
    },
  },
  reducers: {
    saveCurrentProject(state, { payload }) {
      const authority =
        Object.keys(payload).length > 0
          ? Object.keys(payload.current_users_role).filter(item => payload.current_users_role[item])
          : '';
      setAuthority(authority);
      return { ...state, currentProject: payload || {} };
    },
    changeProjectState(state, action) {
      return { ...state, ...action.payload };
    },
  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     return history.listen(({ pathname, query }) => {
  //       const match = pathToRegexp('/projects/:id/(.*)').exec(pathname);
  //       if (match && history.action === 'POP') {
  //         dispatch({
  //           type: 'fetchProject',
  //           payload: match[1],
  //         });
  //       }
  //     });
  //   },
  // },
};
export default UserModel;
