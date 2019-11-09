import { queryCurrent } from '@/services/project';

const UserModel = {
  namespace: 'project',
  state: {
    currentProject: {},
  },
  effects: {
    *fetchProject({ payload }, { call, put }) {
      // payload ~ params
      const response = yield call(queryCurrent, payload);
      // console.log('TCL: *fetchProject -> response', response);
      yield put({ type: 'saveCurrentProject', payload: response });
    },
  },
  reducers: {
    saveCurrentProject(state, action) {
      return { ...state, currentProject: action.payload || {} };
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
