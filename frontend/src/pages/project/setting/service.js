import request from '@/utils/request';

export function deleteProject(id) {
  return request(`/api/projects/${id}/`, {
    method: 'DELETE',
  });
}

export function updateProject({ id, data }) {
  return request(`/api/projects/${id}/`, {
    method: 'PATCH',
    data,
  });
}
