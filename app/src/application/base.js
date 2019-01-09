"use strict";

import template from "./base.html";
import "./test.styl";

class BaseController {
    constructor() {
        this.test ="fjadslökfjdaslkf";
    }
}
angular.module("BaseController").component("projectComponent", {
    controller: BaseController,
    template: template()
});
