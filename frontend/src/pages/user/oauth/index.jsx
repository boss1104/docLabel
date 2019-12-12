import { Button, Icon } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { loginProviders } from '@/pages/constants';

function OAuth(props) {
  const {
    dispatch,
    match: {
      params: { key },
    },
    location: {
      query: { code },
    },
    loading,
  } = props;

  const requestOAuth = async () => {
    try {
      await dispatch({
        type: `oauth/${key}OAuth`,
        payload: {
          code,
        },
      });
      window.close();
    } catch (err) {
      console.log('[DEBUG]: requestOAuth -> err', err);
    }
  };

  return (
    <div style={{ padding: '48px' }}>
      {key && (
        <Button block size="large" type="primary" onClick={requestOAuth} loading={loading}>
          Login with {loginProviders[key].title}{' '}
          <Icon type={loginProviders[key].type} theme={loginProviders[key].theme} />
        </Button>
      )}
    </div>
  );
}
export default connect(({ loading }) => ({
  loading: loading.models.oauth,
}))(OAuth);
