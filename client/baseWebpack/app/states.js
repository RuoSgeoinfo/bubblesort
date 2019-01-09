"use strict";

const states = [{
    name: "home",
    url: "/",
    template: "<base-component></base-component>"
}, {
    name: "test",
    parent: "home",
    url: "test",
    template: "<test-component></test-component>"
}];


angular.module("baseWebpack").constant("states", states);
