/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('DataController', ['$mdSidenav', '$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory', 'NotationKeyFactory',
    function($mdSidenav, $scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory, NotationKeyFactory) {

      //construct modal side nav menu
      $scope.toggleRight = buildToggler('right');
      $scope.openSideNav = function() {
        $mdSidenav('right').open();
      }
      $scope.closeSideNav = function() {
        $mdSidenav('right').close();
      }

      //when user selects the inventory to manipulate this function is run:
      $scope.inventoryChanged = function() {
        $scope.sectors = SectorFactory.query();
      }

      /**
       * Event to be fired based on the selection of a sector.
       */
      $scope.sectorChanged = function() {
        $location.path('data/' + $scope.selectedInventory + "/"+ $scope.selectedSector);
      }

      //Used to import data.  Need to perform Validation on the information!
      newDataImporter = function(grid, newObjects) {
        //run only if there is a selected inventory.
        if($scope.selectedInventory) {
          runMatchProcess(newObjects, function(matchedItems) {
            $scope.dataValues = $scope.dataValues.concat(newObjects);
            $scope.dirtyRowsExist = true;
          });
        } else {
          alert("Please select an inventory!");
        }
      };

      //triggers a save event to flush all the modified rows to the databse.
      $scope.persist = function() {
        $scope.gridApi.rowEdit.flushDirtyRows();
        $scope.dirtyRowsExist = false;
      }

      /**
       * Loading all information for later matching.
       * We should probably only run this when necessary - nice to have.
       **/
      $scope.inventories = InventoryFactory.query();
      $scope.units = UnitFactory.query();
      $scope.gases = GasFactory.query();
      $scope.activities = ActivityFactory.query();
      $scope.notation_keys = NotationKeyFactory.query({nk_is_enabled: true});

      //setting up the table structure and configurations.
      $scope.editable = true;
      $scope.dirtyRowsExist = false;
      $scope.dataGridOptions = {
        enableFiltering: true,
        enableCellEditOnFocus: $scope.editable,
        enableSelectAll: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectionBatchEvent: false,
        enableGridMenu: true,
        rowEditWaitInterval: -1,
        exporterPdfDefaultStyle: {
          fontSize: 9
        },
        exporterPdfTableStyle: {
          margin: [5, 5, 5, 5]
        },
        exporterPdfTableHeaderStyle: {
          fontSize: 9,
          bold: true,
          italics: true,
          color: 'red'
        },
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
                return 'Code: ' + row.entity.ca_category.ca_code +
                  ' Name: ' + row.entity.ca_category.ca_code_name;
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
            displayName: 'Variable Value',
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
            field: 'ga_gas.ga_chem_formula',
            displayName: 'Assoc. Gas',
            enableCellEdit: $scope.editable,
            width: 200,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'ga_chem_formula',
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
            field: 'nk_name',
            displayName: 'NK',
            enableCellEdit: $scope.editable,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownValueLabel: 'nk_name',
            editDropdownIdLabel: 'nk_name',
            editDropdownOptionsArray: $scope.notation_keys,
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
          $scope.dataGridOptions.exporterCsvFilename = item.in_name + '.csv';
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

          //filter all the relevant factories based
          //on selected sector.
          $scope.sectors = SectorFactory.query();

          $scope.categories = CategoryFactory.query({
            se_sector: $scope.selectedSector
          });
      }


      /*
      Based on the selected item from the combobox replace with the server side
      values for the save record script that gets called.
      */
      $scope.lookupEditor = function(rowEntity, columnDef, newValue, oldValue) {
        if ($scope.gridApi.rowEdit.getDirtyRows() > 0) {
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
          } else if (columnDef.field == 'nk_notation_key') {
            NotationKeyFactory.query({
                nk_name: rowEntity.nk_notation_key
            },
            function(items) {
                if(items.length > 0)
                    rowEntity.nk = items[0];
            });
          }
        }
      };

      /**
       * Typically the application can be setup to flush dirty rows by attempting to 
       * save the record to the server.  This however is deferred until the user 
       * selects the Persist to database button.
       */
      $scope.saveRow = function(rowEntity) {
        var dataRecord = DataFactory.edit({
          id: rowEntity._id
        }, rowEntity);
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, dataRecord.$promise);
      };

      /**
       * Certain listeners are loaded during the registration of the table.
       * These are used in various contexts (edit events and row selection
       * events et al).  Others can be defined from this location and is setup
       * against the specified grid.
       */
      $scope.dataGridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        gridApi.edit.on.afterCellEdit($scope, $scope.lookupEditor);
        gridApi.selection.on.rowSelectionChanged($scope, $scope.rowSelected);
      };

      /**
       * Upon selecting a row the side nav is toggled and displays further
       * information about the selected record.
       */
      $scope.selectedRow = {};
      $scope.rowSelected = function(row) {
        if (row.isSelected) {
          $scope.openSideNav();
          $scope.selectedRow = row;
        } else {
          $scope.closeSideNav();
          $scope.selectedRow = {};
        }
      };


      /**
       * Originally intended for the uploading of inventory information - 
       * this is not used and I opted for using the default uploader information
       * present on the grid.
       */
      $scope.startUploader = function() {
        $location.path("/uploadbatch/inventory/" + $scope.selectedInventory);
      }

      /**
       * Run this function if there exists an ID within the URL for Inventory
      **/
      if ($routeParams.id) {
        $scope.selectedInventory = $routeParams.id;
        $scope.filtered();
      }

      if($routeParams.se) {
        $scope.selectedSector = $routeParams.se;
        $scope.filtered();
      }

      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildToggler(navID) {
        return function() {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav(navID).toggle();
        };
      }

      /**
       * For each defined cell it attempts to lookup and perform exact match on imported information
       * An example of this is category.  If the script finds "Cement Production" it then looks for 
       * and exact match of this within the category listing.  After finding the listing it replaces 
       * the name with the object and it's information.
       * 
       * This is highly resource intensive but it run on the frontend of the application and not
       * server-side.  The loop can be optimized.
       */
      runMatchProcess = function(importedObjects, callback) {
        for(var i =0; i < importedObjects.length; i++) {
          importedObjects[i].in_inventory = $scope.selectedInventory;
          importedObjects[i].da_uncertainty_min = parseFloat(importedObjects[i].da_uncertainty_min);
          importedObjects[i].da_uncertainty_max = parseFloat(importedObjects[i].da_uncertainty_max);
          // by default since the date is not complete - I am specifying that the date be set to the 
          // first month first day.
          importedObjects[i].da_date = new Date(importedObjects[i].da_date, 1, 1, 0, 0, 0, 0);
          for(var a=0; a < $scope.categories.length; a++) {
            if(importedObjects[i]["ca_category.ca_code_name"].toLowerCase() == $scope.categories[a].ca_code_name.toLowerCase()) {
              importedObjects[i].ca_category = $scope.categories[a];
            }
          }
          for(var a=0; a < $scope.activities.length; a++) {
            if(importedObjects[i]["ac_activity.ac_name"] == $scope.activities[a].ac_name) {
              importedObjects[i].ac_activity = $scope.activities[a];
            }
          }
          for(var a=0; a < $scope.units.length; a++) {
            if(importedObjects[i]["un_unit.un_unit_symbol"] == $scope.units[a].un_unit_symbol) {
              importedObjects[i].un_unit = $scope.units[a];
            }
          }
          for(var a=0; a < $scope.gases.length; a++) {
            if(importedObjects[i]["ga_gas.ga_chem_formula"] == $scope.gases[a].ga_chem_formula) {
              importedObjects[i].ga_gas = $scope.gases[a];
            }
          }

          //TODO: should abstract check to an isEmpty like function
          if(importedObjects[i]["nk_notation_key"] !== '' && importedObjects[i]["nk_notation_key"] !== undefined) {
            for(var a=0; a < $scope.notation_keys.length; a++) {
              if(importedObjects[i]["nk_notation_key"].toLowerCase() == $scope.notation_keys[a].nk_name.toLowerCase()) {
                importedObjects[i].nk_notation_key = $scope.notation_keys[a];
              }
            }
          }
        }
        callback(importedObjects);
      };

    }
  ]);
