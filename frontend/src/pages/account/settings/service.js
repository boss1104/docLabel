import request from '@/utils/request';

export async function updateAccount({ data }) {
  return request('/api/user/', {
    method: 'PATCH',
    data,
  });
}

export async function changeAvatar({ data }) {
  return request('/api/user/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  });
}
