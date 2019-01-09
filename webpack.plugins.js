"use strict";

const _ = require("underscore");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require("happypack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;


function getHtmlWebpackPlugin() {
    return new HtmlWebpackPlugin({
        environment: "development",
        template: "./client/baseWebpack/views/index.html"
    });
}

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: "./css/[name].css",
    chunkFilename: "./css/[name].css"
});

const webpackProvidePlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.$": "jquery",
    "window.jQuery": "jquery",
    _: "underscore",
    he: "he",
    toastr: "toastr",
    bootbox: "bootbox",
    JSZip: "jszip"
});

const happyPackBabelPlugin = new HappyPack({
    id: "babel",
    loaders: [{
        loader: "babel-loader"
    }]
});

class WebpackPlugins {

    static base() {

        return [
            getHtmlWebpackPlugin(),
            miniCssExtractPlugin,
            webpackProvidePlugin,
            happyPackBabelPlugin,
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ];
    }

    static get development() {
        const developmentPlugins = [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.SourceMapDevToolPlugin({ exclude: ["kendo.js", "vendor.js"] })
        ];

        return _.union(WebpackPlugins.base(), developmentPlugins);
    }

    static get production() {
        const productionPlugins = [
            new BundleAnalyzerPlugin({ analyzerMode: "static", reportFilename: path.join(__dirname, "/reports/bundle-analyer.html")})
        ];

        return _.union(WebpackPlugins.base(), productionPlugins);
    }
}

module.exports = WebpackPlugins;
