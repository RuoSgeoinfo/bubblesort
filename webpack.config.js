const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const os = require("os");
const fs = require("fs");
const webpackPlugins = require("./webpack.plugins");
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
function localRealPath(...parts) {
    return fs.realpathSync(path.resolve(__dirname, ...parts));
}
const stylusLoader = ["css-hot-loader", ...cssLoader, "stylus-relative-loader"];
let path = require("path");


module.exports = {
    entry: './app/app.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
    },
    module: {
        rules: [{
            test: /\.styl$/,
            use: stylusLoader
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.jade$/,
            use: "jade-loader"
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
            test: /\.json$/,
            loader: "json-loader",
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
            const port = "3000";
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
    resolve: {
        unsafeCache: true,
        modules: [
            "node_modules"
        ],
        alias: {

            angular: localRealPath("node_modules/angular"),
            underscore: localRealPath("node_modules/underscore"),
        }
    },
    plugins: webpackPlugins.plugins

};
