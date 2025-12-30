const { defineConfig } = require("@vue/cli-service");
import vue from '@vitejs/plugin-vue'

module.exports = defineConfig({
  transpileDependencies: true,
  plugins: [vue()],
  publicPath: '/nertz-scorecard/',
});
