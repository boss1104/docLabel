import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent } from '@/services/user';

export interface CurrentUser {
  first_name: string;
  last_name: string;
  email: string;
  id: number;
  username: string;
  avatar?: string;
  is_superuser: boolean;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    // changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: undefined,
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const res = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: res,
      });
      return res;
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    // changeNotifyCount(
    //   state = {
    //     currentUser: undefined,
    //   },
    //   action,
    // ) {
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       // notifyCount: action.payload.totalCount,
    //       // unreadCount: action.payload.unreadCount,
    //     },
    //   };
    // },
  },
};
export default UserModel;
