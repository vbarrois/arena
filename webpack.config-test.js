const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const config = require("./webpack.config.js")
// config.target = "node"
// config.mode= 'development'
// module.exports = config
module.exports = {
  // plugins: [new ExtractTextPlugin({filename: 'test-style.css'})],
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-object-rest-spread']
          }
        }
      },
      // {
      //   test: /\.less$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: ['css-loader', 'less-loader']
      //   })
      // }
    ]
  },
  // plugins: [
  //   new webpack.DefinePlugin({
  //     'process.env.migrations_test_dirname': JSON.stringify(path.resolve(__dirname, 'server/db/migration/survey/migrations'))
  //   })
  // ]
}
