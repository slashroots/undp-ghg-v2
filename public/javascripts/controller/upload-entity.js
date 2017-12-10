angular.module('undp-ghg-v2')
  .controller('UploadController', ['$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory', 'SupportingFilesFactory', 'Upload',
    function($scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory, SupportingFilesFactory, Upload) {

        // models
        angular.extend($scope, {
            'selectedInventory': $routeParams.id,
            'selectedSector': $routeParams.se,
            'files': [],
            'supporting_files': SupportingFilesFactory.query({
                "in_inventory": $routeParams.id,
                "ca_category": $routeParams.se})
        });

        //functions
        angular.extend($scope, {
            'selectedFiles': function($files) {
                $scope.files = $files;
            },
            'uploadFiles': function() {
                Upload.upload({
                  url: '/api/supportingfiles',
                  data: {
                    files: $scope.files,
                    data: {
                        in_inventory: $scope.selectedInventory,
                        ca_category: $scope.selectedSector,
                        description: ''
                    }
                  },
                }).then(function (response) {
                    $scope.files = [];
                    $scope.supporting_files.push(response.data);
                });
            }
        });

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
            $location.path("/data/" + $routeParams.id + "/" + $routeParams.se);
          }
        }

      }
    ]
  );
