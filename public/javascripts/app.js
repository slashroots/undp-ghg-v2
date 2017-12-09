var app = angular.module("undp-ghg-v2", ["ngRoute", "undp-ghg-v2.services",
"ui.grid", "ui.grid.importer", "ui.grid.edit", "ui.grid.rowEdit",
"ui.grid.selection","ui.grid.exporter", "ui.grid.cellNav", "ngMaterial"]);

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
    .when("/edit/gas/:id", {
      templateUrl: "../partials/dialog/add-gas.html"
    })
    .when("/add/sector", {
      templateUrl: "../partials/dialog/add-sector.html"
    })
    .when("/edit/sector/:id", {
      templateUrl: "../partials/dialog/add-sector.html"
    })
    .when("/add/category", {
      templateUrl: "../partials/dialog/add-category.html"
    })
    .when("/edit/category/:id", {
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
    .when("/edit/activity/:id", {
      templateUrl: "../partials/dialog/add-activity.html"
    })
    .when("/add/unit", {
      templateUrl: "../partials/dialog/add-unit.html"
    })
    .when("/edit/unit/:id", {
      templateUrl: "../partials/dialog/add-unit.html"
    })
    .when("/add/region", {
      templateUrl: "../partials/dialog/add-region.html"
    })
    .when("/edit/region/:id", {
      templateUrl: "../partials/dialog/add-region.html"
    })
    .when("/add/notation", {
      templateUrl: "../partials/dialog/add-notationkey.html"
    })
    .when("/edit/notation/:id", {
      templateUrl: "../partials/dialog/add-notationkey.html"
    })
    .when("/data", {
      templateUrl: "../partials/inventory/data-inventory.html"
    })
    .when("/calculations", {
      templateUrl: "../partials/calculations/calc-data-inventory.html"
    })
    .when("/data/:id/:se", {
      templateUrl: "../partials/inventory/data-inventory.html"
    })
    .when("/uploadbatch/:entity/:id", {
      templateUrl: "../partials/dialog/upload-file.html"
    })
});
