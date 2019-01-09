"use strict";

const _ = require("underscore");
const os = require("os");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpackPlugins = require("./webpack.plugins.js");

const cssLoader = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: "../"
        }
    },
    {
        loader: "css-loader"
    }
];

const stylusLoader = ["css-hot-loader", ...cssLoader, "stylus-relative-loader"];

const happyPackLoader = {
    loader: "happypack/loader",
    options: {
        id: "babel"
    }
};

function localRealPath(...parts) {
    return fs.realpathSync(path.resolve(__dirname, ...parts));
}

const webpackBaseConfig = {

    mode: "development",

    entry: {
        app: _.union(
            glob.sync("./client/baseWebpack/app/**/*.js", { nosort: true })
        )
    },

    output: {
        path: path.resolve(__dirname, "client/baseWebpack/dist/"),
        filename: "[name].js"
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: require("os").cpus().length,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            maxInitialRequests: 5,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "initial"
                }
            }
        }
    },

    module: {
        rules: [{
            test: /\.styl$/,
            use: stylusLoader
        }, {
            test: /\.css$/,
            use: cssLoader
        }, {
            test: /\.m?js$/,
            include: (() => {
                const paths = [
                    "client"].map((p) => localRealPath(p));

                return (filePath) => paths.some((p) => filePath.startsWith(p));
            })(),
            use: happyPackLoader
        }, {
            test: /\.jade$/,
            use: "jade-loader"
        }, {
            test: /\.(html)$/,
            use: "html-loader"
        }, {
            test: /\.(woff2?|svg)$/,
            loader: "url-loader?limit=10000&name=fonts/[name].[ext]"
        }, {
            test: /\.(jpe?g|png|gif)$/i,
            use: [
                "file-loader?name=images/[name].[ext]",
                "image-webpack-loader?bypassOnDebug"
            ]
        }, {
            test: /\.(ttf|eot)$/,
            use: "file-loader?name=fonts/[name].[ext]"
        }, {
            test: /\.pdf$/i,
            use: "file-loader?name=pdf/[name].[ext]"
        }, {
            test: /\.json$/,
            loader: "json-loader",
            type: "javascript/auto"
        }, {
            test: /\.mjs$/,
            use: [],
            type: "javascript/auto"
        }]
    },

    devServer: {
        watchOptions: {
            aggregateTimeout: 300
        },
        compress: false,
        overlay: true,
        open: false,
        hot: true,
        inline: true,
        historyApiFallback: true,
        proxy: ((() => {
            const port = "3333";
            const proxy = { target: `http://${os.hostname()}:${port}`, secure: false };

            return {
                "/logs": proxy,
                "/api/**": proxy,
                "/search/**": proxy,
                "/services/**": proxy,
                "/status/**": proxy,
                "/document/**": proxy

            };
        })())
    },

    devtool: "cheap-module-eval-source-map",

    resolve: {
        unsafeCache: true,
        modules: [
            "node_modules"
        ],
        alias: {
            "@geolib": localRealPath("node_modules/@geolib"),

            // optimization: localize shared dependencies
            angular: localRealPath("node_modules/angular"),
            underscore: localRealPath("node_modules/underscore"),
        }
    },

    plugins: webpackPlugins.development
};

module.exports = webpackBaseConfig;



