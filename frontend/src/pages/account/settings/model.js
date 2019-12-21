import { updateAccount, changeAvatar, changePassword } from './service';

const Model = {
  namespace: 'accountSettings',
  state: {},
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
      const res = yield call(changeAvatar, { data: payload });

      yield put({
        type: 'user/saveCurrentUser',
        payload: res,
      });

      return res;
    },
    *changePassword({ payload }, { call }) {
      const res = yield call(changePassword, { data: payload });
      return res;
    },
  },
  reducers: {
    changeLoading(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
