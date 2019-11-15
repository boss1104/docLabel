import request from '@/utils/request';

export async function fetchMyProject(params) {
  return request('/api/projects/', {
    method: 'GET',
    params,
  });
}
