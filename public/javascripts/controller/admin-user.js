/**
 * Admin User related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('AdminUserController', ['$scope', '$location', '$routeParams', 'UserFactory', 'AdminUserFactory',
    function($scope, $location, $routeParams, UserFactory, AdminUserFactory) {

      /**
       * Default states
       **/
      $scope.user = {};
      $scope.user.us_user_first_name = "";
      $scope.user.us_user_last_name = "";
      $scope.user.us_email_address = "";
      $scope.user.us_state = "";

      if ($routeParams.id) {
        //query and populate $scope.category
        AdminUserFactory.get({
          id: $routeParams.id
        }, function(user) {
          $scope.user = user;
        }, function(error) {
          alert(error.statusText);
        });
      }

      $scope.closeAndBack = function() {
        $location.path("/settings/5");
      };

      /**
       * Used to modify or add a category in the databse.
       */
      $scope.save = function() {
        if ($routeParams.id) {
          AdminUserFactory.edit({
            id: $routeParams.id
          }, $scope.user, function(res) {
            alert("Modified " + $scope.user.us_user_first_name + " " + $scope.user.us_user_last_name + "!");
            $location.path("/settings/5");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        }
      }
    }
  ]);
