/**
 * Admin User related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('AdminUserController', ['$scope', '$location', '$routeParams', 'UserFactory', 'AdminUserFactory', 'SectorFactory',
    function($scope, $location, $routeParams, UserFactory, AdminUserFactory, SectorFactory) {

      /**
       * Default states
       **/
      $scope.user = {};
      $scope.user.us_user_first_name = "";
      $scope.user.us_user_last_name = "";
      $scope.user.us_email_address = "";
      $scope.user.us_state = "";
      $scope.user.us_sector_permissions = [];
      $scope.sectors = [];
      $scope.selectedItem = null;
      $scope.searchText = null;

      if ($routeParams.id) {
        //query and populate $scope.category
        AdminUserFactory.get({
          id: $routeParams.id
        }, function(user) {
          $scope.user = user;
          if(!user.us_sector_permissions) {
            $scope.user.us_sector_permissions = [];
          }
        }, function(error) {
          alert(error.statusText);
        });
      }

      /**
       * Used to map sector to users
       */
      SectorFactory.query({}, function(list) {
        $scope.sectors = list;
      });
      

      /**
       * Action to close the dialog
       */
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

      $scope.transformChip = function(chip) {
        return chip;
      };

    }
  ]);
