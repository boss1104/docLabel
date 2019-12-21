import React, { Component, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { connect } from 'dva';
import BaseView from './components/BaseView';
import SecurityView from './components/SecurityView';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import styles from './style.less';

const { Item } = Menu;

const menuMap = {
  base: <FormattedMessage id="accountSettings.menuMap.basic" defaultMessage="Basic Settings" />,
  security: (
    <FormattedMessage id="accountSettings.menuMap.security" defaultMessage="Security Settings" />
  ),
  binding: (
    <FormattedMessage id="accountSettings.menuMap.binding" defaultMessage="Account Binding" />
  ),
  notification: (
    <FormattedMessage
      id="accountSettings.menuMap.notification"
      defaultMessage="New Message Notification"
    />
  ),
};

function Settings({ currentUser }) {
  const [mode, setMode] = useState('inline');
  const [selectKey, setSelectKey] = useState('base');
  const mainRef = useRef(undefined);

  const resize = () => {
    if (!mainRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      if (!mainRef.current) {
        return;
      }

      let newMode = 'inline';
      const { offsetWidth } = mainRef.current;

      if (mainRef.current.offsetWidth < 641 && offsetWidth > 400) {
        newMode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        newMode = 'horizontal';
      }

      setMode(newMode);
    });
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const renderChildren = () => {
    switch (selectKey) {
      case 'base':
        return <BaseView />;

      case 'security':
        return <SecurityView />;

      case 'binding':
        return <BindingView />;

      case 'notification':
        return <NotificationView />;

      default:
        return null;
    }
  };

  if (!currentUser.id) {
    return '';
  }

  return (
    <GridContent>
      <div className={styles.main} ref={mainRef}>
        <div className={styles.leftMenu}>
          <Menu mode={mode} selectedKeys={[selectKey]} onClick={({ key }) => setSelectKey(key)}>
            {Object.keys(menuMap).map(item => (
              <Item key={item}>{menuMap[item]}</Item>
            ))}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{menuMap[selectKey]}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  );
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Settings);
