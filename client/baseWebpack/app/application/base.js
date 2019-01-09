"use strict";

import template from "./base.html";

class BaseController {
    constructor() {
        this.test ="basecomponent";
        this.numbers = [1,1,1,1,1,,1,1];
        this.name = "name";
        this.button = "click me";
    }

    clickButton(user){
        console.log(user);
        alert(`Hello ${user}`)
    }
}
angular.module("baseWebpack").component("baseComponent", {
    controller: BaseController,
    template: template
});
