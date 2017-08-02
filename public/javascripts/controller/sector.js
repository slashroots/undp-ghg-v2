/**
 * Sector related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('SectorController', ['$scope', '$location', '$routeParams', 'UserFactory', 'SectorFactory',
    function($scope, $location, $routeParams, UserFactory, SectorFactory) {

      /**
       * Default states
       **/
      $scope.sector = {};
      $scope.sector.se_name = "";
      $scope.sector.se_description = "";
      $scope.sector.se_name_short_code = "";
      $scope.sector.us_user = "";

      if ($routeParams.id) {
        //query and populate $scope.sector
        SectorFactory.get({
          id: $routeParams.id
        }, function(sector) {
          $scope.sector = sector;
        }, function(error) {
          alert(error.statusText);
        });
      }
      UserFactory.get(function(user) {
        $scope.user = user;
      });

      $scope.closeAndBack = function() {
        window.history.back();
      };

      /**
        * Used to modify or add a sector in the databse.
        */
      $scope.addSector = function() {
        if ($routeParams.id) {
          $scope.sector.us_user = $scope.user["_id"];
          SectorFactory.edit({
            id: $routeParams.id
          }, $scope.sector, function(res) {
            alert("Modified " + $scope.sector.se_name + "!");
            $location.path("/settings");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          $scope.sector.us_user = $scope.user["_id"];
          SectorFactory.create($scope.sector, function(res) {
            alert("Added " + $scope.sector.se_name + " !");
            $location.path("/settings");
          }, function(error) {
            alert("Error: " + error.statusText);
          });
        }
      }
    }
  ]);
