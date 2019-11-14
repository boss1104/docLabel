import request from '@/utils/request';

export async function register(params) {
  return request('/api/registration/', {
    method: 'POST',
    data: params,
  });
}
export async function confirmRegister(params) {
  return request('/api/registration/verify-email/', {
    method: 'POST',
    data: params,
  });
}
