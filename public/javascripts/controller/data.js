/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('DataController', ['$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory',
    function($scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
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
        DataFactory.query({
            in_inventory: $scope.selectedInventory
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

      // DataFactory.create({
      //     da_variable_type: "EF",
      //     da_data_value: 10,
      //     da_notes: "TESTING NOTES",
      //     da_uncertainty_min: -5,
      //     da_uncertainty_max: 5
      //   }, function(success) {
      //     console.log(success);
      //   }, function(error) {
      //     console.log(error);
      //   }
      // );

      $scope.categories = CategoryFactory.query();


      //setup the tables
      $scope.dataGridOptions = {
        data: 'dataValues',
        columnDefs: [{
            field: 'da_variable_type',
            displayName: 'Variable Type',
            enableCellEdit: true,
            width: 200,
            editDropdownValueLabel: 'variableType',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
              {variableType: 'EF'},
              {variableType: 'AD'}
            ]
          },
          {
            field: 'ca_category',
            displayName: 'Category Name',
            enableCellEdit: true,
            width: 200,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'ca_code_name',
            editDropdownOptionsArray: $scope.categories,
            editDropdownIdLabel: '_id'
          },
          {
            field: 'ac_name',
            displayName: 'Activity',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'da_data_value',
            displayName: 'Activity Amount/Value',
            enableCellEdit: true,
            type: 'number',
            width: 200
          },
          {
            field: 'un_unit_symbol',
            displayName: 'Unit',
            enableCellEdit: true,
            width: 200
          },
          {
            field: 'da_date',
            displayName: 'Year',
            enableCellEdit: true,
            cellFilter: "date: 'yyyy'",
            width: 200,
            type: 'date'
          },
          {
            field: 'ga_gas_name',
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

      $scope.saveRow = function(rowEntity) {
        //set a promise
        // var promise = $q.defer();

        var dataRecord = DataFactory.edit({id: rowEntity._id}, rowEntity);
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, dataRecord.$promise);

      };

      $scope.dataGridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
      };




      /**
       * Data Factories
       **/

      InventoryFactory.query(function(inventories) {
        $scope.inventories = inventories;
      });
    }
  ]);
