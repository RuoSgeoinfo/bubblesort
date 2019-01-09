"use strict";

const fs = require("fs");
const _ = require("underscore");
const PROJECT_NAME = require("./server/config/config.geoapp").projectName;

module.exports = (grunt) => {
    require("time-grunt")(grunt);

    const jsFiles = [
        `client/${PROJECT_NAME}/app/**/*.js`,
        `client/${PROJECT_NAME}/test/**/*.js`,
        "server/**/*.js",
        "server.js",
        "gruntfile.js",
        "webpack.config.js",
        "webpack.plugins.js"
    ];

    function getEnvironmentConfig(environment) {
        const configFactory = require("@geolib/geoappbase-server/config/ConfigFactory");
        const dbConfig = require("./server/config/config.db");
        const geoAppConfig = require("./server/config/config.geoapp");

        return configFactory.initializeEnvConfig(environment, dbConfig, geoAppConfig);
    }

    const gruntConfig = {

        webpack: {
            get dist() {
                return _.clone(require("./webpack.config"));
            }
        },

        clean: {
            reports: ["./mocha.json", "./coverage/server/clover.xml"],
            dist: [`./client/${PROJECT_NAME}/dist/`],
            server: (function () {
                return collectGitDependenciesRecursively(".");

                function collectGitDependenciesRecursively(packagePath) {
                    const gitDependencies = collectGitDependencies(packagePath);

                    if (!gitDependencies.length) {
                        return gitDependencies;
                    }

                    const recursiveDependencies = gitDependencies.map(collectGitDependenciesRecursively);
                    return [].concat.apply(gitDependencies, recursiveDependencies);
                }

                function collectGitDependencies(packagePath) {
                    const packageJson = grunt.file.readJSON(packagePath + "/package.json");
                    return _.pairs(_.extend({}, packageJson.dependencies, packageJson.devDependencies))
                        .filter((dep) => /git.geoinfo.ch/.test(dep[1]))
                        .map((dep) => "./node_modules/" + dep[0])
                        .filter((path) => fs.existsSync(path))
                        .filter((path) => !fs.lstatSync(path).isSymbolicLink());
                }
            }())
        },

        david: {
            check: {
                options: {
                    warn404: true
                }
            }
        },

        env: {
            test: {
                NODE_ENV: "test",
                multi: "spec=- mocha-bamboo-reporter=-"
            },
            development: {
                NODE_ENV: "development"
            },
            build: {
                NODE_ENV: "unit_test",
                multi: "spec=- mocha-bamboo-reporter=-"
            },
            stage: {
                NODE_ENV: "stage"
            },
            production: {
                NODE_ENV: "production"
            },
            live: {
                NODE_ENV: "live"
            },
            update: {
                NODE_ENV: "update"
            },
            unit_test: {
                NODE_ENV: "unit_test",
                TESTSERVER_HOST: "192.168.110.5",
                multi: "spec=- mocha-bamboo-reporter=-"
            }
        },

        exec: {
            install: {
                command: "npm install  --msvs_version=2012"
            }
        },

        eslint: {
            src: jsFiles
        },

        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true,
                browsers: ["PhantomJS"],
                logLevel: "ERROR"
            }
        },

        mochaTest: {
            unit: {
                options: {
                    reporter: "spec",
                    require: "server/test/test-server.js"
                },
                src: ["server/test/**/*.js", "!server/test/**/*IntegrationTest.js"]
            },
            integration: {
                options: {
                    reporter: "spec",
                    require: "server/test/test-server.js"
                },
                src: ["server/test/**/*IntegrationTest.js"]
            }
        },

        mocha_istanbul: {
            bambooCoverage: {
                src: "./server/test/**",
                options: {
                    reporter: "mocha-multi",
                    reportFormats: ["lcov", "clover"],
                    recursive: true,
                    coverageFolder: "./coverage/server",
                    require: ["./server/test/test-server.js"]
                }
            },
            coverage: {
                src: "./server/test/**",
                options: {
                    recursive: true,
                    coverageFolder: "./coverage/server",
                    require: ["./server/test/test-server.js"]
                }
            }
        },

        plato: {
            reports: {
                options: {
                    jshint: false,
                    exclude: new RegExp(`^(node_modules|coverage|reports|client/vendor|client/${PROJECT_NAME}/(js|scripts|dist|help))/`)
                },
                files: {
                    reports: ["**/*.js"]
                }
            }
        },

        todo: {
            src: jsFiles
        },

        flyway: (function () {
            function getFlywayOptions(dbName, options) {
                const environment = process.env.NODE_ENV || "development";
                let connection = getEnvironmentConfig(environment).db[dbName];

                connection = _.extend({
                    driver: "org.postgresql.Driver",
                    url: "jdbc:postgresql://" + connection.host + ":" + connection.port + "/" + connection.database,
                    user: connection.user,
                    password: connection.password,
                    validateOnMigrate: false,
                    outOfOrder: true
                }, options);

                return connection;
            }

            return {
                migrate: {
                    get options() {
                        return getFlywayOptions(PROJECT_NAME, {
                            schemas: ["data"],
                            locations: `filesystem:sql/${PROJECT_NAME}`
                        });
                    },
                    command: "migrate"
                }
            };
        }()),

        release: {
            options: {
                npm: true,
                tagName: "release-<%= version %>",
                commitMessage: "[grunt release plugin] release-<%= version %>",
                tagMessage: "[grunt release plugin] version <%= version %>"
            }
        },

        apidoc: {
            [PROJECT_NAME]: {
                src: "server/config/",
                dest: "reports/apidoc/"
            }
        },

        jsdoc: {
            doc: {
                src: [`client/${PROJECT_NAME}/app/`, "server/application/", "server/domain/", "server/infrastructure/"],
                options: {
                    destination: "reports/jsdoc",
                    template: "node_modules/ink-docstrap/template",
                    configure: "jsdoc.conf.json",
                    recurse: true
                }
            }
        }

    };

    grunt.initConfig(gruntConfig);
    const files = fs.readdirSync("node_modules/");
    require("load-grunt-tasks")(grunt, { config: { dependencies: files } });
    require("@geolib/ngp-dev-libraries/GruntSnapshotTask")(grunt);

    grunt.registerTask("code-check", ["eslint", "todo"]);
    grunt.registerTask("production", ["env:production", "update"]);
    grunt.registerTask("dist", ["env:production", "webpack"]);
    grunt.registerTask("install", ["clean", "exec:install"]);
    grunt.registerTask("update", ["install", "david", "dist"]);
    grunt.registerTask("test", ["code-check", /* "karma", */ "env:unit_test", "mocha_istanbul:coverage"]);
    grunt.registerTask("doc", ["apidoc", "jsdoc"]);
    grunt.registerTask("build", ["code-check", /* "karma", */ "env:build", "mocha_istanbul:bambooCoverage", "plato"]); /* "doc"*/
};
