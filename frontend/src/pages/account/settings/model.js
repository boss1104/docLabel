import { updateAccount, changeAvatar } from './service';

const Model = {
  namespace: 'accountSettings',
  state: {
    isLoading: false,
  },
  effects: {
    *updateAccount({ payload }, { call, put }) {
      const res = yield call(updateAccount, { data: payload });
      const ret = {
        ...res,
      };
      yield put({
        type: 'user/saveCurrentUser',
        payload: ret,
      });
      return ret;
    },
    *changeAvatar({ payload }, { call, put }) {
      console.log('[DEBUG]: *changeAvatar -> payload', payload);
      const res = yield call(changeAvatar, { data: payload });

      yield put({
        type: 'user/saveCurrentUser',
        payload: res,
      });

      return res;
    },
  },
  reducers: {
    changeLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
};
export default Model;
