var app = angular.module("undp-ghg-v2", ["ngRoute", "undp-ghg-v2.services", "ui.grid"]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when("/", {
      templateUrl: "../partials/inventory/empty-inventory.html"
    })
    .when("/settings", {
      templateUrl: "../partials/inventory/settings.html"
    })
    .when("/settings/:id", {
      templateUrl: "../partials/inventory/settings.html"
    })
    .when("/add/gas", {
      templateUrl: "../partials/dialog/add-gas.html"
    })
    .when("/add/gas/:id", {
      templateUrl: "../partials/dialog/add-gas.html"
    })
    .when("/add/sector", {
      templateUrl: "../partials/dialog/add-sector.html"
    })
    .when("/add/sector/:id", {
      templateUrl: "../partials/dialog/add-sector.html"
    })
    .when("/add/category", {
      templateUrl: "../partials/dialog/add-category.html"
    })
    .when("/add/category/:id", {
      templateUrl: "../partials/dialog/add-category.html"
    })
    .when("/edit/user/:id", {
      templateUrl: "../partials/dialog/edit-user.html"
    })
    .when("/add/inventory", {
      templateUrl: "../partials/dialog/add-inventory.html"
    })
    .when("/add/activity", {
      templateUrl: "../partials/dialog/add-activity.html"
    })
    .when("/add/activity/:id", {
      templateUrl: "../partials/dialog/add-activity.html"
    })
    .when("/add/unit", {
      templateUrl: "../partials/dialog/add-unit.html"
    })
    .when("/edit/unit/:id", {
      templateUrl: "../partials/dialog/add-unit.html"
    })
    .when("/data", {
      templateUrl: "../partials/inventory/data-inventory.html"
    })
});
