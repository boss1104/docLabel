import request from '@/utils/request';

export async function fetchProjectRoles(projectId) {
  return request(`/api/projects/${projectId}/roles/`, {
    method: 'GET',
  });
}

export async function fetchRoles() {
  return request('/api/roles/', {
    method: 'GET',
  });
}

export async function fetchUsers() {
  return request('/api/users', {
    method: 'GET',
  });
}

export async function fetchProjectNotification({ projectId }) {
  return request(`/api/projects/${projectId}/notifications/`, {
    method: 'GET',
  });
}

export async function addRole({ projectId, data }) {
  return request(`/api/projects/${projectId}/roles/`, {
    method: 'POST',
    data,
  });
}

export async function deleteRole({ projectId, roleId }) {
  return request(`/api/projects/${projectId}/roles/${roleId}`, {
    method: 'DELETE',
  });
}

export async function switchRole({ projectId, roleId, data }) {
  return request(`/api/projects/${projectId}/roles/${roleId}/`, {
    method: 'PATCH',
    data,
  });
}

export async function markAsReadNotification({ projectId, notifyId }) {
  return request(`/api/projects/${projectId}/notifications/${notifyId}/`, {
    method: 'DELETE',
  });
}
