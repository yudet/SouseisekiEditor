var webpackd = require('./webpack.config.js')
var path = require('path');
var webpack = require('webpack');
var BabiliPlugin = require("babili-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
webpackd.plugins.push(new BabiliPlugin())
module.exports = webpackd;

