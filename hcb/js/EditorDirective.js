(function() {
  angular.module('HCB').directive('editor', [
    'configs', function(configs) {
      return {
        restrict: 'E',
        templateHTML: configs.tplRoot + "/pages/editor.html"
      };
    }
  ]);

}).call(this);
