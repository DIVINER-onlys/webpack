// public/config.js 除了一下的配置以外，这里面还可以有许多其他配置，例如，publicPath路径等等
module.exports = {
  dev: {
    template: {
      title: '你好',
      header: false,
      footer: false
    }
  },
  build: {
    template: {
      title: '你好才怪',
      header: true,
      footer: false
    }
  }
}