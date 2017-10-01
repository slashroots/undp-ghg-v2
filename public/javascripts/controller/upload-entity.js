angular.module('undp-ghg-v2')
  .controller('UploadController', ['$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory',
    function($scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory) {

        if($routeParams.entity == 'inventory') {
          InventoryFactory.get({
            id: $routeParams.id
          }, function(inventory) {
            $scope.inventory = inventory;
            $scope.title = inventory.in_inventory_desc;
          });
        }

        $scope.closeAndBack = function() {
          if($routeParams.entity == 'inventory') {
            $location.path("/data/" + $routeParams.id);
          }
        }

      }
    ]
  );
