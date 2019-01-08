"use strict";

const path = require("path");
const rootPath = path.join(__dirname, "/../../");
const loggerConfig = require("./config.logger");


module.exports = {
    development: {
        rootPath: rootPath,
        debug: false,
        logger: loggerConfig.development,
        port: 3000
    }
};
