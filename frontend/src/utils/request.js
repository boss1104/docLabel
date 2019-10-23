/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * request Network request tool
 * More specifically api document: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import router from 'umi/router';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'The data was deleted successfully.',
  400:
    'The request was made with an error and' +
    'the server did not perform any operations to create or modify data.',
  401: 'User does not have permission (token, username, password is incorrect).',
  403: 'The user is authorized, but access is forbidden.',
  404: 'The request is made for a record that does not exist and the server does not operate.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will not be retrieved.',
  422: 'A validation error occurred when creating an object.',
  500: 'An error occurred on the server. Please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable and the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.',
};
/**
 * Exception handler
 */

const errorHandler = error => {
  const { response = {}, data } = error;
  console.log('response', response);
  console.log('data', data);

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    // message.error('Please try again.');
    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });

    if (status === 401) {
      notification.error({
        message: 'Not logged in or the login has expired, please log in again.',
      });
      // @HACK
      /* eslint-disable no-underscore-dangle */
      // localStorage.removeItem("antd-pro-authority");
      // setAuthority("")
      window.g_app._store.dispatch({
        type: 'login/logout',
      });

      window.location.reload();
    }
    // environment should not be used
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
    notification.error({
      message: 'Network anomaly',
      description: 'Your network is abnormal and cannot connect to the server',
    });
  }
  return {
    statusCode: response.status,
    ...data,
  };
};
/**
 * Default parameters when configuring request
 */

const request = extend({
  errorHandler,
  // Default error handling
  credentials: 'include', // Whether the default request is taken cookie
  headers: {
    Authorization: `Bearer ${localStorage.getItem('antd-pro-authority')}`,
  },
});

const reloadAuthorizationInterceptors = () => {
  request.interceptors.request.use((url, options) => ({
    options: {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem('antd-pro-authority')}`,
      },
    },
  }));
};

export { reloadAuthorizationInterceptors };

export default request;
