import { fetchStatistics } from './service';

const Model = {
  namespace: 'dashboard',
  state: {
    statistics: {},
  },
  effects: {
    *fetchStatistics({ payload }, { call, put, select, take }) {
      let projectId = yield select(state => state.project.currentProject.id);
      if (!projectId) {
        const action = yield take('project/saveCurrentProject');
        projectId = action.payload.id;
      }
      try {
        const response = yield call(fetchStatistics, { projectId, params: payload });
        const ret = { ...response };
        yield put({
          type: 'changeDashboard',
          payload: {
            statistics: ret,
          },
        });
        return ret;
      } catch (error) {
        return error.data;
      }
    },
  },
  reducers: {
    changeDashboard(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
