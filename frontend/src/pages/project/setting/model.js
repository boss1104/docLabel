import { router } from 'umi';
import { deleteProject, updateProject } from './service';

const Model = {
  namespace: 'setting',
  state: {},
  effects: {
    *updateProject({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const response = yield call(updateProject, { id: projectId, data: payload });

      yield put({
        type: 'project/saveCurrentProject',
        payload: response,
      });
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
