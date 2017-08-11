/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('DataController', ['$scope', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory',
    function($scope, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory) {

      /*
        Setup the tabs for viewing
      */
      $scope.tab = 1;
      if ($routeParams.id) {
        $scope.tab = $routeParams.id;
      }

      $scope.setTab = function(newTab) {
        $location.path("settings/" + newTab);
      };
      $scope.isSet = function(tabNum) {
        return $scope.tab == tabNum;
      };

      $scope.filtered = function() {
        //lookup based on filter applied
        DataFactory.query({in_inventory: $scope.selectedInventory}, function(dataValues) {
          if(dataValues) {
            $scope.isAvailable = true;
          }
          $scope.dataValues = dataValues;
        },
        function(error) {
          $scope.isAvailable = false;
        });
      }


      //setup the tables
      $scope.dataGridOptions = {
        data: 'dataValues',
        columnDefs: [{
            field: 'se_sector.se_name_short_code',
            displayName: 'Sector'
          },
          {
            field: 'ca_category.ca_code_name',
            displayName: 'Category Name'
          },
          {
            field: 'ac_activity.ac_name',
            displayName: 'Activity'
          },
          {
            field: 'ac_activity.ac_info_source',
            displayName: 'Info Source'
          },
          {
            field: 'da_data_value',
            displayName: 'Activity Amount/Value'
          },
          {
            field: 'un_unit.un_unit_symbol',
            displayName: 'Unit'
          },
          {
            field: 'ga_gas.ga_gas_name',
            displayName: 'Assoc. Gas'
          }
        ]
      };


      /**
       * Data Factories
       **/

      InventoryFactory.query(function(inventories) {
        $scope.inventories = inventories;
      });
    }
  ]);
