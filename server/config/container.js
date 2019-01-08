/* jshint maxstatements: false*/

"use strict";

const yaioc = require("yaioc");
const Timing = require("@geolib/geolib-server").Timing;
const PromiseHelper = require("@geolib/geolib-server").PromiseHelper;


class ContainerConfiguration {

    constructor(app, config, env) {
        this.startTime = Date.now();
        this.app = app;
        this.config = config;
        this.env = env;

        console.log(this.config);

        this.infrastructure = this.configureInfrastructureContainer();
        this.domain = this.configureDomainContainer();
        this.application = this.configureApplicationContainer();
    }

    start() {
        return PromiseHelper.sequential([
            this.startInfrastructureContainer,
            this.startApplicationContainer
        ], (start) => start.call(this)).then(() => {
            this.logger.verbose("configured IOC-Container in " + Timing.formatDuration(this.startTime));
        });
    }

    configureInfrastructureContainer() {
        const infrastructureContainer = yaioc.container();
        const logger = require("@geolib/geolib-server").LoggerFactory.getInstance();

        infrastructureContainer.register("VERSION", Date.now());
        infrastructureContainer.register("APP_BASE_PATH", this.config[this.env].rootPath);
        infrastructureContainer.register("logger", logger);

        return infrastructureContainer;
    }

    startInfrastructureContainer() {

        return Promise.all([this.infrastructure]);
    }

    configureDomainContainer() {
        const domainContainer = yaioc.container(this.infrastructure);

        return domainContainer;
    }

    configureApplicationContainer() {
        const applicationContainer = yaioc.container(this.domain);

        applicationContainer.register("app", this.app);

        applicationContainer.cache().register(require("./Routes"));

        return applicationContainer;
    }

    startApplicationContainer() {
        require("@geolib/geolib-server").RepositoryController.setDefaultCodeForError(require("@geolib/geolib-server").AuthorizationError, 401);
    }


}

module.exports = ContainerConfiguration;
