"use strict";

const path = require("path");
const rootPath = path.join(__dirname, "/../../");
const appInfo = require(rootPath + "package.json");

module.exports = {

    development: {
        console: {
            level: process.env.LOG_LEVEL || "info"
        },
        graylog: {
            level: "warn",
            graylog: {
                servers: [{ host: "geo4l411.rgdi.ch", port: 12201 }],
                facility: "nodejs-development-" + appInfo.name
            }
        }
    }
};
