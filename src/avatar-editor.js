angular.module('avatarEditor', ['ngImgCrop']).directive('avatarEditor', ['$log', function($log) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            src: '@'
        },
        template:
        '<div class="avatar-editor">\
            <img-crop class="ng-img-crop" ng-show="stage == 2" data-image="resultSrc" data-result-image="croppedSrc" data-area-type="square" data-area-min-size="100"></img-crop>\
            <label  ng-show="stage == 1">\
                <img ng-src="{{src}}">\
                <input type="file">\
            </label>\
            <div class="avatar-editor-buttons" ng-show="stage == 2">\
                <a class="avatar-editor-button-done glyphicon glyphicon-ok" ng-click="done()"></a>\
                <a class="avatar-editor-button-close glyphicon glyphicon-remove" ng-click="setStage1()"></a>\
            </div>\
        </div>',
        link: function(scope, element, attrs) {
            scope.resultSrc = scope.src || '';
            scope.croppedSrc = '';

            scope.setStage1 = function() {
                scope.stage = 1;
            };

            scope.setStage2 = function() {
                scope.stage = 2;
            };
            
            var input = findInput(element);

            if (!input) {
                $log.warn('avatarEditor: input[type="file"] not found');
                return;
            }
            
            scope.setStage1();
            
            input.addEventListener('change', onSelectFile);
            
            scope.$on("$destroy", function() {
                input.removeEventListener('change', onSelectFile);
            });
            
            //======================
            function findInput(element) {
                var label = null;
                var input = false;
                var children = element.children();
                for (var i in children) {
                    if (children[i].tagName == 'LABEL') {
                        label = children[i];
                        break;
                    }
                }

                if (!label) {
                    $log.warn('avatarEditor: label not found');
                    return false;
                }

                children = label.children;
                for (var i in children) {
                    if (children[i].tagName == 'INPUT') {
                        input = children[i];
                        break;
                    }
                }
                
                return input;
            }
            
            function onSelectFile(event) {
                var file = event.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    scope.$apply(function ($scope) {
                        $scope.resultSrc = event.target.result;
                        $scope.setStage2();
                    });
                };
                reader.readAsDataURL(file);
            }
            
            scope.done = function() {
                scope.src = scope.croppedSrc;
                scope.setStage1();
            };
        }
    };
}]);
