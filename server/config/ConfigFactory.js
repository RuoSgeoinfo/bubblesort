"use strict";

const _ = require("underscore");
const baseConfig = require("./config");
const ConfigMerger = require("@geolib/geolib-server").ConfigMerger;


class ConfigFactory {

    static initializeEnvConfig(env, geoAppConfig) {
        const envConfig = ConfigFactory.initializeConfig(env, geoAppConfig);
        ConfigMerger.mergeConfigWithEnvOverrides(envConfig, geoAppConfig.projectName);

        return envConfig;
    }

    static initializeConfig(env, geoAppConfig) {
        return _.mapObject(baseConfig, (value) => {
            return _.extend(value, geoAppConfig);
        });
    }

}

module.exports = ConfigFactory;
