/**
  * Navigation related controller and functionality
  */

angular.module('undp-ghg-v2')
.controller('InventoryController', ['$scope', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
  'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory',
  function($scope, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
    AdminUserFactory, InventoryFactory, ActivityFactory) {

    /*
      Setup the tabs for viewing
    */
    $scope.tab = 1;
    if ($routeParams.id) {
      $scope.tab = $routeParams.id;
    }

    $scope.setTab = function(newTab){
      $location.path("settings/"+newTab);
    };
    $scope.isSet = function(tabNum){
      return $scope.tab == tabNum;
    };

    /**
      * Data Factories
      **/
    UserFactory.get(function(user) {
      $scope.user = user;
      if(user.us_user_role == 'admin') {
        AdminUserFactory.query(function(users) {
          $scope.users = users;
        });
      }
    });

    CategoryFactory.query(function(categories) {
      $scope.categories = categories;
    });

    GasFactory.query(function(gases) {
      $scope.gases = gases;
    });

    SectorFactory.query(function(sectors) {
      $scope.sectors = sectors;
    });

    InventoryFactory.query(function(inventories) {
      $scope.inventories = inventories;
    });

    ActivityFactory.query(function(activities) {
      $scope.activities = activities;
    });

    $scope.save = function() {
      InventoryFactory.create($scope.inventory, function(inventory) {
        if(inventory) {
          alert("Inventory " + $scope.inventory.in_name + " has been added!");
          $location.path('/settings/6');
        }
      })
    }
  }
]);
