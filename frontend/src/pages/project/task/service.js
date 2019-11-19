import request from '@/utils/request';
import { PAGE_SIZE } from './constants';

export async function fetchTask({ projectId, params }) {
  return request(`/api/projects/${projectId}/docs/`, {
    params: {
      ...params,
      limit: PAGE_SIZE,
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
