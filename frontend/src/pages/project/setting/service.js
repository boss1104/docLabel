import request from '@/utils/request';

export function deleteProject(id) {
  return request(`/api/projects/${id}/`, {
    method: 'DELETE',
  });
}
