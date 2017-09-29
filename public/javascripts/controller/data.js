/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('DataController', ['$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory',
    function($scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory) {

      var editable = false;
      $scope.dataGridOptions = {
        enableFiltering: true,
        enableCellEditOnFocus: editable,
        enableGridMenu: true
      };

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
        InventoryFactory.get({
          id: $scope.selectedInventory
        }, function(item) {
          if (item.in_status == 'opened') {
            editable = true;
          }
        });

        //lookup based on filter applied
        DataFactory.query({
            in_inventory: $scope.selectedInventory
          }, function(dataValues) {
            if (dataValues) {
              $scope.isAvailable = true;
            }
            $scope.dataGridOptions = getGrid(editable);
            $scope.dataValues = dataValues;
          },
          function(error) {
            $scope.isAvailable = false;
          });
      }

      /**
       * Data Factories
       **/
      $scope.inventories = InventoryFactory.query();
      $scope.categories = CategoryFactory.query();
      $scope.units = UnitFactory.query();
      $scope.gases = GasFactory.query();
      $scope.activities = ActivityFactory.query();

      getGrid = function(editable) {
        //setup the tables
        return {
          data: 'dataValues',
          columnDefs: [{
              field: 'da_variable_type',
              displayName: 'Variable Type',
              enableCellEdit: editable,
              width: 200,
              editDropdownValueLabel: 'variableType',
              editDropdownIdLabel: 'variableType',
              editableCellTemplate: 'ui-grid/dropdownEditor',
              editDropdownOptionsArray: [{
                  variableType: 'EF'
                },
                {
                  variableType: 'AD'
                }
              ]
            },
            {
              field: 'ca_category.ca_code_name',
              displayName: 'Category Name',
              enableCellEdit: editable,
              cellTooltip: function(row, col) {
                if (row.entity.ca_category) {
                  return 'Code: ' + row.entity.ca_category.ca_code + ' Name: ' + row.entity.ca_category.ca_code_name;
                } else {
                  return '';
                }
              },
              width: 200,
              editableCellTemplate: 'ui-grid/dropdownEditor',
              editDropdownValueLabel: 'ca_code_name',
              editDropdownOptionsArray: $scope.categories,
              editDropdownIdLabel: '_id'
            },
            {
              field: 'ac_activity.ac_name',
              displayName: 'Activity',
              enableCellEdit: editable,
              width: 200,
              editableCellTemplate: 'ui-grid/dropdownEditor',
              editDropdownValueLabel: 'ac_name',
              editDropdownOptionsArray: $scope.activities,
              editDropdownIdLabel: '_id'
            },
            {
              field: 'da_data_value',
              displayName: 'Activity Amount/Value',
              enableCellEdit: editable,
              type: 'number',
              width: 200
            },
            {
              field: 'un_unit.un_unit_symbol',
              displayName: 'Unit',
              enableCellEdit: editable,
              width: 200,
              editableCellTemplate: 'ui-grid/dropdownEditor',
              editDropdownValueLabel: 'un_unit_symbol',
              editDropdownOptionsArray: $scope.units,
              editDropdownIdLabel: '_id'
            },
            {
              field: 'da_date',
              displayName: 'Year',
              enableCellEdit: editable,
              cellFilter: "date: 'yyyy'",
              width: 200,
              type: 'date'
            },
            {
              field: 'ga_gas.ga_gas_name',
              displayName: 'Assoc. Gas',
              enableCellEdit: editable,
              width: 200,
              editableCellTemplate: 'ui-grid/dropdownEditor',
              editDropdownValueLabel: 'ga_gas_name',
              editDropdownOptionsArray: $scope.gases,
              editDropdownIdLabel: '_id'
            },
            {
              field: 'da_uncertainty_min',
              displayName: 'Uncertainty (min)',
              enableCellEdit: editable,
              width: 200
            },
            {
              field: 'da_uncertainty_max',
              displayName: 'Uncertainty (max)',
              enableCellEdit: editable,
              width: 200
            },
            {
              field: 'nk_notation_key',
              displayName: 'NK',
              enableCellEdit: editable,
              width: 200
            }
          ]
        };
      };

      $scope.lookupEditor = function(rowEntity, columnDef, newValue, oldValue) {
        if (newValue != oldValue) {
          if (columnDef.field == 'ca_category.ca_code_name') {
            CategoryFactory.get({
                id: rowEntity.ca_category.ca_code_name
              },
              function(item) {
                rowEntity.ca_category = item;
              });
          } else if (columnDef.field == 'ac_activity.ac_name') {
            ActivityFactory.get({
                id: rowEntity.ac_activity.ac_name
              },
              function(item) {
                rowEntity.ac_activity = item;
              });
          } else if (columnDef.field == 'un_unit.un_unit_symbol') {
            UnitFactory.get({
                id: rowEntity.un_unit.un_unit_symbol
              },
              function(item) {
                rowEntity.un_unit = item;
              });
          } else if (columnDef.field == 'ga_gas.ga_gas_name') {
            GasFactory.get({
                id: rowEntity.ga_gas.ga_gas_name
              },
              function(item) {
                rowEntity.ga_gas = item;
              });
          }
        }
      };

      //This is run after a ROW edited event
      $scope.saveRow = function(rowEntity) {
        //set a promise
        // var promise = $q.defer();

        var dataRecord = DataFactory.edit({
          id: rowEntity._id
        }, rowEntity);
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, dataRecord.$promise);

      };

      $scope.dataGridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        gridApi.edit.on.afterCellEdit($scope, $scope.lookupEditor);
      };

    }
  ]);
