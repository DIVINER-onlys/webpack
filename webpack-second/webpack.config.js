const HtmlWebpackPlugin = require('html-webpack-plugin') // 当使用webpack打包时，创建一个 html 文件，并把webpack打包后的静态文件自动插入到这个html文件中
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')


const isDev = process.env.NODE_ENV = 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']

console.log('当前环境', process.env.NODE_ENV)

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', // 打包后的文件名
      config: config.template,
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', // 打包后的文件名
      chunks: ['login']
    }),
    new CopyWebpackPlugin([
      {
        from: 'pulbic/js/*.js',
        to: path.resolve(__dirname, 'dist', 'js'),
        flatten: true
      },
      // 还可以继续配置其他要拷贝的文件
    ])
  ]
}