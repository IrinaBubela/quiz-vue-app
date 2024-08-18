const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/quiz-vue-app/'
    : '/',
  transpileDependencies: true,
  runtimeCompiler: true,
});
