import request from '@/utils/request';

const AcceptTypes = {
  json: 'application/json',
  csv: 'text/csv; charset=utf-8',
};

export async function download({ projectId, type }) {
  return request(`/api/projects/${projectId}/docs/download/`, {
    method: 'GET',
    params: {
      q: type,
    },
    responseType: 'blob',
    headers: {
      Accept: AcceptTypes[type],
    },
  });
}
