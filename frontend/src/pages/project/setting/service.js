import request from '@/utils/request';

export async function deleteProject(id) {
  return request(`/api/projects/${id}/`, {
    method: 'DELETE',
  });
}

export async function updateProject({ id, data }) {
  return request(`/api/projects/${id}/`, {
    method: 'PATCH',
    data,
  });
}
