/**
  * Navigation related controller and functionality
  */

angular.module('undp-ghg-v2')
.controller('InventoryController', ['$scope', 'UserFactory', 'SectorFactory', 'CategoryFactory', 'GasFactory',
  function($scope, UserFactory, SectorFactory, CategoryFactory, GasFactory) {

    /*
      Setup the tabs for viewing
    */
    $scope.tab = 1;
    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
      return $scope.tab == tabNum;
    };

    /**
      * Data Factories
      **/
    UserFactory.get(function(user) {
      $scope.user = user;
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
  }
]);
