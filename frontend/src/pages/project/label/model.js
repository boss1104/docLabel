import { addLabel, queryRule, removeRule, updateRule } from './service';

const Model = {
  namespace: 'label',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      // const response = yield call(queryRule, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },

    *add({ payload, callback }, { call, put, select }) {
      const id = yield select(state => state.project.currentProject.id);
      const response = yield call(addLabel, { data: payload, id });

      const { statusCode } = response;
      if (statusCode) {
        delete response.statusCode;
        if (callback) callback(response);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
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
