"use strict";

let _ = require("underscore");

let config = require("../../server/config/ConfigInstance").instance();

class EnvironmentConfig {

    constructor() {
        return this.getClientConfig();
    }

    getClientConfig() {
        let envs = _.keys(config);

        return _.object(_.map(envs, (env) => {
            return ["ENV-" + env.toUpperCase(), this.createEnvironmentConfig(env)];
        }));
    }

    createEnvironmentConfig(environment) {
        return {
            name: environment,
            contourLinesMapName: this.getEnvironmentConfig(environment).contourLinesMapName,
            geoserver: _.pick(this.getEnvironmentConfig(environment).geoserver, "maxScaleForWms", "wmsUrls", "wmtsUrls", "externalWmsUrls"),
            loadTilesWhileAnimating: this.getEnvironmentConfig(environment).loadTilesWhileAnimating,
            loadTilesWhileInteracting: this.getEnvironmentConfig(environment).loadTilesWhileInteracting
        };
    }

    getEnvironmentConfig(environment) {
        return config[environment];
    }

}

module.exports = EnvironmentConfig;
