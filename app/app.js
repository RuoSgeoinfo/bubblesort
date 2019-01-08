import "../views/vendor-scripts";
import "../views/vendor-styles";

import angular from "angular";

let app = angular.module('baseWebpack', []);

app.config(($stateProvider, $locationProvider, $urlRouterProvider, states) => {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");
    states.forEach((state) => $stateProvider.state(state.name, state));
});
