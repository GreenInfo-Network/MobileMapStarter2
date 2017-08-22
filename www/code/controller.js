angular.module('mobileApp', [
    'ui.router',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/welcome");
    $stateProvider
    .state('welcome', { url: "/welcome", templateUrl: "html/welcome.html" })
    .state('map',     { url: "/map",     templateUrl: "html/map.html" })
    .state('about',   { url: "/about",   templateUrl: "html/about.html" });
})
.controller('appController', function($scope) {
});
