import { addAnno, removeAnno, editAnno, completedAnno } from './service';

export default {
  namespace: 'annotation',
  state: {
    annotation: {},
  },
  effects: {
    *addAnno({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const { taskId, data } = payload;
      const res = yield call(addAnno, { projectId, taskId, data });
      return res;
    },
    *editAnno({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const { taskId, annotationId, data } = payload;
      try {
        const res = yield call(editAnno, { projectId, taskId, annotationId, data });
        return res;
      } catch (error) {
        return error.data;
      }
    },
    *removeAnno({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const { taskId, annotationId } = payload;
      const res = yield call(removeAnno, { projectId, taskId, annotationId });
    },
    *completedAnno({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const { taskId } = payload;
      const res = yield call(completedAnno, { projectId, taskId });
      return res;
    },
  },
  reducers: {
    saveAnnotation: (state, { payload = {} }) => ({
      ...state,
      ...payload,
    }),
  },
};
