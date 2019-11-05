import { addLabel, queryLabel, removeRule, updateLabel } from './service';

const Model = {
  namespace: 'label',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload: projectId }, { call, put }) {
      const response = yield call(queryLabel, { projectId, params: {} });
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addLabel, payload);

      const { statusCode } = response;
      if (statusCode) {
        delete response.statusCode;
        if (callback) callback(response);
      } else {
        // TODO: Re fetching ?
        console.log('TCL: *add -> response', response);

        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateLabel, payload);
      const { statusCode: error } = response;
      if (error) {
        delete response.statusCode;
        if (callback) callback(response);
      } else {
        // TODO: Re fetching ?
        console.log('TCL: *add -> response', response);

        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
