import { ConnectState } from '@/models/connect';
import { LOGIN_PROVIDERS } from '@/pages/constants';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import React from 'react';

const OAuthLogin: React.FC<{ location: { query: {} }; match: { params } }> = ({
  location: { query },
  match: { params },
}) => {
  const dispatch = useDispatch();

  const loading = useSelector((cState: ConnectState) => cState.loading.effects['auth/loginOAuth']);

  const requestOAuth = async () => {
    try {
      await dispatch({
        type: 'auth/loginOAuth',
        payload: {
          ...query,
          ...params,
        },
      });
      window.close();
    } catch (err) {
      console.log('[DEBUG]: requestOAuth -> err', err);
    }
  };
  if (params.provider) {
    const { title, IconProvider } = LOGIN_PROVIDERS.find(p => p.provider === params.provider)!;

    return (
      <div style={{ padding: '48px' }}>
        <Button block size="large" type="primary" onClick={requestOAuth} loading={loading}>
          Login with {title} <IconProvider />
        </Button>
      </div>
    );
  }
  return null;
};
export default OAuthLogin;
