import request from '@/utils/request';

export function fetch(values) {
  return request('/api/', {
    method: 'POST',
    data: values,
  });
}
