import request from '@/utils/request';

export async function fetchStatistics({ projectId, params }) {
  return request(`/api/projects/${projectId}/statistics/`, {
    method: 'GET',
    params,
  });
}
