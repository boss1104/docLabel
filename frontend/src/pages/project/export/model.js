import { download } from './service';

const Model = {
  namespace: 'extract',
  state: {},
  effects: {
    *download({ payload }, { call, select, take }) {
      let projectId = yield select(state => state.project.currentProject.id);
      if (!projectId) {
        const action = yield take('project/saveCurrentProject');
        projectId = action.payload.id;
      }
      const res = yield call(download, { projectId, type: payload });

      return res;
    },
  },
  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
