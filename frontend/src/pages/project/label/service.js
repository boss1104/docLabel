import request from '@/utils/request';

export async function queryLabel({ projectId, params }) {
  return request(`/api/projects/${projectId}/labels/`, {
    params,
  });
}

export async function addLabel({ projectId, data }) {
  return request(`/api/projects/${projectId}/labels/`, {
    method: 'POST',
    data,
  });
}

export async function updateLabel({ projectId, labelId, data }) {
  return request(`/api/projects/${projectId}/labels/${labelId}/`, {
    method: 'PATCH',
    data,
  });
}

export async function removeRule({ projectId, labelId }) {
  return request(`/api/projects/${projectId}/labels/${labelId}/`, {
    method: 'DELETE',
  });
}
