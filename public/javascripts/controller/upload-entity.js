angular.module('undp-ghg-v2')
  .controller('UploadController', ['$scope', '$q', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    'CategoryFactory', 'GasFactory', 'AdminUserFactory', 'InventoryFactory', 'ActivityFactory', 'UnitFactory',
    'DataFactory', 'SupportingFilesFactory', 'Upload',
    function($scope, $q, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, GasFactory,
      AdminUserFactory, InventoryFactory, ActivityFactory, UnitFactory, DataFactory, SupportingFilesFactory, Upload) {

        var e_supportfile_object = {
            'in_inventory': $routeParams.id,
            'se_sector': $routeParams.se,
            'description': ''
        }

        // models
        angular.extend($scope, {
            'supportfile_object': angular.copy(e_supportfile_object),
            'files': [],
            'supporting_files': SupportingFilesFactory.query({
                "in_inventory": $routeParams.id,
                "se_sector": $routeParams.se})
        });

        /**
         * Grab sector and make available for front-end
         */
        SectorFactory.get({id: $routeParams.se}, function(sector) {
          $scope.sector = sector;
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
                    data: $scope.supportfile_object
                  },
                }).then(function (response) {
                    $scope.files = [];
                    $scope.supporting_files.push(response.data);
                    $scope.supportfile_object = angular.copy(e_supportfile_object);
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
