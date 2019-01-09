"use strict";

const path = require("path");
const bodyParser = require("body-parser");
const StaticFileMiddleware = require("@geolib/geolib-server").StaticFileMiddleware;

const express = require("express");
const app = express();

class Express {

    static listen(config, Container, logger , env) {
        let container = new Container(app, config, env);
        let expressInstance = new Express(env, config);
        expressInstance.initialize.call(expressInstance, config, logger);
        container.application.get("routes");
        app.listen(config[env].port, () => {
            container.start();
            logger.info("Listening on port " + config[env].port + " ...");
        });
    }

    constructor(env, config) {
        this.env = env;
        this.config = config;
    }

    initialize(config, logger) {
        app.disable("etag");
        app.disable("x-powered-by");

        app.set("view engine", "html");
        app.set("views", path.join(config.rootPath + "/client/baseWebpack/dist"));

        app.use(logger.requestLogger);

        app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

        app.use(bodyParser.json({ limit: "5mb" }));
        app.use(StaticFileMiddleware.serve(path.join(config[this.env].rootPath, `/client/baseWebpack/dist`), {
            checkFilenames: "development",
            lastModified: true,
            index: false,
            maxAge: 24 * 3600 * 1000,
            etag: true
        }));
    }
}

module.exports = Express;
