/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('DataController', ['$mdSidenav', '$scope', '$route', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory', 'NotationKeyFactory', 'RegionFactory', 'uiGridConstants',
    function ($mdSidenav, $scope, $route, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory, NotationKeyFactory, RegionFactory,
      uiGridConstants) {

      $scope.reference_issue = [];
      $scope.sectors = [];

      /**
       * Run this function if there exists an ID within the URL for Inventory
      **/
      if ($routeParams.id) {
        $scope.selectedInventory = $routeParams.id;
      }

      if ($routeParams.se) {
        $scope.selectedSector = $routeParams.se;
      }

      /**
       * Setup the sidebar
       * @param {*} type 
       */
      $scope.sidebarPartial = function (type) {
        if (type === 'notes') {
          $scope.selected_sidebar = "notes";
          $scope.selected_sidebar_partial = "/partials/inventory/data-inventory-notes.html";
        } else if (type === 'issues') {
          $scope.selected_sidebar = "issues";
          $scope.selected_sidebar_partial = "/partials/inventory/data-inventory-issues.html";
        }
      }
      $scope.sidebarPartial('notes');

      // replace existing record with new record and remove conflict
      $scope.saveNewRecord = function () {
        $scope.selectedRow = $scope.selectedRow.conflict;
      }

      // keep existing record and remove conflict
      $scope.keepOldRecord = function () {
        delete $scope.selectedRow.conflict;
        for (var i = 0; i < $scope.selectedRow.issues.length; i++) {
          if ($scope.selectedRow.issues[i].type === 'overwrite') {
            $scope.selectedRow.isConflictExists = false;
            $scope.selectedRow.issues.splice(i, 1);
            break;
          }
        }
      }


      //construct modal side nav menu
      $scope.toggleRight = buildToggler('right');
      $scope.openSideNav = function () {
        $mdSidenav('right').open();
      }
      $scope.closeSideNav = function () {

        $mdSidenav('right').close();
      }

      /**
       * Event to be fired based on the selection of a sector.
       */
      $scope.sectorChanged = function () {
        $location.path('data/' + $scope.selectedInventory + "/" + $scope.selectedSector);
      }

      //Used to import data.  Need to perform Validation on the information!
      newDataImporter = function (grid, newObjects) {
        //run only if there is a selected inventory.
        if ($scope.selectedInventory) {
          runMatchProcess(newObjects, function (matchedItems) {
            $scope.dataValues = $scope.dataValues.concat(newObjects);
            $scope.dirtyRowsExist = true;
          });
        } else {
          alert("Please select an inventory!");
        }
      };

      //triggers a save event to flush all the modified rows to the databse.
      $scope.persist = function () {
        if ($scope.editable) {
          $scope.gridApi.rowEdit.flushDirtyRows();
          $scope.dirtyRowsExist = false;
        } else {
          alert("Unable to save changes.  The inventory is closed!");
        }
      }

      //triggers a save event to flush all the modified rows to the databse.
      $scope.discard = function () {
        if ($scope.editable) {
          $route.reload();
        } else {
          alert("The inventory is closed!");
        }
      }

      /**
       * Loading all information for later matching.
       * We should probably only run this when necessary - nice to have.
       **/
      $scope.inventories = InventoryFactory.query();
      $scope.units = UnitFactory.query();
      $scope.gases = GasFactory.query();
      $scope.activities = ActivityFactory.query();
      $scope.notation_keys = NotationKeyFactory.query({ nk_is_enabled: true });
      $scope.regions = RegionFactory.query();
      $scope.categories = CategoryFactory.query({
        se_sector: $scope.selectedSector
      });
      $scope.variable_types = [
        {
          variableType: 'EF'
        },
        {
          variableType: 'AD'
        }
      ]

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
          cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            isDataValid(row.entity);
            if (!row.entity.isValid || row.entity.isConflictExists)
              return 'table-error-indicator';
          },
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
          editDropdownOptionsArray: $scope.variable_types
        },
        {
          field: 'ca_category.ca_code_name',
          displayName: 'Category Name',
          enableCellEdit: $scope.editable,
          cellTooltip: function (row, col) {
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
          field: 'nk_notation_object.nk_name',
          displayName: 'NK',
          enableCellEdit: $scope.editable,
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownValueLabel: 'nk_name',
          editDropdownIdLabel: 'nk_name',
          editDropdownOptionsArray: $scope.notation_keys,
          width: 200
        },
        {
          field: 'region_object.re_region_name',
          displayName: 'Region',
          enableCellEdit: $scope.editable,
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownValueLabel: 're_region_name',
          editDropdownIdLabel: 're_region_name',
          editDropdownOptionsArray: $scope.regions,
          width: 200
        },
        {
          field: 'notes',
          displayName: 'Notes',
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

      $scope.setTab = function (newTab) {
        $location.path("settings/" + newTab);
      };
      $scope.isSet = function (tabNum) {
        return $scope.tab == tabNum;
      };


      //when user selects the inventory to 
      //manipulate this function is run:
      $scope.inventoryChanged = function () {
        UserFactory.get({}, function (user) {
          $scope.sectors = user.us_sector_permissions;
        });
      };

      $scope.filtered = function () {
        if ($routeParams.id) {
          InventoryFactory.get({
            id: $scope.selectedInventory
          }, function (item) {
            if (item.in_status == 'opened') {
              $scope.editable = true;
            } else {
              $scope.editable = false;
            }
            $scope.dataGridOptions.exporterCsvFilename = item.in_name + '.csv';
          });
          $scope.inventoryChanged();
        }

        //lookup based on filter applied
        if ($routeParams.se) {
          DataFactory.query({
            in_inventory: $scope.selectedInventory,
            se_sector: $scope.selectedSector
          }, function (dataValues) {
            if (dataValues) {
              $scope.isAvailable = true;
            }
            $scope.dataValues = dataValues;
          },
            function (error) {
              $scope.isAvailable = false;
            });
        }
      }
      $scope.filtered();


      /*
      Based on the selected item from the combobox replace with the server side
      values for the save record script that gets called.
      */
      //TODO: these should intelligently use local copies where possible instead of searching on each lookup
      $scope.lookupEditor = function (rowEntity, columnDef, newValue, oldValue) {
        if ($scope.gridApi.rowEdit.getDirtyRows() > 0) {
          console.log($scope.gridApi.rowEdit.getDirtyRows().length);
          $scope.dirtyRowsExist = true;
        }
        if (newValue != oldValue) {
          if (columnDef.field == 'ca_category.ca_code_name') {
            CategoryFactory.get({
              id: rowEntity.ca_category.ca_code_name
            },
              function (item) {
                rowEntity.ca_category = item;
              });
          } else if (columnDef.field == 'ac_activity.ac_name') {
            ActivityFactory.get({
              id: rowEntity.ac_activity.ac_name
            },
              function (item) {
                rowEntity.ac_activity = item;
              });
          } else if (columnDef.field == 'un_unit.un_unit_symbol') {
            UnitFactory.get({
              id: rowEntity.un_unit.un_unit_symbol
            },
              function (item) {
                rowEntity.un_unit = item;
              });
          } else if (columnDef.field == 'ga_gas.ga_gas_name') {
            GasFactory.get({
              id: rowEntity.ga_gas.ga_gas_name
            },
              function (item) {
                rowEntity.ga_gas = item;
              });
          } else if (columnDef.field == 'nk_notation_object.nk_name') {
            NotationKeyFactory.query({
              nk_name: rowEntity.nk_notation_object.nk_name
            },
              function (items) {
                if (items.length > 0)
                  rowEntity.nk_notation_object = items[0];
              });
          } else if (columnDef.field == 'region_object.re_region_name') {
            RegionFactory.query({
              nk_name: rowEntity.region_object.re_region_name
            },
              function (items) {
                if (items.length > 0)
                  rowEntity.region_object = items[0];
              });
          }
        }
      };

      /**
       * Typically the application can be setup to flush dirty rows by attempting to 
       * save the record to the server.  This however is deferred until the user 
       * selects the Persist to database button.
       */
      $scope.saveRow = function (rowEntity) {
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
      $scope.dataGridOptions.onRegisterApi = function (gridApi) {
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
      $scope.rowSelected = function (row) {
        if (row.isSelected) {
          $scope.openSideNav();
          $scope.selectedRow = angular.copy(row.entity);

          //if the selected item has issues open the 
          //tab by default.
          if ($scope.selectedRow.issues.length > 0) {
            $scope.sidebarPartial('issues');
          } else {
            $scope.sidebarPartial('notes');
          }
        } else {
          //if there are changes, flag for persist button
          if (!angular.equals(row.entity, $scope.selectedRow)) {
            $scope.selectedRow.isValid = true;
            row.entity = $scope.selectedRow;
            $scope.gridApi.rowEdit.setRowsDirty([row.entity]);
            $scope.dirtyRowsExist = true;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
          }
          $scope.closeSideNav();
          $scope.selectedRow = {};
        }
      };


      /**
       * Originally intended for the uploading of inventory information - 
       * this is not used and I opted for using the default uploader information
       * present on the grid.
       */
      $scope.startUploader = function () {
        $location.path("/uploadbatch/inventory/" + $scope.selectedInventory + "/" + $scope.selectedSector);
      }

      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildToggler(navID) {
        return function () {
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
      runMatchProcess = function (importedObjects, callback) {
        var issue_list = [];

        /*
            TODO: maintaining yet another list is not the most efficient way to import.
            Values to be imported could be appended directly to dataValues.
        */
        var tmpImported = [];

        for (var i = 0; i < importedObjects.length; i++) {
          importedObjects[i].in_inventory = $scope.selectedInventory;
          importedObjects[i].se_sector = $scope.selectedSector;
          importedObjects[i].da_data_value = parseFloat(importedObjects[i].da_data_value);
          importedObjects[i].da_uncertainty_min = parseFloat(importedObjects[i].da_uncertainty_min);
          importedObjects[i].da_uncertainty_max = parseFloat(importedObjects[i].da_uncertainty_max);
          // by default since the date is not complete - I am specifying that the date be set to the 
          // first month first day.
          importedObjects[i].da_date = new Date(importedObjects[i].da_date, 1, 1, 0, 0, 0, 0);
          for (var a = 0; a < $scope.categories.length; a++) {
            if (importedObjects[i]["ca_category.ca_code_name"].toLowerCase().trim() == $scope.categories[a].ca_code_name.toLowerCase().trim()) {
              importedObjects[i].ca_category = $scope.categories[a];
            }
          }
          /**
           * TODO: there must be a nice cleaner way of recording that no matches have been found.
           * THis isn't clean enough and should be changed eventually.
           */
          if (!hasProperty(importedObjects[i].ca_category, "_id")) {
            issue_list.push(createIssue("Category",
              "Unable to find match for '" + importedObjects[i]["ca_category.ca_code_name"] + "'",
              importedObjects[i]["ca_category.ca_code_name"], "mismatch"));
          }
          for (var a = 0; a < $scope.activities.length; a++) {
            if (importedObjects[i]["ac_activity.ac_name"].toLowerCase().trim() == $scope.activities[a].ac_name.toLowerCase().trim()) {
              importedObjects[i].ac_activity = $scope.activities[a];
            }
          }
          if (!hasProperty(importedObjects[i].ac_activity, "_id")) {
            issue_list.push(createIssue("Activity",
              "Unable to find match for " + importedObjects[i]["ac_activity.ac_name"],
              importedObjects[i]["ac_activity.ac_name"], "mismatch"));
          }
          for (var a = 0; a < $scope.units.length; a++) {
            if (importedObjects[i]["un_unit.un_unit_symbol"] == $scope.units[a].un_unit_symbol) {
              importedObjects[i].un_unit = $scope.units[a];
            }
          }
          if (!hasProperty(importedObjects[i].un_unit, "_id")) {
            issue_list.push(createIssue("Unit",
              "Unable to find match for " + importedObjects[i]["un_unit.un_unit_symbol"],
              importedObjects[i]["un_unit.un_unit_symbol"], "mismatch"));
          }
          for (var a = 0; a < $scope.gases.length; a++) {
            if (importedObjects[i]["ga_gas.ga_chem_formula"] == $scope.gases[a].ga_chem_formula) {
              importedObjects[i].ga_gas = $scope.gases[a];
            }
          }
          if (!hasProperty(importedObjects[i].ga_gas, "_id")) {
            //if this is activity data - it isn't an issue!
            if (importedObjects[i].da_variable_type === 'EF') {
              issue_list.push(createIssue("Gas",
                "Unable to find match for " + importedObjects[i]["ga_gas.ga_chem_formula"],
                importedObjects[i]["ga_gas.ga_chem_formula"], "mismatch"));
            }
          }

          //TODO: should abstract check to an isEmpty like function
          if (importedObjects[i]["nk_notation_object.nk_name"] !== '' && importedObjects[i]["nk_notation_object.nk_name"] !== undefined) {
            for (var a = 0; a < $scope.notation_keys.length; a++) {
              if (importedObjects[i]["nk_notation_object.nk_name"].toLowerCase() == $scope.notation_keys[a].nk_name.toLowerCase()) {
                importedObjects[i].nk_notation_object = $scope.notation_keys[a];
              }
            }
          }

          if (importedObjects[i]["region_object.re_region_name"] !== '' && importedObjects[i]["region_object.re_region_name"] !== undefined) {
            for (var a = 0; a < $scope.regions.length; a++) {
              if (importedObjects[i]["region_object.re_region_name"].toLowerCase() == $scope.regions[a].re_region_name.toLowerCase()) {
                importedObjects[i].region_object = $scope.regions[a];
              }
            }
          }
          if (!hasProperty(importedObjects[i].region_object, "_id")) {
            issue_list.push(createIssue("Region",
              "Unable to find match for " + importedObjects[i]["region_object.re_region_name"],
              importedObjects[i]["region_object.re_region_name"], "mismatch"));
          }

          //TODO: I haven't done any association with the issue lists and the records at fault.
          if (issue_list.length > 0) {
            importedObjects[i].issues = issue_list;
            issue_list = [];
          }

          importedObjects[i].isValid = false;

          /*
            if the current object being imported does not conflict with a previously stored record,
            store it for display
          */
          if (!isConflictExists(importedObjects[i])) {
            tmpImported.push(importedObjects[i]);
          }
        }
        callback(tmpImported);
      };

      function isDataValid(data) {
        data.isValid = data.ca_category != undefined && data.ac_activity != undefined;
      }

      /**
       * create and issue object for adding to the row object
       * @param {*} issue_name 
       * @param {*} description 
       * @param {*} problem 
       * @param {*} type 
       */
      function createIssue(issue_name, description, problem, type) {
        var issue_object = {};
        issue_object.name = issue_name
        issue_object.description = description; //
        issue_object.problem = problem; //importedObjects[i]["ca_category.ca_code_name"];
        issue_object.type = type; //"mismatch";
        return issue_object;
      }

      /**
       * Search for possible name matches for items. Uses fuzzy string
       * search to find nearest options for displaying to the user.
       */
      var fuseKeys = {
        'Category': {
          'keys': ['ca_code_name', 'ca_code'],
          'data': $scope.categories
        },
        'Activity': {
          'keys': ['ac_name', 'ac_description'],
          'data': $scope.activities
        },
        'Unit': {
          'keys': ['un_unit_name'],
          'data': $scope.units
        },
        'Gas': {
          'keys': ['ga_gas_name'],
          'data': $scope.gases
        },
        'Region': {
          'keys': ['re_region_name', 're_region_desc'],
          'data': $scope.regions
        }
      };
      $scope.possibleMatches = function (category_name, type) {
        var options = {
          keys: fuseKeys[type]['keys']
        };
        var fuse = new Fuse(fuseKeys[type]['data'], options);
        return fuse.search(category_name);
      }

      /**
       * Attempt to set the category of the selected
       * record
       * @param {*} type
       * @param {*} match
       * @param {*} row 
       * @param {*} index
       */
      $scope.setMatch = function (type, match, row, index) {
        if (type === 'Category') {
          row.ca_category = match;
        } else if (type === 'Activity') {
          row.ac_activity = match;
        } else if (type === 'Unit') {
          row.un_unit = match;
        } else if (type === 'Gas') {
          row.ga_gas = match;
        }

        $scope.selectedRow.issues.splice(index, 1);
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
       * Listener to stop user from inadvertedly leaving page.
       */
      $scope.$on('$locationChangeStart', function (event) {
        if($scope.dirtyRowsExist) {
          var answer = confirm("Are you sure you want to leave this page?")
          if (!answer) {
            event.preventDefault();
          }
        }
      });


      /*
        checks if imported object is overwriting a previously saved object. If an object is
        being overwritten the new object is appending to the previously saved object.
      */
      function isConflictExists(data) {
        for (var i = 0; i < $scope.dataValues.length; i++) {
          if (objPathEqual($scope.dataValues[i], data, "da_variable_type") &&
            objPathEqual($scope.dataValues[i], data, "ac_activity._id") &&
            objPathEqual($scope.dataValues[i], data, "ca_category._id") &&
            new Date($scope.dataValues[i].da_date).getFullYear() === new Date(data.da_date).getFullYear()) {
            $scope.dataValues[i].isConflictExists = true;
            $scope.dataValues[i].conflict = data;

            // add overwrite issue to the objects issue list
            $scope.dataValues[i].issues.push(createIssue("Record",
              'This record will be overwritten by an imported record',
              '', 'overwrite'));
            return true;
          }
        }
        return false;
      }

      //TODO: helper functions should be moved to an appropriate package
      // helper function to check of the path value of two objects are the same
      function objPathEqual(obj1, obj2, path) {
        return objPathExists(obj1, path) === objPathExists(obj2, path);
      }

      // helper function to do a deep path check on object.
      function objPathExists(obj, path) {
        var paths = path.split('.'),
          current = obj,
          i;

        for (i = 0; i < paths.length; ++i) {
          if (current[paths[i]] == undefined) {
            return -1;
          } else {
            current = current[paths[i]];
          }
        }
        return current;
      }

    }
  ]);
