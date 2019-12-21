import request from '@/utils/request';

export async function forgotPassword({ email }) {
  return request('/api/password/reset/', {
    method: 'POST',
    data: {
      email,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/camelcase
export async function confirmPassword({ uid, token, new_password1, new_password2 }) {
  return request('/api/password/reset/confirm/ ', {
    method: 'POST',
    data: {
      uid,
      token,
      new_password1,
      new_password2,
    },
  });
}
