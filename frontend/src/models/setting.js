import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../config/defaultSettings';

const updateColorWeak = colorWeak => {
  const root = document.getElementById('root');

  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel = {
  namespace: 'settings',
  state: defaultSettings,
  reducers: {
    getSetting(state = defaultSettings) {
      const setting = {};
      const urlParams = new URL(window.location.href);
      Object.keys(state).forEach(key => {
        if (urlParams.searchParams.has(key)) {
          const value = urlParams.searchParams.get(key);
          setting[key] = value;
        }
      });
      const { colorWeak } = setting;
      updateColorWeak(!!colorWeak);
      return { ...state, ...setting };
    },

    changeSetting(state = defaultSettings, { payload }) {
      const { colorWeak, contentWidth } = payload;

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }

      updateColorWeak(!!colorWeak);
      return { ...state, ...payload };
    },

    changeTheme(state = defaultSettings, { payload }) {
      let newTheme;
      if (payload && Object.keys(payload)) {
        newTheme = payload;
      } else {
        const themeCache = localStorage.getItem('site-theme');
        newTheme = themeCache || state.navTheme;
      }
      const dark = newTheme === 'dark';
      if (typeof window === 'undefined') {
        return { ...state };
      }
      // message.loading(
      //   formatMessage({
      //     id: 'app.setting.loading',
      //     defaultMessage: 'Loading theme.',
      //   }),
      //   0.5,
      // );
      const href = dark ? '/theme/dark' : '/theme/';

      const dom = document.getElementById('theme-style');

      if (!href) {
        if (dom) {
          dom.remove();
          localStorage.removeItem('site-theme');
        }
        return { ...state };
      }

      const url = `${href}.css`;
      if (dom) {
        dom.onload = () => {
          window.setTimeout(() => {});
        };
        dom.href = url;
      } else {
        const style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.id = 'theme-style';
        style.onload = () => {
          window.setTimeout(() => {
            // hide();
          });
        };
        style.href = url;
        document.body.append(style);
      }

      localStorage.setItem('site-theme', dark ? 'dark' : 'light');

      return { ...state, navTheme: dark ? 'dark' : 'light' };
    },
  },
};
export default SettingModel;
