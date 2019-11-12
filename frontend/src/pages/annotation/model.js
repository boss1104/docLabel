import { addAnno, removeAnno, editAnno } from './service';

export default {
  namespace: 'annotation',
  state: {
    // taskid: [{}]
    annotation: {},
  },
  effects: {
    *addAnno({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const { taskId, data } = payload;
      try {
        const res = yield call(addAnno, { projectId, taskId, data });
        return res;
      } catch (error) {
        return error.data;
      }
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
      try {
        const res = yield call(removeAnno, { projectId, taskId, annotationId });
        return res;
      } catch (error) {
        return error.data;
      }
    },
  },
  reducers: {
    saveAnnotation: (state, { payload = {} }) => ({
      ...state,
      ...payload,
    }),
  },
};
