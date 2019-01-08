"use strict";

const env = "development";
const Server = require("./server/infrastructure/Server");
const config = require("./server/config/ConfigInstance").instance();

Server.start({
    env: env,
    config: config,
    container: require("./server/config/container")
});
