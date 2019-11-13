import request from '@/utils/request';

export async function fetchStatistics({ projectId }) {
  return request(`/api/projects/${projectId}/statistics/`, {
    method: 'GET',
  });
}
