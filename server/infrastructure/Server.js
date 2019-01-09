"use strict";

const LoggerFactory = require("@geolib/geolib-server").LoggerFactory;
const Express = require("./Express");


class Server {

    static start(initData) {
        return new Server(initData).listen();
    }

    constructor(initData) {
        console.log(this.config);


        this.env = initData.env;
        this.config = initData.config;
        this.createLogger();
        this.setContainer(initData.container);

    }

    createLogger() {
        this.logger = LoggerFactory.createInstance(this.config.development.logger, this.config.development.port);
    }

    setContainer(container) {
        this.Container = container;
        return this;
    }

    listen() {
        Express.listen(this.config, this.Container, this.logger, this.env);
    }

}

module.exports = Server;
