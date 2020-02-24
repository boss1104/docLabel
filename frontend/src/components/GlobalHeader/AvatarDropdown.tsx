import { ConnectState } from '@/models/connect';
import { getPageQuery } from '@/utils/utils';
import { LogoutOutlined, SettingOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar, Menu, message } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { stringify } from 'querystring';
import React from 'react';
import { router } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import { ClickParam } from 'antd/es/menu';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

interface AvatarDropdown {
  menu: boolean;
}

const AvatarDropdown: React.FC<AvatarDropdown> = ({ menu }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: ConnectState) => state.user.currentUser);
  const loading = useSelector((state: ConnectState) => state.loading.effects['auth/logout']);

  const onMenuClick = async ({ key }: ClickParam) => {
    if (key === 'logout') {
      if (dispatch) {
        await dispatch({
          type: 'auth/logout',
        });

        const { redirect } = getPageQuery(); // redirect
        if (window.location.pathname !== '/user/login' && !redirect) {
          router.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
        message.success(
          formatMessage({
            id: 'user-login.login.logout-message',
          }),
        );
      }

      return;
    }

    router.push(`/account/${key}`);
  };

  const getAvatarURL = () => {
    if (currentUser?.avatar) {
      return currentUser.avatar;
    }

    return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        {loading && <LoadingOutlined />}
      </Menu.Item>
    </Menu>
  );

  return currentUser?.id ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={getAvatarURL()} alt="avatar" />
        <span className={styles.name}>{currentUser.username}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <span className={`${styles.action}`} onClick={() => router.push('/user/login')}>
      Login
    </span>
  );
};

export default AvatarDropdown;
