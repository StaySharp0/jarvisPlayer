// webpack.config.js
const webpack = require('webpack');
const commonsPlugin   = new webpack.optimize.CommonsChunkPlugin('vendor');
const providePlugin   = new webpack.ProvidePlugin({ 'window.$': 'jquery', 'window.jQuery': 'jquery' });

module.exports = {
  entry: {
  	vendor: ['jquery','materialize-css', './src/embedplayer.js', './src/html5.js'],
  	main: './src/main.js'
  },
  output: {
    path: './public',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.handlebars$/, loader: "handlebars-loader" }
    ]
  },
  plugins: [commonsPlugin,providePlugin],
  devtool: '#inline-source-map'
};