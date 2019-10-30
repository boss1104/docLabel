import { router } from 'umi';
import { deleteProject, updateProject } from './service';

const Model = {
  namespace: 'setting',
  state: {
    status: undefined,
    errors: [],
  },
  effects: {
    *updateProject({ payload }, { call, put, select }) {
      // const { id, values } = payload;
      const response = yield call(updateProject, payload);

      if (response.statusCode) {
        yield put({
          type: 'changeState',
          payload: {
            status: false,
            errors: response,
          },
        });
      } else {
        yield put({
          type: 'changeState',
          payload: {
            status: true,
            errors: [],
          },
        });
        yield put({
          type: 'project/saveCurrentProject',
          payload: response,
        });
      }
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
