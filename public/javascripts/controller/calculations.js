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
    $scope.isAvailable = false;

    //when user selects the inventory to manipulate this function is run:
    $scope.inventoryChanged = function() {
      $scope.sectors = SectorFactory.query();
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
    $scope.units = UnitFactory.query();
    $scope.gases = GasFactory.query();
    $scope.activities = ActivityFactory.query();
    $scope.notation_keys = NotationKeyFactory.query({nk_is_enabled: true});
    $scope.regions = RegionFactory.query();
    $scope.variable_types = [
      {
        variableType: 'EF'
      },
      {
        variableType: 'AD'
      }
    ];

    //setting up the table structure and configurations.
    $scope.editable = true;
    $scope.dirtyRowsExist = false;
    $scope.dataGridOptions = {
      enableFiltering: true,
      enableCellEditOnFocus: true,
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
      data: 'dataValues',
      columnDefs: [
        {
          field: 'ca_category.ca_code_name',
          displayName: 'Category Name',
          enableCellEdit: false,
          cellTooltip: function(row, col) {
            if (row.entity.ca_category) {
              return 'Code: ' + row.entity.ca_category.ca_code +
                ' Name: ' + row.entity.ca_category.ca_code_name;
            } else {
              return '';
            }
          },
          width: 200
        },
        {
          field: 'ac_activity.ac_name',
          displayName: 'Activity',
          enableCellEdit: false,
          width: 200
        },
        {
          field: 'ga_gas.ga_chem_formula',
          displayName: 'Assoc. Gas',
          enableCellEdit: false,
          width: 200
        },
        {
          field: 'va_value',
          displayName: 'Value',
          width: 200
        },
        {
          field: 'un_unit.un_unit_symbol',
          displayName: 'Unit',
          enableCellEdit: false,
          width: 200
        },
        {
          field: 'da_uncertainty_min',
          displayName: 'Uncertainty (min)',
          enableCellEdit: false,
          width: 200
        },
        {
          field: 'da_uncertainty_max',
          displayName: 'Uncertainty (max)',
          enableCellEdit: false,
          width: 200
        },
        {
          field: 'da_date',
          displayName: 'Year',
          enableCellEdit: false,
          cellFilter: "date: 'yyyy'",
          width: 200,
          type: 'date'
        }
      ]
    };

    $scope.filtered = function() {
      InventoryFactory.get({
        id: $scope.selectedInventory
      }, function(item) {
        if (item.in_status == 'opened') {
          $scope.editable = true;
        } else {
          $scope.editable = false;
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

    /**
     * Retrieve all the Emission Factors for the given parameters
     * @param {*} inventory 
     * @param {*} sector 
     */
    $scope.getAllEF = function(inventory, sector) {

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

  }
]);
