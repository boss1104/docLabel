import { updateGuideline } from './service';

const Model = {
  namespace: 'guide',
  state: {},
  effects: {
    *updateGuideline({ payload }, { call, put, select, take }) {
      let projectId = yield select(state => state.project.currentProject.id);
      if (!projectId) {
        const action = yield take('project/saveCurrentProject');
        projectId = action.payload.id;
      }
      const response = yield call(updateGuideline, { projectId, data: payload });
      yield put({
        type: 'project/saveCurrentProject',
        payload: response,
      });
      return response;
    },
  },
  reducers: {
    changeGuide(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
