const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: `${__dirname}/public/`,
    filename: 'js/bundle.js',
    clean: true,
  },
  devServer: {
    port: 8080,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({ filename: 'assets/css/style.css' }),
  ],
  module: {
    rules: [
      {
        test: /\.(otf)$/,
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
      {
        test: /\.(svg)$/,
        generator: {
          filename: 'assets/icon/[name][ext]',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
    ],
  },
}
