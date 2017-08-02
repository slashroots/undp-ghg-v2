/**
 * Gas related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('GasController', ['$scope', '$location', '$routeParams', 'UserFactory', 'GasFactory',
    function($scope, $location, $routeParams, UserFactory, GasFactory) {

      /**
       * Default states
       **/
      $scope.gas = {};
      $scope.gas.ga_gas_name = "";
      $scope.gas.ga_gas_gwp = 0;
      $scope.gas.ga_chem_formula = "";
      $scope.gas.us_user = "";

      if ($routeParams.id) {
        //query and populate $scope.gas
        GasFactory.get({
          id: $routeParams.id
        }, function(gases) {
          $scope.gas = gases;
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
        * Used to modify or add a gas in the databse.
        */
      $scope.addGas = function() {
        if ($routeParams.id) {
          $scope.gas.us_user = $scope.user["_id"];
          GasFactory.edit({
            id: $routeParams.id
          }, $scope.gas, function(res) {
            alert("Modified " + $scope.gas.ga_gas_name + "!");
            $location.path("/settings");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          $scope.gas.us_user = $scope.user["_id"];
          GasFactory.create($scope.gas, function(res) {
            alert("Added " + $scope.gas.ga_gas_name + " !");
            $location.path("/settings");
          }, function(error) {
            alert("Error: " + error.statusText);
          });
        }
      }
    }
  ]);
