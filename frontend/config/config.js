import slash from 'slash2';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import themePluginConfig from './themePluginConfig'; // import darkTheme from '@ant-design/dark-theme';

import webpackPlugin from './plugin.config';
import routes from './routes';

const { pwa, primaryColor, basePath } = defaultSettings;
// preview.pro.ant.design only do not use in your production ;

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, TEST } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        default: 'en-US',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}
const loadTheme = false;

if (!TEST && !isAntDesignProPreview && loadTheme) {
  plugins.push([
    'umi-plugin-antd-theme',
    {
      theme: [
        {
          key: 'dark',
          fileName: 'dark.css',
          theme: 'dark',
        },
        {
          key: 'dust',
          fileName: 'dust.css',
          modifyVars: {
            '@primary-color': '#F5222D',
          },
        },
        {
          key: 'dust',
          theme: 'dark',
          fileName: 'dark-dust.css',
          modifyVars: {
            '@primary-color': '#F5222D',
          },
        },
        {
          key: 'volcano',
          theme: 'dark',
          fileName: 'dark-volcano.css',
          modifyVars: {
            '@primary-color': '#FA541C',
          },
        },
      ],
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    url: false,
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  // cssModulesExcludes: ['./src/pages/Home/less/antMotionStyle.less'],
  manifest: {
    basePath,
  },
  base: basePath,
  publicPath: '/static/',
  urlLoaderExcludes: [/\.txt$/, /\.jsonl$/, /\.csv$/, /\.xlsx$/, /\.conll$/],
  chainWebpack: webpackPlugin,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
};
