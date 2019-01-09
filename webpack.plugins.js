const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const os = require("os");
const fs = require("fs");

class WebpackPlugins {
    static get plugins() {
        return [
            new HtmlWebpackPlugin({
                title: "index.html",
                minify: {
                    collapseWhitespace: true,
                    hash: true
                },
                template: "views/index.html"
            }),
            new MiniCssExtractPlugin()
        ];
    }

}
module.exports = WebpackPlugins;
