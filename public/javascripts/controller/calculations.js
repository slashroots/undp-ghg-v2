/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
.controller('CalcController', ['$mdSidenav', '$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
  'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
  'DataFactory', 'NotationKeyFactory', 'RegionFactory', 'uiGridConstants',
  function($mdSidenav, $scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
    AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory, NotationKeyFactory, RegionFactory,
    uiGridConstants) {

    $scope.reference_issue = [];
    $scope.matches = [];
    $scope.isAvailable = false;
    $scope.sectors = [];

    //when user selects the inventory to manipulate this function is run:
    $scope.inventoryChanged = function() {
      $scope.sectors = UserFactory.get({},function(user) {
        $scope.sectors = user.us_sector_permissions;
      });
    }

    /**
     * Event to be fired based on the selection of a sector.
     */
    $scope.sectorChanged = function() {
      $location.path('calculations/' + $scope.selectedInventory + "/"+ $scope.selectedSector);
    }

    
    /**
     * Loading all information for later matching.
     * We should probably only run this when necessary - nice to have.
     **/
    $scope.inventories = InventoryFactory.query();

    $scope.filtered = function() {
      InventoryFactory.get({
        id: $scope.selectedInventory
      }, function(item) {
        if (item.in_status == 'opened') {
          $scope.editable = true;
        } else {
          $scope.editable = false;
        }
      });

      //lookup based on filter applied
      DataFactory.query({
          in_inventory: $scope.selectedInventory,
          se_sector: $scope.selectedSector
        }, function(dataValues) {
          if (dataValues) {
            $scope.isAvailable = true;
          }
          $scope.dataValues = dataValues;
        },
        function(error) {
          $scope.isAvailable = false;
        });
    }

    /**
     * Retrieve all the Emission Factors for the given parameters
     * @param {*} inventory 
     * @param {*} sector 
     */
    $scope.getAllEF = function(inventory, sector) {
      DataFactory.query({
        in_inventory: inventory,
        se_sector: sector,
        da_variable_type: 'EF'
      }, function(emission_factors) {
        $scope.emission_factors = emission_factors;
      });
    }

    $scope.activity_data = [];
    /**
     * Retrieve all the Activity Data for the given parameters
     * @param {*} inventory 
     * @param {*} sector 
     */
    $scope.getAllAD = function(inventory, sector) {
      DataFactory.query({
        in_inventory: inventory,
        se_sector: sector,
        da_variable_type: 'AD'
      }, function(ads) {
        $scope.activity_data = ads;
      });
    }

    /**
     * Based on an element and a list
     * find the element's corresponding matches in the list
     * using category and activity
     * @param {*} element 
     * @param {*} list 
     */
    $scope.getAssociatedInfo = function (element, list) {
      var new_list = [];
      if (hasProperty(element, 'ac_activity')) {
        for (i in list) {
          if (hasProperty(list[i], 'ac_activity')) {
            if((element.ac_activity._id == list[i].ac_activity._id) && (yearMatch(element, list[i]))) {
              new_list.push(list[i]);
            }
          }
        }
      }
      return new_list;
    }
    
    

    /**
     * Run this function if there exists an ID within the URL for Inventory
    **/
    if ($routeParams.id) {
      $scope.selectedInventory = $routeParams.id;
      $scope.inventoryChanged();
    }

    if($routeParams.se) {
      $scope.selectedSector = $routeParams.se;
      $scope.filtered();
      $scope.getAllAD();
    }

    /**
     * safe check if property exists in object
     * @param {*} object 
     * @param {*} key 
     */
    function hasProperty(object, key) {
      try {
        if (object[key]) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    /**
     * TODO: Need to revisit and make sure the year 
     * is appropriately handled.
     * @param {*} element1 
     * @param {*} element2 
     */
    function yearMatch(element1, element2) {
      match = false;
      if(element1.da_date == element2.da_date) {
        match = true;
      } else if(element1.da_date_all) {
        match = true;
      } else if(element2.da_date_all) {
        match = true;
      }
      return match;
    }

    /**
     * controls for the tree structure
     */
    $scope.collapseAll = function() {
      $scope.$broadcast('angular-ui-tree:collapse-all');
    };
    $scope.expandAll = function() {
      $scope.$broadcast('angular-ui-tree:expand-all');
    };
  }
]);
