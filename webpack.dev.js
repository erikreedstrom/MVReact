const path = require('path');

const webpack = require('webpack');

const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    hot: true,
  },
  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
    usedExports: true,
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, './.env.development'), // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
