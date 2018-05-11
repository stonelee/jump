const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const tilesetDir = 'res/images/tilesets';

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.tileset/i,
          use: {
            loader: 'tinyjs-resource-loader',
            options: {
              process: isDev,
              loader: 'none',
              output: tilesetDir,
              image: {
                name: '[name].[ext]',
              },
              json: {
                name: '[name].[ext]',
              },
            },
          },
        }, {
          test: /\.(less|css)$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
          ],
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [ 'babel-preset-es2015', 'babel-preset-stage-0' ],
              plugins: [ 'babel-plugin-transform-runtime' ],
            },
          },
        },
      ],
    },
    resolve: {
      alias: {
        'res': path.resolve('./res'),
      },
    },
    plugins: [
      new OptimizeCSSAssetsPlugin({}),
      new MiniCssExtractPlugin({
        filename: 'index.css',
      }),
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
      new CopyWebpackPlugin([ {
        from: 'res/images',
        to: 'res/images',
      }, {
        from: 'res/sounds',
        to: 'res/sounds',
      } ]),
    ],
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
