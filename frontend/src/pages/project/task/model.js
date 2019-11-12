import { queryTask, removeTask, updateTask } from './service';
import { getPageQuery, arrayToObject } from '@/utils/utils';

const Model = {
  namespace: 'task',
  state: {
    list: [],
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
        const response = yield call(queryTask, { projectId, ...payload });

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

    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addTask, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTask, payload);
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateTask, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        console.log('TCL: setup -> query', query);
        if (pathname.includes('/task')) {
          dispatch({
            type: 'fetch',
            payload: {
              params: query,
            },
          });
        }
      });
    },
  },
};

export default Model;
