import request from '@/utils/request';
import { PAGE_SIZE } from '@/pages/constants';

export async function fetchTask({ projectId, params, data }) {
  console.log('[DEBUG]: fetchTask -> data', data);
  return request(`/api/projects/${projectId}/docs/`, {
    method: 'GET',
    params: {
      ...params,
      limit: PAGE_SIZE,
      ...data,
    },
  });
}

export async function removeTask({ projectId, taskId }) {
  return request(`/api/projects/${projectId}/docs/${taskId}/`, {
    method: 'DELETE',
  });
}

export async function updateTask({ projectId, taskId, data }) {
  return request(`/api/projects/${projectId}/docs/${taskId}`, {
    method: 'PATCH',
    data,
  });
}
