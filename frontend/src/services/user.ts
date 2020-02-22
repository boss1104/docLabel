import request from '@/utils/request';

export async function queryCurrent() {
  return request('/api//auth/users/me/');
}

export async function queryNotices() {
  return request('/api/notices/');
}
