/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
.controller('CalcController', ['$mdSidenav', '$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
  'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
  'DataFactory', 'NotationKeyFactory', 'RegionFactory', 'CalculationFactory', 'uiGridConstants',
  function($mdSidenav, $scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
    AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory, NotationKeyFactory, RegionFactory,
    CalculationFactory, uiGridConstants) {

    $scope.reference_issue = [];
    $scope.matches = [];
    $scope.isAvailable = false;
    $scope.sectors = [];
    $scope.calculations = [];
    $scope.changesAvailable = false;

    // get all saved calculations
    CalculationFactory.query({
    }, function(results) {
        $scope.calculations = results;
    });

    // persist calculations to the database
    $scope.saveCalculations = function() {
        for(var i=0; i<$scope.calculations.length; i++) {
            var data = {
                "_id": $scope.calculations[i]._id,
                "in_inventory": $scope.selectedInventory,
                "se_sector": $scope.selectedSector,
                "ac_activity": $scope.calculations[i].ac_activity._id,
                "emission_factor": $scope.calculations[i].emission_factor._id,
                "calculation_value": $scope.calculations[i].calculated_value,
                "un_unit": $scope.calculations[i].un_unit._id,
            };
            if($scope.calculations[i]._id) {
                CalculationFactory.edit({id: $scope.calculations[i]._id}, $scope.calculations[i], function(result) {
                });
            } else {
                CalculationFactory.create($scope.calculations[i], function(result) {
                });
            }
        }
        $scope.changesAvailable = false;
    }

    // add/remove calculation entries
    $scope.calculationEntries = function(action, calculation) {
        $scope.changesAvailable = true;
        if(action==="add") {
            calculation.in_inventory = $scope.selectedInventory;
            calculation.se_sector = $scope.selectedSector;
            calculation.isnew = true;
            $scope.calculations.push(calculation);
        } else if(action==="remove") {
            for(var i=0; i<$scope.calculations.length; i++) {
                if($scope.calculations[i].ac_activity === calculation.ac_activity) {
                    CalculationFactory.remove({id: $scope.calculations[i]._id}, function(result) {
                        $scope.calculations.splice(i, 1);
                    });
                    break;
                }
            }
        } else if(action==="update") {
            for(var i=0; i<$scope.calculations.length; i++) {
                if($scope.calculations[i].ac_activity === calculation.ac_activity) {
                    angular.extend($scope.calculations[i], calculation);
                    break;
                }
            }
        }
    }

    $scope.getCalculations = function(ad) {
        var l = [];
        for(var i=0; i<$scope.calculations.length; i++) {
            if($scope.calculations[i].ac_activity._id===ad._id) {
                l.push($scope.calculations[i]);
            }
        }
        return l;
    }

    // Get configured units for association with emission selection
    $scope.units = UnitFactory.query();

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
      var ids = [];
      var new_list = [];
      if($scope.calculations.length > 0) {
        for(var i=0; i<$scope.calculations.length; i++) {
            if($scope.calculations[i].ac_activity._id===element._id && !$scope.calculations[i].isnew) {
                $scope.calculations[i].issues = [];
                $scope.calculations[i].calc = true;

                ids.push($scope.calculations[i].emission_factor._id);

                for(var j=0; j<list.length; j++) {
                    if($scope.calculations[i].emission_factor._id === list[j]._id) {
                        $scope.calculations[i].emission_factor = list[j];
                    }
                }
                new_list.push($scope.calculations[i]);
            }
        }
      }

      if (hasProperty(element, 'ac_activity')) {
        for (i in list) {
          if (hasProperty(list[i], 'ac_activity') && ids.indexOf(list[i]._id)<0) {
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
