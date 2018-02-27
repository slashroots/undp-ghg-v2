angular.module('undp-ghg-v2')
    .directive('calcItem', ['UnitFactory', function(UnitFactory) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                subItem: "=",
                activity: "=",
                selected: "=",
                units: "=",
                selectedUnit: "=",
                calculatedValue: "=?",
                calcCallback: "&calcCallback"
            },
            templateUrl: '/javascripts/directives/calc-listitem-template.html',
            link: function(scope, element, attrs, ctrl) {

                scope.iselected = {"item": scope.selected};
                scope.unit = scope.selectedUnit? {"unit": scope.selectedUnit._id}:{"unit": {}};

                if(scope.subItem.emission_factor) {
                    scope.calculatedValue = scope.subItem.calculation_value;
                    scope.activity = scope.subItem.ac_activity;
                    scope.unit = {"unit": scope.subItem.un_unit._id};
                    scope.iselected = {"item": true};
                    scope.subItem = scope.subItem.emission_factor;
                }

                scope.unitChange = function() {
                    var unit = {};

                    for(var i=0; i<scope.units.length; i++) {
                        if(scope.units[i]._id===scope.unit.unit) {
                            unit = scope.units[i];
                            break;
                        }
                    }
                    scope.calcCallback({arg1: "update", arg2: {
                        "ac_activity": scope.activity,
                        "un_unit": unit
                        }});
                }

                scope.calculate = function() {
                    if(!scope.iselected.item) {
                        scope.calcCallback({arg1: "remove", arg2: {"ac_activity": scope.activity}});
                        return false;
                    }

                    scope.calculatedValue = (parseFloat(scope.activity.da_data_value) * parseFloat(scope.subItem.da_data_value)).toFixed(5);
                    scope.calcCallback({arg1: "add", arg2: {
                        "ac_activity": scope.activity,
                        "emission_factor": scope.subItem,
                        "calculation_value": scope.calculatedValue,
                        "un_unit": ""
                        }});
                }
            }
        };
    }]);