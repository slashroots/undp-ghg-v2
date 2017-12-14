/**
 * Category related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('CategoryController', ['$scope', '$location', '$routeParams', 'UserFactory', 'SectorFactory', 'CategoryFactory', 'IPCCCategoryFactory',
    function($scope, $location, $routeParams, UserFactory, SectorFactory, CategoryFactory, IPCCCategoryFactory) {


      /**
       * Default states
       **/
      $scope.category = {};
      $scope.category.ca_code = "";
      $scope.category.ca_code_definition = "";
      $scope.category.ca_code_name = "";
      $scope.category.us_user = "";
      $scope.ipcc_categories = [];
      $scope.category.ica_category = "";

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
        $location.path("/settings/1");
      };

      SectorFactory.query(function(sectors) {
        $scope.sectors = sectors;
      });

      /**
        * Used to modify or add a category in the databse.
        */
      $scope.addCategory = function() {

        if($scope.category.ica_category == "") {
          $scope.category.ica_category = undefined;
        }
        if ($routeParams.id) {
          $scope.category.us_user = $scope.user["_id"];
          CategoryFactory.edit({
            id: $routeParams.id
          }, $scope.category, function(res) {
            alert("Modified " + $scope.category.ca_code_name + "!");
            $location.path("/settings/1");
          }, function(error) {
            alert("Error: " + error.statusText);
          })
        } else {
          $scope.category.us_user = $scope.user["_id"];
          CategoryFactory.create($scope.category, function(res) {
            alert("Added " + $scope.category.ca_code_name + " !");
            $location.path("/settings/1");
          }, function(error) {
            alert("Error: " + error.statusText);
          });
        }
      }

      $scope.sectorSelected = function() {
        IPCCCategoryFactory.query({
          se_sector: $scope.category.se_sector
        }, function(ipcc_categories) {
          $scope.ipcc_categories = ipcc_categories;
        });
      }

      $scope.ipccSelected = function() {
        if($scope.category.ica_category==='') {
            $scope.category.ica_category = '';
            $scope.category.ca_code = '';
            $scope.catcode_disabled = false;
            return;
        }

        $scope.catcode_disabled = true;
        for(var i=0; i<$scope.ipcc_categories.length; i++) {
            if($scope.ipcc_categories[i]._id===$scope.category.ica_category) {
                $scope.category.ca_code = $scope.ipcc_categories[i].ica_code;
                break;
            }
        }
      }

      $scope.$watch("category.ca_code", function(n, o) {
        if($scope.category.ica_category!=='') {
            $scope.category_form.category_code.$setValidity("code_exists", true);
            return;
        }

        for(var i=0; i<$scope.ipcc_categories.length; i++) {
            if($scope.ipcc_categories[i].ica_code===$scope.category.ca_code) {
                $scope.category_form.category_code.$setValidity("code_exists", false);
                return;
            }
        }
        $scope.category_form.category_code.$setValidity("code_exists", true);
      });

    }
  ]);
