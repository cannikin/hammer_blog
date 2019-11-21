/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
const { getHammerConfig } = require('@hammerframework/hammer-core')

const hammerConfig = getHammerConfig()

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.js'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
      gql: ['@hammerframework/web', 'gql'],
    }),
    new webpack.DefinePlugin({
      '__HAMMER__.apiProxyPath': JSON.stringify(hammerConfig.web.apiProxyPath),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
  output: {
    publicPath: '/',
    pathinfo: true,
    filename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin({
        honorIndex: true,
        exclude: /node_modules/,
      }),
    ],
    alias: {
      // https://www.styled-components.com/docs/faqs#duplicated-module-in-node_modules
      'styled-components': path.resolve(
        hammerConfig.baseDir,
        'node_modules',
        'styled-components'
      ),
      react: path.resolve(hammerConfig.baseDir, 'node_modules', 'react'),
    },
  },
}
