import { queryLabel } from './service';
import { arrayToObject } from '@/utils/utils';

export default {
  namespace: 'annotation',
  state: {
    tasksList: {},
    taskPagination: {},
    labelsList: {},
  },
  effects: {
    *queryAnnotation({ payload }, { call, put, take }) {
      try {
        const label = yield take('label/save');
        const task = yield take('task/save');
        const ret = {
          tasksList: arrayToObject(task.payload.list, 'id'),
          taskPagination: task.payload.pagination,
          labelsList: arrayToObject(label.payload, 'id'),
        };
        yield put({
          type: 'saveAnnotation',
          payload: ret,
        });
        return ret;
      } catch (error) {
        return error.data;
      }
    },
  },
  reducers: {
    saveAnnotation: (state, { payload = [] }) => ({
      ...state,
      ...payload,
    }),
  },
};
