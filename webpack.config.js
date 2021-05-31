const path = require('path');

const rootDir = __dirname;
const mainSrcDir = path.join(rootDir, 'main/src');
const preloadSrcDir = path.join(rootDir, 'preload/src');
const rendererSrcDir = path.join(rootDir, 'renderer/src');
const rendererPublicDir = path.join(rootDir, 'renderer/public');
const outDir = path.join(rootDir, 'out');

const semver = require('semver');
const electronReleases = require('electron-releases/lite.json');
const package = require('./package.json');

const currentElectron = electronReleases.find(release => semver.satisfies(release.version, package.devDependencies.electron));
const currentNode = currentElectron.deps.node.split('.').slice(0, 2).join('.');
const currentChrome = currentElectron.deps.chrome.split('.').slice(0, 2).join('.');

const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  {
    name: 'main',
    entry: mainSrcDir,
    output: {
      filename: 'main.js',
      path: outDir,
    },
    target: 'electron-main',
    resolve: {
      extensions: ['.ts', '...'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: mainSrcDir,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ["@babel/preset-env", {
                  targets: {
                    node: currentNode,
                  },
                }],
                ["@babel/preset-typescript", {
                  onlyRemoveTypeImports: true,
                }],
              ],
            },
          },
        },
      ],
    },
  },
  {
    name: 'preload',
    entry: preloadSrcDir,
    output: {
      filename: 'preload.js',
      path: outDir,
    },
    target: 'electron-preload',
    resolve: {
      extensions: ['.ts', '...'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: preloadSrcDir,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ["@babel/preset-env", {
                  targets: {
                    chrome: currentChrome,
                  },
                }],
                ["@babel/preset-typescript", {
                  onlyRemoveTypeImports: true,
                }],
              ],
            },
          },
        },
      ],
    },
  },
  {
    name: 'renderer',
    entry: rendererSrcDir,
    output: {
      filename: 'renderer.js',
      path: outDir,
    },
    target: 'web',
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: rendererSrcDir,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ["@babel/preset-env", {
                  targets: {
                    chrome: currentChrome,
                  },
                }],
                ["@babel/preset-react", {
                  runtime: 'automatic',
                }],
                ["@babel/preset-typescript", {
                  onlyRemoveTypeImports: true,
                }],
              ],
            },
          },
        },
        {
          test: /\.scss$/,
          include: rendererSrcDir,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: rendererPublicDir },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
    ],
    optimization: {
      minimizer: [
        new HtmlMinimizerPlugin(),
        new CssMinimizerPlugin(),
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  },
];
