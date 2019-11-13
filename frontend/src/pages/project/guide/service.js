import request from '@/utils/request';

export async function updateGuideline({ projectId, data }) {
  return request(`/api/projects/${projectId}/`, {
    method: 'PATCH',
    data,
  });
}
