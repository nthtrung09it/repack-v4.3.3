const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// https://github.com/infinitered/ignite-cookbook/issues/175
// https://ignitecookbook.com/docs/recipes/LocalFirstDataWithPowerSync/

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    // Inline requires are very useful for deferring loading of large dependencies/components.
    // For example, we use it in app.tsx to conditionally load Reactotron.
    // However, this comes with some gotchas.
    // Read more here: https://reactnative.dev/docs/optimizing-javascript-loading
    // And here: https://github.com/expo/expo/issues/27279#issuecomment-1971610698
    inlineRequires: {
      blockList: {
        [require.resolve('@powersync/react-native')]: true,

        // require() calls anywhere else will be inlined, unless they
        // match any entry nonInlinedRequires.
      },
    },
  },
});

// This helps support certain popular third-party libraries
// such as Firebase that use the extension cjs.
config.resolver.sourceExts.push('cjs');

module.exports = config;
