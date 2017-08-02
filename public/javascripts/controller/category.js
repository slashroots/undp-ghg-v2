/**
 * Category related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('CategoryController', ['$scope', '$location', '$routeParams', 'UserFactory', 'SectorFactory', 'CategoryFactory',
    function($scope, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory) {

      /**
       * Default states
       **/
      $scope.category = {};
      $scope.category.ca_code = "";
      $scope.category.ca_code_definition = "";
      $scope.category.ca_code_name = "";
      $scope.category.us_user = "";

      if ($routeParams.id) {
        //query and populate $scope.category
        CategoryFactory.get({
          id: $routeParams.id
        }, function(category) {
          $scope.category = category;
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

      SectorFactory.query(function(sectors) {
        $scope.sectors = sectors;
      });
      
      /**
        * Used to modify or add a category in the databse.
        */
      $scope.addCategory = function() {
        if ($routeParams.id) {
          $scope.category.us_user = $scope.user["_id"];
          CategoryFactory.edit({
            id: $routeParams.id
          }, $scope.category, function(res) {
            alert("Modified " + $scope.category.ca_code_name + "!");
            $location.path("/settings");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          $scope.category.us_user = $scope.user["_id"];
          CategoryFactory.create($scope.category, function(res) {
            alert("Added " + $scope.category.ca_code_name + " !");
            $location.path("/settings");
          }, function(error) {
            alert("Error: " + error.statusText);
          });
        }
      }
    }
  ]);
