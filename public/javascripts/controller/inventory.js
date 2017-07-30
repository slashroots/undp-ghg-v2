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

    var sector1 = {
      se_name: "Energy",
      se_description: "Energy systems are for most economies largely driven by the combustion of fossil fuels",
      se_name_short_code: "ENERGY"
    };
    var sector2 = {
      se_name: "Industrial Processes and Product Use",
      se_name_short_code: "IPPU",
      se_description: "Covers greenhouse gas emissions occurring from industrial processes, from the use of greenhouse gases in products, and from non-energy uses of fossil fuel carbon"
    };
    var sector3 = {
      se_name: "Agriculture, Forestry and Other Land Use",
      se_name_short_code: "AFOLU",
      se_description: "Land use and management influence a variety of ecosystem processes that affect greenhouse gas fluxes"
    };
    var sector4 = {
      se_name: "Waste",
      se_name_short_code: "WASTE",
      se_description: "disposal, treatment and incineration resulting in emissions"
    };
    var sector5 = {
      se_name: "Other",
      se_name_short_code: "OTHER",
      se_description: "Other emission industries"
    };

    SectorFactory.create(sector1, function(err, res) {
      console.log(err, res);
    })
    SectorFactory.create(sector2, function(err, res) {
      console.log(err, res);
    })
    SectorFactory.create(sector3, function(err, res) {
      console.log(err, res);
    })
    SectorFactory.create(sector4, function(err, res) {
      console.log(err, res);
    })
    SectorFactory.create(sector5, function(err, res) {
      console.log(err, res);
    })
  }
]);
