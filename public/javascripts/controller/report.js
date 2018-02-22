/**
 * Navigation related controller and functionality
 */

angular.module('undp-ghg-v2')
  .controller('ReportController', ['$scope', '$location', '$routeParams','ReportFactory', '$sce', '$http', '$cookies',
    'WidestageFactory',
    function($scope, $location, $routeParams, ReportFactory, $sce, $http, $cookies, WidestageFactory) {

      //model
      angular.extend($scope, {
        'reports': [],
        'currentReportUrl': ''
      })

      // functions
      angular.extend($scope, {});

      if ($routeParams.id) {
        var url = WidestageFactory.domain + '/#/reports/' + $routeParams.id;
        ReportFactory.query({"id": $routeParams.id}, function(data) {
            for(var i = 0; i < data.length; i++) {
                var p = data[i].split('=');
                $cookies.put(p[0], p[1], {'path': '/'});
            }
            $scope.currentReportUrl = $sce.trustAsResourceUrl(url);
        });
      } else {
          ReportFactory.get({}, function (reports) {
            $scope.reports = reports.items;
          });
      }

    }
  ]);
