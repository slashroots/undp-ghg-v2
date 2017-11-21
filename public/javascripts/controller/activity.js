/**
 * Category related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('ActivityController', ['$scope', '$location', '$routeParams',
  'UserFactory', 'ActivityFactory', 'SectorFactory', 'CategoryFactory', 'GasFactory', 'IPCCActivityFactory',
    function($scope, $location, $routeParams, UserFactory, ActivityFactory,
      SectorFactory, CategoryFactory, GasFactory, IPCCActivityFactory) {

      /**
       * Default states
       **/
      $scope.activity = {};
      $scope.ipcc_activities = [];

      /**
       * List all the associated IPCC activities
       */
      IPCCActivityFactory.query(function(activities) {
        $scope.ipcc_activities = activities;
      });

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

      /**
       * when the combobox is selected with a specific ipcc activity
       * then inherit the name from the IPCC recommended activity.
       */
      $scope.ipccSelected = function() {
        IPCCActivityFactory.get({id: activity.ica_activity}, function(ipcc_activity) {
          activity.ac_name = ipcc_activity.iac_name;
          activity.ac_description = ipcc_activity.iac_description;
        });
      };
    }
  ]);
