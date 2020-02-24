/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * request Network request tool
 * More specifically api document: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { router } from 'umi';
import { getAuthorization, setAuthorization } from '@/utils/authority';

/**
 * Exception handler
 */
const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const { status } = response;
    // if (status === 401) {
    //   setAuthorization();
    //   // eslint-disable-next-line no-underscore-dangle
    //   window.g_app._store.dispatch({
    //     type: 'auth/logout',
    //   });
    // }

    if (status === 403) {
      router.push('/exception/403');
    }
    if (status <= 504 && status >= 500) {
      router.push('/exception/500');
    }
    if (status >= 404 && status < 422) {
      router.push('/exception/404');
    }
  } else if (!response) {
    message.error('Your network is abnormal and cannot connect to the server');
  }
  throw error;
};
/**
 * Default parameters when configuring request
 */

const request = extend({
  errorHandler,
  // Default error handling
  credentials: 'include', // Whether the default request is taken cookie
  headers: {
    Authorization: `Token ${getAuthorization()}`,
  },
});

request.interceptors.request.use((url, options) => {
  const token = getAuthorization();
  const { headers } = options;
  let newHeader;
  if (token === 'undefined' || token === null) {
    delete headers.Authorization;
  } else {
    newHeader = {
      ...headers,
      Authorization: `Token ${token}`,
    };
  }

  return {
    options: {
      ...options,
      headers: { ...newHeader },
    },
  };
});

// const reloadAuthorizationInterceptors = () => {
//   request.interceptors.request.use((url, options) => ({
//     options: {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${getAuthorization()}`,
//       },
//     },
//   }));
// };

// export { reloadAuthorizationInterceptors };

export default request;
