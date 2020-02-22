import request from '@/utils/request';

export interface RegisterParamsType {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  re_password: string;
}

export interface ActivationParamsType {
  uid: string;
  token: string;
}

export interface LoginParamsType {
  username: string;
  password: string;
}

export async function register(params: RegisterParamsType) {
  return request('/api/auth/users/', {
    method: 'POST',
    data: params,
  });
}
export async function activation(params: ActivationParamsType) {
  return request('/api/auth/users/activation/', {
    method: 'POST',
    data: params,
  });
}

export async function login(params: LoginParamsType) {
  return request('/api/auth/token/login/', {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request('/api/auth/token/logout/', {
    method: 'POST',
  });
}

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
