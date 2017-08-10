/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('InventoryController', ['$scope', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    function($scope, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory) {

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


      //setup the tables
      $scope.unitGridOptions = {
        data: 'units',
        columnDefs: [{
            field: 'un_unit_name',
            displayName: 'Unit Name'
          },
          {
            field: 'un_unit_symbol',
            displayName: 'Unit Symbol'
          }
        ]
      };
      $scope.inventoryGridOptions = {
        data: 'inventories',
        columnDefs: [{
            field: 'in_name',
            displayName: 'Inventory Name'
          },
          {
            field: 'in_start_date',
            displayName: 'Start Date',
            cellFilter: "date: 'longDate'"
          },
          {
            field: 'in_end_date',
            displayName: 'End Date',
            cellFilter: "date: 'longDate'"
          },
          {
            field: 'in_status',
            displayName: 'Inventory Status',
            cellFilter: 'uppercase'
          }
        ]
      };
      $scope.userGridOptions = {
        data: 'users',
        columnDefs: [{
            field: 'us_user_first_name',
            displayName: 'First Name'
          },
          {
            field: 'us_user_last_name',
            displayName: 'Last Name'
          },
          {
            field: 'us_email_address',
            displayName: 'Email'
          },
          {
            field: 'us_user_role',
            displayName: 'Role',
            cellFilter: "uppercase"
          },
          {
            field: 'us_state',
            displayName: 'State',
            cellFilter: 'uppercase'
          }
        ]
      };

      $scope.sectorGridOptions = {
        data: 'sectors',
        columnDefs: [{
            field: 'se_name_short_code',
            displayName: 'Sector Code'
          },
          {
            field: 'se_name',
            displayName: 'Sector Name'
          },
          {
            field: 'se_description',
            displayName: 'Description'
          }
        ]
      };

      $scope.gasGridOptions = {
        data: 'gases',
        columnDefs: [{
            field: '_id',
            displayName: 'ID'
          },
          {
            field: 'ga_gas_name',
            displayName: 'Gas Name'
          },
          {
            field: 'ga_chem_formula',
            displayName: 'Chemical Formula'
          },
          {
            field: 'ga_gas_gwp',
            displayName: 'Global Warming Potential (100)'
          }
        ]
      };

      $scope.activityGridOptions = {
        data: 'activities',
        columnDefs: [{
            field: 'ac_name',
            displayName: 'Activity Name'
          },
          {
            field: 'ac_info_source',
            displayName: 'Information Source'
          },
          {
            field: 'ca_category.ca_code',
            displayName: 'Category Code'
          },
          {
            field: 'se_sector.se_name',
            displayName: 'Sector'
          }
        ]
      };

      $scope.categoryGridOptions = {
        data: 'categories',
        columnDefs: [{
            field: 'ca_code',
            displayName: 'Category Code'
          },
          {
            field: 'se_sector.se_name_short_code',
            displayName: 'Sector'
          },
          {
            field: 'ca_code_name',
            displayName: 'Category Code Name'
          },
          {
            field: 'ca_code_definition',
            displayName: 'Definition'
          }
        ]
      };

      /**
       * Data Factories
       **/
      UserFactory.get(function(user) {
        $scope.user = user;
        if ($scope.tab == 5) {
          if (user.us_user_role == 'admin') {
            AdminUserFactory.query(function(users) {
              $scope.users = users;
            });
          }
        }
      });

      if ($scope.tab == 1) {
        CategoryFactory.query(function(categories) {
          $scope.categories = categories;
        });
      }

      if ($scope.tab == 3) {
        GasFactory.query(function(gases) {
          $scope.gases = gases;
        });
      }

      if ($scope.tab == 4) {
        SectorFactory.query(function(sectors) {
          $scope.sectors = sectors;
        });
      }

      if ($scope.tab == 6) {
        InventoryFactory.query(function(inventories) {
          $scope.inventories = inventories;
        });
      }

      if ($scope.tab == 2) {
        ActivityFactory.query(function(activities) {
          $scope.activities = activities;
        });
      }

      if ($scope.tab == 7) {
        UnitFactory.query(function(units) {
          $scope.units = units;
        });
      }

      $scope.save = function() {
        InventoryFactory.create($scope.inventory, function(inventory) {
          if (inventory) {
            alert("Inventory " + $scope.inventory.in_name + " has been added!");
            $location.path('/settings/6');
          }
        })
      }
    }
  ]);
