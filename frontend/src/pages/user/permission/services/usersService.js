import request from '@/utils/request';
/**
 * User查询
 */
export const queryUsersList = () => request('/api/queryUsersList');

/**
 * User分配角色
 */
export const assignRole = ({ userId, role }) =>
  request('/api/assignRole', { method: 'POST', data: { userId, role } });
