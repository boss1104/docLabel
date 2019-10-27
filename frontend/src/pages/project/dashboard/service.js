import request from '@/utils/request';

export function fetch(values) {
  return request('requestUrl', {
    method: 'POST',
    data: values,
  });
}
