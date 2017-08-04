/**
 * Category related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('ActivityController', ['$scope', '$location', '$routeParams',
  'UserFactory', 'ActivityFactory', 'SectorFactory', 'CategoryFactory',
    function($scope, $location, $routeParams, UserFactory, ActivityFactory,
      SectorFactory, CategoryFactory) {

      /**
       * Default states
       **/
      $scope.activity = {};


      if ($routeParams.id) {
        //query and populate $scope.category
        ActivityFactory.get({
          id: $routeParams.id
        }, function(activity) {
          $scope.activity = activity;
        }, function(error) {
          alert(error.statusText);
        });
      }
      UserFactory.get(function(user) {
        $scope.user = user;
      });

      $scope.closeAndBack = function() {
        $location.path("/settings/2")
      };

      SectorFactory.query(function(sectors) {
        $scope.sectors = sectors;
      });

      $scope.onChange = function() {
        CategoryFactory.query({se_sector: $scope.activity.se_sector}, function(categories) {
          $scope.categories = categories;
        }, function(error) {
          $scope.categories = [];
        })
      }

      /**
        * Used to modify or add an activity in the databse.
        */
      $scope.addActivity = function() {
        if ($routeParams.id) {
          ActivityFactory.edit({
            id: $routeParams.id
          }, $scope.activity, function(res) {
            alert("Modified " + $scope.activity.ac_name + "!");
            $location.path("/settings/2");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          ActivityFactory.create($scope.activity, function(res) {
            alert("Added " + $scope.activity.ac_name + " !");
            $location.path("/settings/2");
          }, function(error) {
            alert("Error: " + error.statusText);
          });
        }
      }
    }
  ]);
