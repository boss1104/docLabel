import request from '@/utils/request';

const AcceptTypes = {
  json: 'application/json',
  csv: 'text/csv; charset=utf-8',
};

export async function download({ projectId, format, userId }) {
  const userParam = userId ? { user: userId } : {};
  return request(`/api/projects/${projectId}/docs/download/`, {
    method: 'GET',
    params: {
      q: format,
      ...userParam,
    },
    responseType: 'blob',
    headers: {
      Accept: AcceptTypes[format],
    },
  });
}
