import { router } from 'umi';
import { deleteProject } from './service';

const Model = {
  namespace: 'setting',
  state: {
    status: undefined,
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      // const response = yield call(fetch, payload);
      // yield put({
      //   type: 'changeState',
      //   payload: {
      //     ...response,
      //   },
      // });
    },
    *deleteProject({ payload: id }, { call, put }) {
      yield call(deleteProject, id);

      // Clear currentProject
      yield put({
        type: 'project/saveCurrentProject',
        payload: {},
      });

      router.push({
        pathname: '/',
      });
    },
  },
  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
