"use strict";

const path = require("path");
const rootPath = path.join(__dirname, "/../../");

module.exports = {
    projectName: "baseWebpack",
    projectTitle: "baseWebpack",
    rootPath: rootPath,
    privilegeKeys: {
        default: "geoapp.base",
        "<otherPrivilegeKey>": "<setSomeOtherPrivilegeKeyIfYouNeedIt>"
    }
};
