/**
 * User Profile related controller and functionality
 */

angular.module('undp-ghg-v2')
    .controller('UserProfileController', ['$scope', '$location', '$routeParams', 'UserFactory', 'AdminUserFactory', 'LogsFactory',
        function ($scope, $location, $routeParams, UserFactory, AdminUserFactory, LogsFactory) {

            /**
             * Default states
             **/
            $scope.logs = [];
            $scope.user = {};

            /**
             * Get currently logged in user details
             */
            UserFactory.get(function (currentUser) {
                $scope.user = currentUser;
            });

            /**
             * Administrative users can view logs of actions on the 
             * platform
             */
            LogsFactory.query(function (list) {
                $scope.logs = list;
            });

            $scope.logsGridOptions = {
                data: 'logs',
                enableFiltering: true,
                enableGridMenu: true,
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
