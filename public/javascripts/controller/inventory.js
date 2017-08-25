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
      $scope.tab = 4;
      if ($routeParams.id) {
        $scope.tab = $routeParams.id;
      }

      $scope.setTab = function(newTab) {
        $location.path("settings/" + newTab);
      };
      $scope.isSet = function(tabNum) {
        return $scope.tab == tabNum;
      };

      //Global edit function.  Directs to the relevant dialog.
      $scope.edit = function(id) {
        switch($scope.tab) {
          case '1': $location.path("edit/category/" + id); break;
          case '2': $location.path("edit/activity/" + id); break;
          case '3': $location.path("edit/gas/" + id); break;
          case '4': $location.path("edit/sector/" + id); break;
          case '5': $location.path("edit/user/" + id); break;
          case '6': break;
          case '7': $location.path("edit/unit/" + id); break;
          default: break;
        }
      };

      //setup the tables
      $scope.unitGridOptions = {
        data: 'units',
        enableRowSelection: true,
        columnDefs: [{
            field: 'un_unit_name',
            displayName: 'Unit Name'
          },
          {
            field: 'un_unit_symbol',
            displayName: 'Unit Symbol'
          },
          {
            field: '_id',
            displayName: '',
            width: 100,
            cellTemplate: "/partials/components/edit-button.html"
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
          },
          {
            field: '_id',
            displayName: '',
            width: 100,
            cellTemplate: "/partials/components/edit-button.html"
          }
        ]
      };

      $scope.sectorGridOptions = {
        data: 'sectors',
        columnDefs: [{
            field: 'se_name_short_code',
            displayName: 'Sector Code',
            width: 150,
          },
          {
            field: 'se_name',
            displayName: 'Sector Name',
            width: 250,
          },
          {
            field: 'se_description',
            displayName: 'Description'
          },
          {
            field: '_id',
            displayName: '',
            width: 100,
            cellTemplate: "/partials/components/edit-button.html"
          }
        ]
      };

      $scope.gasGridOptions = {
        data: 'gases',
        columnDefs: [{
            field: '_id',
            displayName: 'ID',
            width: 100,
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
          },
          {
            field: '_id',
            displayName: '',
            width: 100,
            cellTemplate: "/partials/components/edit-button.html"
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
            displayName: 'Category Code',
            width: 200,
          },
          {
            field: 'se_sector.se_name',
            displayName: 'Sector'
          },
          {
            field: '_id',
            displayName: '',
            width: 100,
            cellTemplate: "/partials/components/edit-button.html"
          }
        ]
      };

      $scope.categoryGridOptions = {
        data: 'categories',
        columnDefs: [{
            field: 'ca_code',
            displayName: 'Category Code',
            width: 200,
          },
          {
            field: 'se_sector.se_name_short_code',
            displayName: 'Sector',
            width: 200,
          },
          {
            field: 'ca_code_name',
            displayName: 'Category Code Name'
          },
          {
            field: 'ca_code_definition',
            displayName: 'Definition'
          },
          {
            field: '_id',
            displayName: '',
            width: 100,
            cellTemplate: "/partials/components/edit-button.html"
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


      /**
        * If the tab is selected then load the relevant data.
        */
      switch($scope.tab) {
        case '1':
        CategoryFactory.query(function(categories) {
          $scope.categories = categories;
        }); break;
        case '2':
        ActivityFactory.query(function(activities) {
          $scope.activities = activities;
        });
        case '3':
        GasFactory.query(function(gases) {
          $scope.gases = gases;
        }); break;
        case '4':
        SectorFactory.query(function(sectors) {
          $scope.sectors = sectors;
        }); break;
        case '6':
        InventoryFactory.query(function(inventories) {
          $scope.inventories = inventories;
        }); break;
        case '7':
        UnitFactory.query(function(units) {
          $scope.units = units;
        }); break;
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
