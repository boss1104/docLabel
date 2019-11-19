import { fetchTask, removeTask, updateTask } from './service';
import { getPageQuery, arrayToObject } from '@/utils/utils';

const Model = {
  namespace: 'task',
  state: {
    list: {},
    pagination: {},
  },
  effects: {
    *fetch({ payload }, { call, put, take, select }) {
      let projectId = yield select(state => state.project.currentProject.id);
      if (!projectId) {
        const action = yield take('project/saveCurrentProject');
        projectId = action.payload.id;
      }
      try {
        const response = yield call(fetchTask, { projectId, ...payload });

        const ret = {
          list: arrayToObject(response.results, 'id'),
          pagination: {
            total: response.count,
            next: response.next && getPageQuery(response.next),
            previous: response.previous && getPageQuery(response.previous),
          },
        };
        yield put({
          type: 'save',
          payload: ret,
        });
        return ret;
      } catch (error) {
        return error.data;
      }
    },

    *remove({ payload }, { call, put, select, take }) {
      let projectId = yield select(state => state.project.currentProject.id);
      if (!projectId) {
        const action = yield take('project/saveCurrentProject');
        projectId = action.payload.id;
      }
      yield call(removeTask, { projectId, ...payload });
    },

    *update({ payload }, { call, put }) {
      const response = yield call(updateTask, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default Model;
