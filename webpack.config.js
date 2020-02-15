const path = require('path')
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractCssPlugin = require('mini-css-extract-plugin')

const baseOutputPath = path.resolve('./dist/client')

module.exports = {
  entry: {
    js: path.resolve('./src/client/index.js'),
  },

  output: {
    path: baseOutputPath,
    filename: '[name].[hash].js',
  },

  plugins: [
    new CleanPlugin(),
    new HtmlPlugin({ title: 'Secret Santa', template: path.resolve('./src/client/index.html') }),
    new ExtractCssPlugin({ filename: '[name].[hash].css' }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ExtractCssPlugin.loader, 'css-loader'],
      },
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                ['@babel/plugin-transform-react-jsx', { pragma: 'h', pragmaFrag: 'Fragment' }],
                ['babel-plugin-jsx-pragmatic', { module: 'preact', export: 'h', import: 'h' }],
              ],
            },
          },
        ],
      },
    ],
  },

  devServer: {
    contentBase: baseOutputPath,
    port: process.env.UI_PORT || 3001,
  },
}
