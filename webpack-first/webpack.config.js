// webpack.config.js
const path = require('path')
console.log('当前路径', path.resolve(__dirname, 'dist'))

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
console.log('当前环境', isDev)
const config = require('./public/config')[isDev ? 'dev' : 'build']

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // 必须是绝对路径
    filename: 'bundle.[hash:6].js',
    publicPath: '/' // 通常是CDN地址
  },
  devServer: {
    port: '8000', //默认是8080
    quiet: false, // 出去控制台日志输出 默认不启用
    inline: true, // 默认开启 inlie 模式，如果设置为false，开启 iframe模式
    stats: "errors-only", // 终端仅打印 error
    overlay: false, // 默认不启用
    clientLogLevel: 'silent', // 日志等级
    compress: true // 是否弃用gzip压缩
  },
  devtool: isDev ? 'cheap-module-eval-source-map' : 'none', // 开发模式下将编译后代码映射回源代码
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // use: ['babel-loader'],
        use: [
          {
            loader: 'babel-loader',
            // options: {
            //   presets: ['@babel/preset-env'],
            //   plugins: [
            //     [
            //       "@babel/plugin-transform-runtime",
            //       {
            //         "corejs": 3
            //       }
            //     ]
            //   ]
            // }
          }
        ],
        exclude: /node_modules/ // 排查node_modules目录
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')({
                    "overrideBrowserslist": [
                      ">0.25%",
                      "not dead"
                    ]
                  })
                ]
              }
            },
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
              limit: 1024, // 1k
              esModule: false,
              name: '[name]_[hash:6].[ext]',
              outputPath: 'assets'
            }
          }
        ],
        exclude: /node_modules/
      },
      // {
      //   test: /\.html$/,
      //   use: 'html-withimg-loader',
      //   exclude: /node_modules/
      // }
    ]
  },
  plugins: [
    // 数组 放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', // 打包后的文件名
      minify: {
        removeAttributeQuotes: false, // 是否删除属性的双引号
        collapseWhitespace: false // 是否折叠空白
      },
      config: config.template
    }),
    // 不需要传参数，它可以找到 outputPath
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*', '!dll', '!dll/**'
      ] // 不删除dll目录下的文件
    })
  ]
}