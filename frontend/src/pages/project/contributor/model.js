import {
  fetchProjectRoles,
  fetchRoles,
  fetchUsers,
  switchRole,
  addRole,
  deleteRole,
  fetchProjectNotification,
  markAsReadNotification,
} from './service';

const Model = {
  namespace: 'contributor',
  state: {
    roles: [],
    users: [],
    projectRoles: [],
    notifications: [],
  },
  effects: {
    *fetchContributor(_, { call, put, select, all, take }) {
      let projectId = yield select(state => state.project.currentProject.id);
      if (!projectId) {
        const action = yield take('project/saveCurrentProject');
        projectId = action.payload.id;
      }
      const { roles, users, projectRoles, notifications } = yield all({
        roles: call(fetchRoles),
        users: call(fetchUsers),
        projectRoles: call(fetchProjectRoles, projectId),
        notifications: yield call(fetchProjectNotification, { projectId }),
      });
      const ret = { roles, users, projectRoles, notifications };
      yield put({
        type: 'changeState',
        payload: {
          ...ret,
        },
      });
      return ret;
    },
    *switchRole({ payload }, { call, put, select }) {
      // switch to object List => to get better performance
      const projectId = yield select(state => state.project.currentProject.id);

      const res = yield call(switchRole, { projectId, roleId: payload.roleId, data: payload.data });

      const projectRoles = yield select(state => state.contributor.projectRoles);
      const labelIndex = projectRoles.findIndex(val => val.id === res.id);
      projectRoles[labelIndex] = res;

      yield put({
        type: 'changeState',
        payload: {
          projectRoles,
        },
      });

      return projectRoles;
    },
    *addRole({ payload }, { call, put, select, take }) {
      const projectId = yield select(state => state.project.currentProject.id);

      const res = yield call(addRole, { projectId, data: payload });

      const projectRoles = yield select(state => state.contributor.projectRoles);

      yield put({
        type: 'changeState',
        payload: {
          projectRoles: [...projectRoles, res],
        },
      });

      return res;
    },
    *deleteRole({ payload }, { call, put, select, take }) {
      const projectId = yield select(state => state.project.currentProject.id);

      yield call(deleteRole, { projectId, roleId: payload });

      const projectRoles = yield select(state => state.contributor.projectRoles);

      yield put({
        type: 'changeState',
        payload: {
          projectRoles: projectRoles.filter(item => item.id !== payload),
        },
      });
    },
    *markAsReadNotification({ payload }, { call, put, select }) {
      const projectId = yield select(state => state.project.currentProject.id);

      yield call(markAsReadNotification, { projectId, notifyId: payload });

      const notifications = yield select(state => state.contributor.notifications);

      yield put({
        type: 'changeState',
        payload: {
          notifications: notifications.filter(item => item.id !== payload),
        },
      });
    },
  },
  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
