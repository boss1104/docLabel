import { addLabel, queryLabel, removeRule, updateLabel } from './service';
import { arrayToObject } from '@/utils/utils';

const Model = {
  namespace: 'label',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put, select, take }) {
      let projectId = yield select(state => state.project.currentProject.id);
      if (!projectId) {
        const action = yield take('project/saveCurrentProject');
        projectId = action.payload.id;
      }
      const response = yield call(queryLabel, { projectId, ...payload });
      const ret = arrayToObject(response, 'id');
      yield put({
        type: 'save',
        payload: ret,
      });

      return ret;
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
