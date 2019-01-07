"use strict";

import template from "./base.html";
import "./base.css";

class BaseController {
    constructor() {
        this.test ="fjadslökfjdaslkf";
    }
}
angular.module("BaseController").component("projectComponent", {
    controller: BaseController,
    template: template()
});
