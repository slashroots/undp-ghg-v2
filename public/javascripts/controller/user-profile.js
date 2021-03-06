/**
 * User Profile related controller and functionality
 */

angular.module('undp-ghg-v2')
    .controller('UserProfileController', ['$scope', '$location', '$routeParams', 'UserFactory', 'AdminUserFactory', 'LogsFactory', 'LogFactory',
        function ($scope, $location, $routeParams, UserFactory, AdminUserFactory, LogsFactory, LogFactory) {

            /**
             * Default states
             **/
            $scope.logs = [];
            $scope.user = {};
            $scope.isAdmin = false;

            /**
             * Get currently logged in user details
             */
            UserFactory.get(function (currentUser) {
                $scope.user = currentUser;
                if(currentUser.us_user_role == 'admin') {
                    $scope.isAdmin = true;
                }
                getPage();
            });

            /**
             * Administrative users can view logs of actions on the 
             * platform
             */

            var paginationOptions = {
                pageNumber: 1,
                pageSize: 100,
                sort: null
              };

            getPage = function() {
                var query = {
                    page: paginationOptions.pageNumber,
                    limit: paginationOptions.pageSize
                };
                /**
                 * If the user isn't an administrator then
                 * only request his logs
                 */
                if(!$scope.isAdmin) {
                    query.us_user = $scope.user._id;
                }
                LogsFactory.query(query, function(data) {
                    $scope.logs = data;
                    LogFactory.count(query, function(value) {
                        $scope.logsGridOptions.totalItems = value.count;
                    });
                });
            };

            /**
             * grid options
             */
            $scope.logsGridOptions = {
                data: 'logs',
                enableFiltering: true,
                enableGridMenu: true,
                useExternalPagination: true,
                paginationPageSizes: [25, 50, 75, 100],
                paginationPageSize: 100,
                onRegisterApi: function(gridApi) {
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        getPage();
                      });
                },
                firstPage: function () {
                    paginationOptions.pageNumber = 1
                    getPage();
                },
                nextPage: function () {
                    paginationOptions.pageNumber++;
                    getPage();
                },
                previousPage: function () {
                    if (paginationOptions.pageNumber > 1) {
                        paginationOptions.pageNumber--;
                        getPage();
                    }
                },
                exporterPdfDefaultStyle: {
                    fontSize: 9
                },
                exporterPdfTableStyle: {
                    margin: [5, 5, 5, 5]
                },
                exporterPdfTableHeaderStyle: {
                    fontSize: 9,
                    bold: true,
                    italics: true,
                    color: 'red'
                },
                columnDefs: [{
                    field: 'us_user.us_username',
                    displayName: 'User',
                    width: 100
                },
                {
                    field: 'lo_module',
                    displayName: 'Module',
                    width: 100
                },
                {
                    field: 'lo_level',
                    displayName: 'Level',
                    width: 80
                },
                {
                    field: 'lo_title',
                    displayName: 'Title',
                    width: 150
                },
                {
                    field: 'lo_desc',
                    displayName: 'Description'
                },
                {
                    field: 'lo_date',
                    displayName: 'Date/Time',
                    cellFilter: "date: 'medium'",
                    width: 170
                }

                ]
            };

        }
    ]);
