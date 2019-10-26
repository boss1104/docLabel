import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/projects/', {
    method: 'GET',
    params,
  });
}

export async function createProject(payload) {
  return request('/api/projects/', {
    method: 'POST',
    data: payload,
  });
}
