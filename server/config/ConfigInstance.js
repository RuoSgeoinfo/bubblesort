"use strict";

const configFactory = require("./ConfigFactory");
const geoAppConfig = require("./config.geoapp");
const env = "development";

class ConfigInstance {

    static instance(customEnv) {
        return configFactory.initializeEnvConfig(customEnv || env, geoAppConfig);
    }
}

module.exports = ConfigInstance;
