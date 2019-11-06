import request from '@/utils/request';

export async function queryTask({ projectId, params }) {
  return request(`/api/projects/${projectId}/docs/`, {
    params,
  });
}

// export async function addTask({ projectId, params }) {
//   return request(`/api/projects/${projectId}/docs/`, {
//     method: 'POST',
//     data: params,
//   });
// }

export async function removeTask({ projectId, params }) {
  return request(`/api/projects/${projectId}/docs/`, {
    method: 'DELETE',
    data: params,
  });
}

export async function updateTask({ projectId, params }) {
  return request(`/api/projects/${projectId}/docs/`, {
    method: 'PATCH',
    data: params,
  });
}
