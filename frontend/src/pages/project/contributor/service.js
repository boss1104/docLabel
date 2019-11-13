import request from '@/utils/request';

export async function fetch(values) {
  return request('/api/', {
    method: 'POST',
    data: values,
  });
}
