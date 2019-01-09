"use strict";

import template from "./base.html";

class BaseController {
    constructor() {
        this.test ="basecomponent";
    }
}
angular.module("baseWebpack").component("baseComponent", {
    controller: BaseController,
    template: template
});
