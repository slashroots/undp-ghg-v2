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

      // DataFactory.create({
      //     da_variable_type: "AD",
      //     da_data_value: 1000,
      //     da_notes: "TESTING NOTES",
      //     da_uncertainty_min: -100,
      //     da_uncertainty_max: 100
      //   }, function(success) {
      //     console.log(success);
      //   }, function(error) {
      //     console.log(error);
      //   }
      // );


      //setup the tables
      $scope.dataGridOptions = {
        data: 'dataValues',
        columnDefs: [
          {
            field: 'da_variable_type',
            displayName: 'Variable Type',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'ca_category.ca_code_name',
            displayName: 'Category Name',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'ac_activity.ac_name',
            displayName: 'Activity',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'da_data_value',
            displayName: 'Activity Amount/Value',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'un_unit.un_unit_symbol',
            displayName: 'Unit',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'da_date',
            displayName: 'Year',
            enableCellEdit: true,
            cellFilter: "date: 'YYYY'",
            width: 200
          },
          {
            field: 'ga_gas.ga_gas_name',
            displayName: 'Assoc. Gas',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'da_uncertainty_min',
            displayName: 'Uncertainty (min)',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'da_uncertainty_max',
            displayName: 'Uncertainty (max)',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'nk_notation_key',
            displayName: 'NK',
            enableCellEdit: true,
            width: 200
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
