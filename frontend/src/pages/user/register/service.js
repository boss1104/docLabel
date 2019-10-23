import request from '@/utils/request';

export async function register(params) {
  return request('/api/registration/', {
    method: 'POST',
    data: params,
  });
}
