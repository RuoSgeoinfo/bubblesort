"use Strict";

import template from "./testComponent.html";

class TestController{
    constructor() {
        console.log("sdfsdfs");
    }

}

angular.module("baseWebpack").component("testComponent", {
    controller: TestController,
    template: template,
});
