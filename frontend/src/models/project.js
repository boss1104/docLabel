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
        const str = '/projects/';
        if (pathname.includes(str)) {
          let id = pathname.substr(pathname.indexOf(str) + str.length);
          id = id.substr(0, id.indexOf('/') === -1 ? id.length : id.indexOf('/'));
          dispatch({
            type: 'fetchProject',
            payload: id,
          });
        }
      });
    },
  },
};
export default UserModel;
