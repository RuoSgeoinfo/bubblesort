"use strict";
const path = require("path");
const fs = require("fs");

function Routes(app, APP_BASE_PATH) {
    app.route("/test")
        .get((req, res) => res.send("test"));





    app.route("/*")
        .get((req, res) => {
            res.status(200).end(getIndexHtml().next().value);
        });

    function* getIndexHtml() {
        const indexPath = path.join(APP_BASE_PATH, "/dist/index.html");

        yield fs.readFileSync(indexPath).toString("utf8");
    }

}

module.exports = Routes;
