import request from '@/utils/request';

export async function queryCurrent(id) {
  return request(`/api/projects/${id}/`, {
    method: 'GET',
  });
}
