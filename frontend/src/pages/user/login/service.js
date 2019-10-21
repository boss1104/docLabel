import request from '@/utils/request';

export async function confirmRegister(search) {
  return request(`/api/register/confirmation${search}`, {
    method: 'GET',
  });
}

export async function accountLogin(params) {
  return request('/api/auth', {
    method: 'POST',
    data: params,
  });
}
