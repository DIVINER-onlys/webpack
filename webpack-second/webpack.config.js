const HtmlWebpackPlugin = require('html-webpack-plugin') // 当使用webpack打包时，创建一个 html 文件，并把webpack打包后的静态文件自动插入到这个html文件中
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')


const isDev = process.env.NODE_ENV = 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']

console.log('当前环境', process.env.NODE_ENV)

module.exports = {
  mode: isDev ? 'development' : 'production',
  devServer: {
    hot: true
  },
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:6].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader, // 替换原本的 style-loader
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')(
                  //   {
                  //   "overrideBrowserslist": [
                  //     "defaults"
                  //   ]
                  // }
                  )
                ]
              }
            }
          },
          'less-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10, // 1k
              esModule: false,
              name: '[name]_[hash:6].[ext]',
              outputPath: 'assets'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', // 打包后的文件名
      config: config.template,
      chunks: ['indexs']
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', // 打包后的文件名
      chunks: ['login']
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public/js/*.js'),
        to: path.resolve(__dirname, 'dist', 'js'),
        flatten: true // 只拷贝文件，不拷贝文件夹路径
      },
      // 还可以继续配置其他要拷贝的文件
    ], {
      ignore: ['other.js']
    }),
    // 不需要传参数，它可以找到 outputPath
    new CleanWebpackPlugin(),
    // 定义全局变量
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    // css抽离
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      // publicPath: '../'
    }),
    // css压缩
    new OptimizeCssPlugin(),
    // 热更新插件
    new webpack.HotModuleReplacementPlugin()
  ]
}