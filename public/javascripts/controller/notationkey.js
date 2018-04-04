/**
 * Notation Key related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('NotationKeyController', ['$scope', '$location', '$routeParams', 'UserFactory', 'NotationKeyFactory',
    function($scope, $location, $routeParams, UserFactory, NotationKeyFactory) {

      /**
       * Default states
       **/
      $scope.notationKey = {};

      if ($routeParams.id) {
        //query and populate $scope.region
        NotationKeyFactory.get({
          id: $routeParams.id
        }, function(notationkey) {
          $scope.notationKey = notationkey;
        }, function(error) {
          alert(error.statusText);
        });
      }

      $scope.closeAndBack = function() {
        $location.path("/settings/8");
      };

      /**
        * Used to modify or add a gas in the databse.
        */
      $scope.addNotationKey = function() {
        if ($routeParams.id) {
          NotationKeyFactory.edit({
            id: $routeParams.id
          }, $scope.notationKey, function(res) {
            alert("Modified " + $scope.notationKey.nk_name + "!");
            $location.path("/settings/8");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          NotationKeyFactory.create($scope.notationKey, function(res) {
            alert("Added " + $scope.notationKey.nk_name + "!");
            $location.path("/settings/8");
          }, function(error) {
            if(error.status === 418) {
                alert("Error: Notation Key Already Exists.");
            } else {
                alert("Error: " + error.statusText);
            }
          });
        }
      }
    }
  ]);
