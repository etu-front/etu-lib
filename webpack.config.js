const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    'styled-components': 'styled-components',
    react: 'react',
    'react-dom': 'react-dom',
    classnames: 'classnames',
    antd: 'antd',
    'prop-types': 'prop-types',
    'react-lazyload': 'react-lazyload',
    'react-dnd': 'react-dnd',
    'react-dnd-html5-backend': 'react-dnd-html5-backend',
    'lodash': 'lodash'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(jpeg|jpg|png|gif|svg)$/i,
        loader: 'file-loader?name=./icons/[name].[ext]'
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(['lib'])]
}
