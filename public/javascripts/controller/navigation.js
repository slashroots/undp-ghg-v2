angular.module('undp-ghg-v2')
.controller('NavigationController', ['$scope', 'UserFactory',
  function($scope, UserFactory) {
    UserFactory.get(function(user) {
      $scope.user = user;
    });
  }
]);
