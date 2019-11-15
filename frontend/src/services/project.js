import request from '@/utils/request';

export async function queryCurrent(id) {
  return request(`/api/projects/${id}/`, {
    method: 'GET',
  });
}

export async function createProject(payload) {
  return request('/api/projects/', {
    method: 'POST',
    data: payload,
  });
}
