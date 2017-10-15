/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('DataController', ['$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory',
    function($scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory) {

      //when user selects the inventory to manipulate this function is run:
      $scope.inventoryChanged = function() {
        $location.path('data/' + $scope.selectedInventory);
      }

      //Used to import data.  Need to perform Validation on the information!
      newDataImporter = function(grid, newObjects) {
        $scope.dataValues = $scope.dataValues.concat(newObjects);
        $scope.dirtyRowsExist = true;
        console.log($scope.dataValues);
      };

      $scope.persist = function() {
        $scope.gridApi.rowEdit.flushDirtyRows();
        $scope.dirtyRowsExist = false;
      }

      //setting up the table structure and configurations.
      $scope.editable = true;
      $scope.dirtyRowsExist = false;
      $scope.dataGridOptions = {
        enableFiltering: true,
        enableCellEditOnFocus: $scope.editable,
        enableSelectAll: true,
        enableGridMenu: true,
        rowEditWaitInterval: -1,
        exporterPdfDefaultStyle: {fontSize: 9},
        exporterPdfTableStyle: {margin: [5, 5, 5, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 9, bold: true, italics: true, color: 'red'},
        importerDataAddCallback: newDataImporter,
        data: 'dataValues',
        columnDefs: [{
            field: 'da_variable_type',
            displayName: 'Variable Type',
            enableCellEdit: $scope.editable,
            width: 200,
            editDropdownValueLabel: 'variableType',
            editDropdownIdLabel: 'variableType',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            enableSelectAll: true,
            exporterCsvFilename: 'dataExport.csv',
            // exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
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
            enableCellEdit: $scope.editable,
            cellTooltip: function(row, col) {
              if (row.entity.ca_category) {
                return 'Code: ' + row.entity.ca_category.ca_code
                  + ' Name: ' + row.entity.ca_category.ca_code_name;
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
            enableCellEdit: $scope.editable,
            width: 200,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'ac_name',
            editDropdownOptionsArray: $scope.activities,
            editDropdownIdLabel: '_id'
          },
          {
            field: 'da_data_value',
            displayName: 'Activity Amount/Value',
            enableCellEdit: $scope.editable,
            type: 'number',
            width: 200
          },
          {
            field: 'un_unit.un_unit_symbol',
            displayName: 'Unit',
            enableCellEdit: $scope.editable,
            width: 200,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'un_unit_symbol',
            editDropdownOptionsArray: $scope.units,
            editDropdownIdLabel: '_id'
          },
          {
            field: 'da_date',
            displayName: 'Year',
            enableCellEdit: $scope.editable,
            cellFilter: "date: 'yyyy'",
            width: 200,
            type: 'date'
          },
          {
            field: 'ga_gas.ga_gas_name',
            displayName: 'Assoc. Gas',
            enableCellEdit: $scope.editable,
            width: 200,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'ga_gas_name',
            editDropdownOptionsArray: $scope.gases,
            editDropdownIdLabel: '_id'
          },
          {
            field: 'da_uncertainty_min',
            displayName: 'Uncertainty (min)',
            enableCellEdit: $scope.editable,
            width: 200
          },
          {
            field: 'da_uncertainty_max',
            displayName: 'Uncertainty (max)',
            enableCellEdit: $scope.editable,
            width: 200
          },
          {
            field: 'nk_notation_key',
            displayName: 'NK',
            enableCellEdit: $scope.editable,
            width: 200
          }
        ]
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
            $scope.editable = true;
          }
          $scope.dataGridOptions.exporterCsvFilename = item.in_name+'.csv';
        });

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

      /**
       * Data Factories
       **/
      $scope.inventories = InventoryFactory.query();
      $scope.categories = CategoryFactory.query();
      $scope.units = UnitFactory.query();
      $scope.gases = GasFactory.query();
      $scope.activities = ActivityFactory.query();


      /*
      Based on the selected item from the combobox replace with the server side
      values for the save record script that gets called.
      */
      $scope.lookupEditor = function(rowEntity, columnDef, newValue, oldValue) {
        if($scope.gridApi.rowEdit.getDirtyRows() > 0) {
          console.log($scope.gridApi.rowEdit.getDirtyRows().length);
          $scope.dirtyRowsExist = true;
        }
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

      //This is run approximately 3 seconds after a ROW edited event or if
      //flushing dirty rows.
      $scope.saveRow = function(rowEntity) {
        var dataRecord = DataFactory.edit({id: rowEntity._id}, rowEntity);
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, dataRecord.$promise);
      };

      $scope.dataGridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        gridApi.edit.on.afterCellEdit($scope, $scope.lookupEditor);
      };

      //launches the uploader dialog for uploading to the inventory
      $scope.startUploader = function() {
        $location.path("/uploadbatch/inventory/" + $scope.selectedInventory);
      }

      /**
        run this function if there exists an ID within the URL for Inventory
      **/
      if ($routeParams.id) {
        $scope.selectedInventory = $routeParams.id;
        $scope.filtered();
      }

    }
  ]);
