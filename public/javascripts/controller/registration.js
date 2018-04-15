/**
 * Registration related controller and functionality
 */

angular.module('undp-ghg-v2', ['ngResource'])
  .config(function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');
  })
  .controller('RegistrationController', ['$scope', '$window', '$resource', '$location',
    function($scope, $window, $resource, $location) {
        // models
        angular.extend($scope, {
            'user': {},
            'message' : '',
            'tokenValid': false,
            'request_sent': false
        });

        var token = $location.search().token;
        if(token!==undefined) {
            var obj = JSON.parse(atob(token.split('.')[1]));

            // convert date to seconds
            if(obj.exp > Math.floor(Date.now()/1000)) {
                $scope.user.token = token;
                $scope.tokenValid = true;
            } else {
                $scope.message = "This token has expired. Please request a new password reset link.";
            }
        }

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
            'requestPassword': function() {
                $resource('/password-request', {}, {
                    create: {
                        method: 'POST',
                        isArray: false
                    }
                }).create($scope.user, function(result) {
                    $scope.request_sent = true;
                }, function(err) {
                    $scope.message = "There was an error please try again later."
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
