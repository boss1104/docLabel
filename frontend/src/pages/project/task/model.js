import { queryTask, removeTask, updateTask } from './service';

const Model = {
  namespace: 'task',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTask, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.results,
          pagination: {
            total: response.count,
          },
        },
      });
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
      return { ...state, data: action.payload };
    },
  },
};
export default Model;
