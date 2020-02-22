import { Avatar, Icon, Menu, message } from 'antd';
import { connect } from 'dva';
import { stringify } from 'querystring';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { router } from 'umi';
import { getPageQuery } from '@/utils/utils';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = async event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

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

  getAvatarURL = () => {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.id && currentUser.id ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={this.getAvatarURL()} alt="avatar" />
          <span className={styles.name}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action}`} onClick={() => router.push('/user/login')}>
        Login
      </span>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
