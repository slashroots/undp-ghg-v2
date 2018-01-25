angular.module('undp-ghg-v2')
    .directive('calcItem', function() {
        return {
            restrict: 'E',
            scope: {
                subItem: "=",
                activity: "=",
                selected: "="
            },
            template: '<div layout="row" class="subitem" ui-tree-handle>' +
                 '<input type="checkbox" ng-model="iselected.item" ng-change="calculate()" />' +
                 '<span flex>{{subItem.ac_activity.ac_name}} - {{subItem.ca_category.ca_code_name}} - {{subItem.ga_gas.ga_gas_name}}</span>' +
                 '<span flex ng-show="iselected.item" style="color: #000000;">{{calculated_value}} {{subItem.un_unit.un_unit_symbol}}</span></div>',
            link: function(scope, element, attrs, ctrl) {
                scope.iselected = {"item": scope.selected}
                scope.calculate = function() {
                    if(!scope.iselected.item)
                        return false;

                    scope.calculated_value = parseFloat(scope.activity.da_data_value) * parseFloat(scope.subItem.da_data_value);
                }
                scope.calculate();
            }
        };
    });