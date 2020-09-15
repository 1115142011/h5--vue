
module.exports = {
  // filenameHashing: false,
  // 将px 单位转换为rem单位1rem=36px,
  css: {
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-plugin-px2rem')({
            rootValue: 36, // 换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            // propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: ['border'], // 黑名单
            // exclude: false,
            // exclude: /(node_modules)/, // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: ['.skipRem'], // 要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
            minPixelValue: 3 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
          })
        ]
      }
    }
  },

  // 打包相关配置
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, {
        limit: 10240
      }));
    config.output.filename('[name].[hash].bundle.js');
  },
  // 警告 webpack 的性能提示
  configureWebpack: {
    performance: {
      hints: 'warning',
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js');
      }
    }
  },
  productionSourceMap: true,
  // 基本路径
  publicPath: './',
  // publicPath: './',
  // 输出文件目录
  // outputDir: 'dist',
  outputDir: 'sale',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  devServer: {
    port: 9000, // 端口号
    // port: 8080, // 端口号
    // host: 'localhost',
    https: false, // https:{type:Boolean}y
    open: true, // 配置自动启动浏览器
    proxy: {
      // '/pompapi/v1': {
      '/api': {
        target: 'https:xxxxxxxxxx',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
