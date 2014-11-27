angular.module('avatarEditor', ['ngImgCrop']).directive('avatarEditor', ['$log', function($log) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            src: '=',
            modeUpload: '@',
            modeEdit: '@',
            modeCamera: '@',
            resultSize: '@'
        },
        template:
        '<div class="avatar-editor">\
            <img-crop class="ng-img-crop" ng-show="stage == 2 && modeEdit" data-image="resultSrc" data-result-image="croppedSrc" data-area-type="square" data-area-min-size="100" data-result-image-size="resultSize"></img-crop>\
            <label ng-show="stage == 1 && modeUpload" class="img-outer">\
                <img ng-src="{{src}}">\
                <input type="file">\
            </label>\
            <div ng-show="stage == 1 && !modeUpload" class="img-outer">\
                <img ng-src="{{src}}">\
            </div>\
            <div ng-show="stage == 3 && modeCamera" class="img-outer">\
                <video autoplay></video>\
                <canvas></canvas>\
            </div>\
            <div class="avatar-editor-buttons">\
                <a class="avatar-editor-button-camera glyphicon glyphicon-camera" ng-click="camera()" ng-show="stage == 1 && modeCamera"></a>\
                \
                <a class="avatar-editor-button-done glyphicon glyphicon-ok" ng-click="cameraDone()" ng-show="stage == 3 && modeEdit"></a>\
                <a class="avatar-editor-button-done glyphicon glyphicon-ok" ng-click="done()" ng-show="stage == 2 && modeEdit"></a>\
                <a class="avatar-editor-button-close glyphicon glyphicon-remove" ng-click="setStage1()" ng-show="(stage == 2 || stage == 3) && modeEdit"></a>\
            </div>\
        </div>',
        link: function(scope, element, attrs) {
//            scope.resultSrc = scope.src || '';
            scope.croppedSrc = '';
            scope.resultSize = scope.resultSize || 200;
            
            // First stage - show image
            scope.setStage1 = function() {
                scope.stage = 1;
                stopStream();
            };

            // Second stage - croping image
            scope.setStage2 = function() {
                scope.stage = 2;
            };
            
            // Third stage - displaying video stream from camera
            scope.setStage3 = function() {
                scope.stage = 3;
            };
            
            var input = findInput(element);
            var video = findVideo(element);

            if (!input) {
                $log.warn('avatarEditor: input[type="file"] not found');
                return;
            }
            
            scope.setStage1();
            
            if(scope.modeUpload)
                input.addEventListener('change', onSelectFile);
            
            scope.$on("$destroy", function() {
                input.removeEventListener('change', onSelectFile);
            });
            
            //======================
            var localStream = null;
            
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
            
            function findVideo(element) {
                return element.find('VIDEO')[0];
            }
            
            function onSelectFile(event) {
                var file = event.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    scope.$apply(function ($scope) {
                        $scope.resultSrc = event.target.result;
                        if($scope.modeEdit)
                            $scope.setStage2();
                        else {
                            scope.src = scope.resultSrc;
                            $scope.setStage1();
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
            
            scope.done = function() {
                scope.src = scope.croppedSrc;
                scope.setStage1();
            };
            
            scope.camera = function() {
                navigator._getUserMedia = (window.navigator.getUserMedia ||
                    window.navigator.webkitGetUserMedia ||
                    window.navigator.mozGetUserMedia ||
                    window.navigator.msGetUserMedia);
                
                navigator._getUserMedia({video: true}, function (stream) {
                    localStream = stream;
                    video.src = window.URL.createObjectURL(stream);
                }, function() {
                    console.log('error');
                });
                scope.setStage3();
            };
            
            scope.cameraDone = function() {
                var canvas = document.createElement('canvas');
                canvas.width = element.prop('offsetWidth');
                canvas.height = element.prop('offsetHeight');
//                console.log(element.prop('offsetWidth'), element.prop('offsetHeight'));
                context = canvas.getContext("2d");
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                var shot = canvas.toDataURL();
                scope.resultSrc = shot;
                if(scope.modeEdit) {
                    scope.setStage2();
                }
                else {
                    scope.src = shot;
                    scope.setStage1();
                }
                
                stopStream();
            };
            
            function stopStream() {
                if(!localStream)
                    return;
                
                localStream.stop();
                localStream = null;
            }

        }
    };
}]);
