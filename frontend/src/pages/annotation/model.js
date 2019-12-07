import { queryAnno, addAnno, removeAnno, editAnno, markCompleted, markApproved } from './service';

export default {
  namespace: 'annotation',
  state: {
    annotation: {},
  },
  effects: {
    *queryAnno({ payload }, { call, put, select }) {
      const { projectId, docId, data } = payload;
      const res = yield call(addAnno, { projectId, docId, data });
      return res;
    },
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
    *markCompleted(_, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const res = yield call(markCompleted, { projectId });
      return res;
    },
    *markApproved({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);
      const { taskId, user, prob } = payload;
      const res = yield call(markApproved, { projectId, taskId, data: { prob, user } });
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
