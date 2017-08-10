/**
 * Unit related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('UnitController', ['$scope', '$location', '$routeParams', 'UserFactory', 'UnitFactory',
    function($scope, $location, $routeParams, UserFactory, UnitFactory) {

      /**
       * Default states
       **/
      $scope.unit = {};

      if ($routeParams.id) {
        //query and populate $scope.unit
        UnitFactory.get({
          id: $routeParams.id
        }, function(unit) {
          $scope.unit = unit;
        }, function(error) {
          alert(error.statusText);
        });
      }

      $scope.closeAndBack = function() {
        $location.path("/settings/7");
      };

      /**
        * Used to modify or add a gas in the databse.
        */
      $scope.addUnit = function() {
        if ($routeParams.id) {
          UnitFactory.edit({
            id: $routeParams.id
          }, $scope.unit, function(res) {
            alert("Modified " + $scope.unit.un_unit_name + "!");
            $location.path("/settings/7");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          UnitFactory.create($scope.unit, function(res) {
            alert("Added " + $scope.unit.un_unit_name + "!");
            $location.path("/settings/7");
          }, function(error) {
            alert("Error: " + error.statusText);
          });
        }
      }
    }
  ]);
