import request from '@/utils/request';
import umiRequest from 'umi-request';
import { REDIRECT_URI, ProviderTypes } from '@/pages/constants';

export interface RegisterValues {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  re_password: string;
}

export interface ActivationValues {
  uid: string;
  token: string;
}
export interface ResendActivationValues {
  email: string;
}

export interface LoginValues {
  username: string;
  password: string;
}

export type ResetPasswordValues = ResendActivationValues;

export interface ResetPasswordConfirmValues {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

export interface LoginOAuthValues {
  code: string;
  state: string;
  provider: ProviderTypes;
}

export async function register(params: RegisterValues) {
  return request('/api/auth/users/', {
    method: 'POST',
    data: params,
  });
}

export async function activation(params: ActivationValues) {
  return request('/api/auth/users/activation/', {
    method: 'POST',
    data: params,
  });
}

export async function resendActivation(params: ResendActivationValues) {
  return request('/api/auth/users/resend_activation/', {
    method: 'POST',
    data: params,
  });
}

export async function login(params: LoginValues) {
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

export async function resetPassword(params: ResetPasswordValues) {
  return request('/api/auth/users/reset_password/', {
    method: 'POST',
    data: params,
  });
}

export async function resetPasswordConfirm(params: ResetPasswordConfirmValues) {
  return request('/api/auth/users/reset_password_confirm/ ', {
    method: 'POST',
    data: params,
  });
}

export async function getOAuth(provider: ProviderTypes) {
  return request(`/api/auth/o/${provider}/`, {
    method: 'GET',
    params: {
      redirect_uri: REDIRECT_URI + provider,
    },
  });
}

export async function loginOAuth({ provider, code, state }: LoginOAuthValues) {
  return umiRequest.post(`/api/auth/o/${provider}/`, {
    credentials: 'include',
    requestType: 'form',
    data: {
      code,
      state,
    },
  });
}
