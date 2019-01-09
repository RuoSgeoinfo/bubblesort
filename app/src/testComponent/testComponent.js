"use Strict";

import template from "./testComponent.jade";

class TestController{
    constructor() {
        console.log("");
    }

}

angular.module("baseWebpack").component("testComponent", {
    controller: TestController,
    template: template(),
});
