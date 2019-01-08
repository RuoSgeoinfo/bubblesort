"use strict";

const path = require("path");
const rootPath = path.join(__dirname, "/../../");

module.exports = {
    projectName: "base",
    projectTitle: "Base",
    rootPath: rootPath,
    privilegeKeys: {
        default: "geoapp.base",
        "<otherPrivilegeKey>": "<setSomeOtherPrivilegeKeyIfYouNeedIt>"
    }
};
