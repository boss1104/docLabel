import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/projects/', {
    method: 'GET',
    params,
  });
}

export async function requestJoinProject({ projectId, role }) {
  return request(`/api/projects/${projectId}/join/`, {
    method: 'POST',
    data: { role },
  });
}
