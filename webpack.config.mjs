import path from 'path';
import {fileURLToPath} from 'url';
import TerserPlugin from 'terser-webpack-plugin';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default env => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    // eslint-disable-next-line no-undef
    reactNativePath = new URL('./node_modules/react-native', import.meta.url)
      .pathname,
  } = env;

  console.log('**** env: ' + JSON.stringify(env));

  // /Users/kernel/Documents/Elearning/packages/host
  console.log('**** Current directory:', process.cwd());

  const dirname = Repack.getDirname(import.meta.url);

  console.log(
    '**** Current directory auth-js:',
    path.join(
      dirname,
      '../../node_modules/@supabase/auth-js/dist/module/index.js',
    ),
  );

  if (!platform) {
    throw new Error('Missing platform');
  }

  process.env.BABEL_ENV = mode;

  return {
    mode,
    devtool: false,
    context,
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr,
      }),
      entry,
    ],
    resolve: {
      ...Repack.getResolveOptions(platform),
      conditionNames: [],
      exportsFields: [],
      alias: {
        'react-native': reactNativePath,
        '@supabase/supabase-js': path.join(
          dirname,
          'node_modules/@supabase/supabase-js/dist/module/index.js',
        ),
        '@supabase/auth-js': path.join(
          dirname,
          'node_modules/@supabase/auth-js/dist/module/index.js',
        ),
        '@supabase/functions-js': path.join(
          dirname,
          'node_modules/@supabase/functions-js/dist/module/index.js',
        ),
        '@supabase/postgrest-js': path.join(
          dirname,
          'node_modules/@supabase/postgrest-js/dist/cjs/index.js',
        ),
        '@supabase/realtime-js': path.join(
          dirname,
          'node_modules/@supabase/realtime-js/dist/module/index.js',
        ),
        '@supabase/storage-js': path.join(
          dirname,
          'node_modules/@supabase/storage-js/dist/module/index.js',
        ),
        '@supabase/node-fetch': path.resolve(__dirname, 'empty-module.js'),
        // '@powersync/common': path.join(
        //   dirname,
        //   'node_modules/@powersync/common/lib/index.js',
        // ),
        // '@powersync/react-native': path.join(
        //     dirname,
        //     '../../node_modules/@powersync/react-native/lib/index.js',
        // ),
        ws: path.resolve(__dirname, 'empty-module.js'),
      },
    },
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({platform, devServer}),
      uniqueName: 'sas-host',
    },
    optimization: {
      minimize,
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      chunkIds: 'named',
    },
    module: {
      // noParse: /node_modules\/@powersync\/common\/dist\/bundle\.mjs/,
      rules: [
        // {
        //     test: /\.m?js$/,
        //     exclude: /node_modules\/(?!@powersync\/common)/,
        //     use: {
        //         loader: 'babel-loader',
        //         options: {
        //             presets: ['@babel/preset-env'],
        //         },
        //     },
        // },
        // {
        //     test: /\.(js|jsx|ts|tsx)$/,
        //     exclude: /node_modules\/(?!@powersync\/react-native)/,
        //     use: {
        //         loader: 'babel-loader',
        //         options: {
        //             presets: ['@babel/preset-env', '@babel/preset-react'],
        //             plugins: [
        //                 '@babel/plugin-transform-runtime',
        //                 [
        //                     'babel-plugin-transform-inline-environment-variables',
        //                     {
        //                         include: ['NODE_ENV'],
        //                     },
        //                 ],
        //                 [
        //                     '@babel/plugin-transform-modules-commonjs',
        //                     {
        //                         strictMode: false,
        //                     },
        //                 ],
        //             ],
        //         },
        //     },
        // },
        {
          test: /\.[cm]?[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+react/,
            /node_modules(.*[/\\])+react-native/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+react-native-reanimated/,
            /node_modules(.*[/\\])+@expo/,
            /node_modules(.*[/\\])+pretty-format/,
            /node_modules(.*[/\\])+metro/,
            /node_modules(.*[/\\])+abort-controller/,
            /node_modules(.*[/\\])+webpack/,
            /node_modules(.*[/\\])+@callstack\/repack\/client/,
            /node_modules(.*[/\\])+@callstack\/repack/,
            /node_modules(.*[/\\])+@gorhom/,
            /node_modules(.*[/\\])+lottie-react-native/,
            /node_modules(.*[/\\])+realm/,
            /node_modules(.*[/\\])+@th3rdwave\/react-navigation-bottom-sheet/,
            /node_modules(.*[/\\])+react-native-gesture-handler/,
            /node_modules(.*[/\\])+react-native-safe-area-context/,
            /node_modules(.*[/\\])+react-native-screens/,
            /node_modules(.*[/\\])+react-native-svg/,
            /node_modules(.*[/\\])+react-native-vector-icons/,
            /node_modules(.*[/\\])+react-native-webview/,
            /node_modules(.*[/\\])+@react-native-firebase/,
            /node_modules(.*[/\\])+@react-native-google-signin/,
            /node_modules(.*[/\\])+@react-native-async-storage/,
            /node_modules(.*[/\\])+@sentry/,
            /node_modules(.*[/\\])+axios/,
            /node_modules(.*[/\\])+immer/,
            /node_modules(.*[/\\])+redux/,
            /node_modules(.*[/\\])+redux-thunk/,
            /node_modules(.*[/\\])+react-redux/,
            /node_modules(.*[/\\])+reselect/,
            /node_modules(.*[/\\])+@reduxjs\/toolkit/,
            /node_modules(.*[/\\])+@reduxjs(.*[/\\])+toolkit/,
            /node_modules(.*[/\\])+@supabase\/supabase-js/,
            /node_modules(.*[/\\])+@supabase\/auth-js/,
            /node_modules(.*[/\\])+@supabase\/functions-js/,
            /node_modules(.*[/\\])+@supabase\/node-fetch/,
            /node_modules(.*[/\\])+@supabase\/postgrest-js/,
            /node_modules(.*[/\\])+@supabase\/realtime-js/,
            /node_modules(.*[/\\])+@supabase\/storage-js/,
            /node_modules(.*[/\\])+whatwg-url/,
            /node_modules(.*[/\\])+whatwg-url-without-unicode/,
            /node_modules(.*[/\\])+react-native-url-polyfill/,
            /node_modules(.*[/\\])+@azure\/core-asynciterator-polyfill/,
            // /node_modules(.*[/\\])+@powersync\/common/,
            // /node_modules(.*[/\\])+@powersync\/react-native/,
            /node_modules(.*[/\\])+@journeyapps\/react-native-quick-sqlite/,
            /node_modules(.*[/\\])+js-logger/,
            /node_modules(.*[/\\])+ws/,
            /node_modules(.*[/\\])+phoenix/,
            /node_modules(.*[/\\])+buffer/,
            /node_modules(.*[/\\])+punycode/,
            /node_modules(.*[/\\])+webidl-conversions/,
            /node_modules(.*[/\\])+base64-js/,
            /node_modules(.*[/\\])+ieee754/,
          ],
          use: 'babel-loader',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins:
                devServer && devServer.hmr
                  ? ['module:react-refresh/babel']
                  : undefined,
            },
          },
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                native: true,
                dimensions: false,
              },
            },
          ],
        },
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter(ext => ext !== 'svg'),
          ),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      new Repack.plugins.ModuleFederationPlugin({
        name: 'host',
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '18.3.1',
          },
          'react-native': {
            singleton: true,
            eager: true,
            requiredVersion: '0.75.3',
          },
        },
      }),
    ],
  };
};
