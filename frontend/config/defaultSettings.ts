import { Settings } from '@ant-design/pro-layout';

export interface DefaultSettings extends Settings {}

export default {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'topmenu',
  contentWidth: 'Fluid',
  fixedHeader: true,
  autoHideHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'Doclabel',
  pwa: false,
  iconfontUrl: '',
  basePath: '/app/',
} as DefaultSettings;
