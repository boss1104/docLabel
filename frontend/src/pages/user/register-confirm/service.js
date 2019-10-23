import request from '@/utils/request';

export async function confirmRegister(params) {
  return request('/api/registration/verify-email/', {
    method: 'POST',
    data: params,
  });
}
