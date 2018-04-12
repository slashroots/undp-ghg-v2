angular.module('undp-ghg-v2')
    .directive('ngConfirmClick', [function(){
            return {
                link: function (scope, element, attr) {
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(attr.ngConfirmClick) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }])