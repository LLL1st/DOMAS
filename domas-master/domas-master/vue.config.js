const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@/', resolve('src'))
    // config.plugins.delete('prefetch')
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
        },
        javascriptEnabled: true,
      }
    }
  },

    // 入口设置
    pages: {
      index: {
        entry: 'src/main.js',
        template: 'public/index.html',
        title: 'index.html',
        filename: 'index.html'
      }
    },
  devServer: {
    index: '/index.html', // 运行时，默认打开index页面
    port: 8086,
    proxy: {
      '/api': {
        // target: process.env.VUE_APP_SERVER_URL,
        target: 'http://192.168.14.63:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/userfiles': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/userfiles': '/userfiles'
        }
      }
    }
  },

  lintOnSave: undefined
}
