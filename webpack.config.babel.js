import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    filename: 'index_bandle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node-modules/',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.html',
    }),
  ],
  devtool: process.env.NODE_ENV ? '' : 'source-map',
};
