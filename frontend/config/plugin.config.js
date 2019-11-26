// Change theme plugin
// eslint-disable-next-line eslint-comments/abdeils - enable - pair;

/* eslint-disable import/no-extraneous-dependencies */
import generate from '@ant-design/colors/lib/generate';
import path from 'path';

function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, '../node_modules/');

  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName; // handle tree shaking

  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }

  return packageName;
}
const getAntdSerials = color => {
  const lightNum = 9;
  const devide10 = 10; // 淡化（即less的tint）

  const lightens = new Array(lightNum)
    .fill(undefined)
    .map((_, i) => ThemeColorReplacer.varyColor.lighten(color, i / devide10));
  const colorPalettes = generate(color);
  const rgb = ThemeColorReplacer.varyColor.toNum3(color.replace('#', '')).join(',');
  return lightens.concat(colorPalettes).concat(rgb);
};

export default config => {
  config.module
    .rule('txt')
    .test(/\.txt$/)
    .use('raw')
    .loader('raw-loader');

  config.module
    .rule('csv')
    .test(/\.csv$/)
    .use('raw')
    .loader('raw-loader');

  config.module
    .rule('jsonl')
    .test(/\.jsonl$/)
    .use('raw')
    .loader('raw-loader');

  config.module
    .rule('xlsx')
    .test(/\.xls.?$/)
    .use('raw')
    .loader('excel-loader');

  config.module
    .rule('conll')
    .test(/\.conll$/)
    .use('raw')
    .loader('raw-loader');

  config.optimization // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: module => {
            const packageName = getModulePackageName(module) || '';

            if (packageName) {
              return [
                'bizcharts',
                'gg-editor',
                'g6',
                '@antv',
                'gg-editor-core',
                'bizcharts-plugin-slider',
              ].includes(packageName);
            }

            return false;
          },

          name(module) {
            const packageName = getModulePackageName(module);

            if (packageName) {
              if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                return 'viz'; // visualization package
              }
            }

            return 'misc';
          },
        },
      },
    });
};
