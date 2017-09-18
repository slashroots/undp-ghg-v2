/**
 * Region related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('RegionController', ['$scope', '$location', '$routeParams', 'UserFactory', 'RegionFactory',
    function($scope, $location, $routeParams, UserFactory, RegionFactory) {

      /**
       * Default states
       **/
      $scope.region = {};

      if ($routeParams.id) {
        //query and populate $scope.region
        RegionFactory.get({
          id: $routeParams.id
        }, function(region) {
          $scope.region = region;
        }, function(error) {
          alert(error.statusText);
        });
      }

      $scope.closeAndBack = function() {
        $location.path("/settings/9");
      };

      /**
        * Used to modify or add a gas in the databse.
        */
      $scope.addRegion = function() {
        if ($routeParams.id) {
          RegionFactory.edit({
            id: $routeParams.id
          }, $scope.region, function(res) {
            alert("Modified " + $scope.region.re_region_name + "!");
            $location.path("/settings/9");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          RegionFactory.create($scope.region, function(res) {
            alert("Added " + $scope.region.re_region_name + "!");
            $location.path("/settings/9");
          }, function(error) {
            alert("Error: " + error.statusText);
          });
        }
      }
    }
  ]);
