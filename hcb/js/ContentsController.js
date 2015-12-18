(function() {
  angular.module('LionPanel').factory('contentDisapproveModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'ContentDisapproveModalController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/disapprove-content.html"
      });
    }
  ]).controller('ContentDisapproveModalController', [
    '$window', 'contentDisapproveModal', 'api', function($window, contentDisapproveModal, api) {
      this.content = contentDisapproveModal.content;
      this.description = '';
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return contentDisapproveModal.deactivate();
        }
      };
      this.submit = (function(_this) {
        return function() {
          var error, message, success;
          console.log('#/contents/' + _this.content.status);
          success = function() {
            return $window.location.href = contentDisapproveModal.redirectTo;
          };
          error = function() {};
          message = _this.message + "\n" + _this.description;
          api.setContentStatus(_this.content._id, 'disapproved', message, success, error);
          return _this.close();
        };
      })(this);
      return void 0;
    }
  ]).controller('ContentsController', [
    '$scope', '$rootScope', '$http', '$routeParams', '$route', '$window', 'contentDisapproveModal', 'api', function($scope, $rootScope, $http, $routeParams, $route, $window, contentDisapproveModal, api) {
      var status, success;
      switch ($rootScope.renderAction) {
        case 'contents.index.reviewing':
        case 'contents.index.approved':
        case 'contents.index.disapproved':
          status = $rootScope.renderAction.split('.')[2];
          this.tab = status;
          this.page = parseInt($routeParams.page, 10);
          this.approve = function(content) {
            var error, success;
            success = function() {
              return $route.reload();
            };
            error = function() {};
            return api.setContentStatus(content._id, 'approved', null, success, error);
          };
          this.showDisapproveModal = (function(_this) {
            return function(content) {
              contentDisapproveModal.content = content;
              contentDisapproveModal.redirectTo = '#/contents/' + _this.tab;
              return contentDisapproveModal.activate();
            };
          })(this);
          success = (function(_this) {
            return function(res) {
              return _this.contents = res.data;
            };
          })(this);
          api.getContentsListByStatus(status, this.page, success);
      }
    }
  ]);

}).call(this);
