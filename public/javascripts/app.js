var app = angular.module("undp-ghg-v2", ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when("/", {
      templateUrl: "../partials/inventory/empty-inventory.html"
    });
});
