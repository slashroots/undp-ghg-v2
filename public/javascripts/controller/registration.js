/**
 * Registration related controller and functionality
 */

angular.module('undp-ghg-v2', ['ngResource'])
  .controller('RegistrationController', ['$scope', '$window', '$resource',
    function($scope, $window, $resource) {
        // models
        angular.extend($scope, {
            'user': {},
            'message' : ''
        });

        // functions
        angular.extend($scope, {
            'register': function() {
                $resource('/user-registration', {}, {
                    create: {
                        method: 'POST',
                        isArray: false
                    }
                }).create($scope.user, function(result) {
                    $window.location = '/';
                }, function(err) {
                    $scope.message = "There was an error creating your account. Please try again later."
                });
            },
            'resetPassword': function() {
                $resource('/password-reset', {}, {
                    create: {
                        method: 'POST',
                        isArray: false
                    }
                }).create($scope.user, function(result) {
                    $window.location = '/';
                }, function(err) {
                    $scope.message = "There was an error please try again later."
                });
            }
        });

        $scope.$watch('confirm_us_password', function(n, o) {
            $scope.registration_form.confirm_us_password.$setValidity('password_mismatch', $scope.user.us_password===n);
        });
    }
  ]);
