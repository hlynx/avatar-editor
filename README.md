AngularJS directive for croping avatar from image

## Usage

1. Add avatar-editor.min.js and avatar-editor.min.css to you main file (index.html)

  In your web page:

  ```html
    <link rel="stylesheet" href="bower_components/ngImgCrop/compile/minified/ng-img-crop.css"/>
    <link rel="stylesheet" href="bower_components/dist/avatar-editor.min.css"/>
    <script src="bower_components/angularjs/angular.js"></script>
    <script src="bower_components/ngImgCrop/compile/unminified/ng-img-crop.js"></script>
    <script src="bower_components/dist/avatar-editor.min.js"></script>
  ```

2. Set `avatarEditor` as a dependency in your module
  ```javascript
  var myapp = angular.module('myapp', ['avatarEditor'])
  ```

3. Add avatar-editor directive to the wanted element, example:
  ```html
  <div data-avatar-editor> .... </div>
  ```
