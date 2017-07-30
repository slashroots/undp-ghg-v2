var app = angular.module("undp-ghg-v2", ["ngRoute", "undp-ghg-v2.services"]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when("/", {
      templateUrl: "../partials/inventory/empty-inventory.html"
    })
    .when("/settings", {
      templateUrl: "../partials/inventory/settings.html"
    })
});
