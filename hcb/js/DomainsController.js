(function() {
  angular.module('LionPanel').factory('domainDisapproveModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'DomainDisapproveModalController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/disapprove-domain.html"
      });
    }
  ]).controller('DomainDisapproveModalController', [
    '$window', '$route', 'domainDisapproveModal', 'api', function($window, $route, domainDisapproveModal, api) {
      this.domain = domainDisapproveModal.domain;
      this.description = '';
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return domainDisapproveModal.deactivate();
        }
      };
      this.submit = (function(_this) {
        return function() {
          var error, message, success;
          success = function() {
            return $route.reload();
          };
          error = function() {};
          message = _this.message + "\n" + _this.description;
          api.setDomainStatus(_this.domain._id, 'unapproved', message, success, error);
          return _this.close();
        };
      })(this);
      return void 0;
    }
  ]).controller('DomainsController', [
    '$scope', '$rootScope', '$http', '$route', '$routeParams', '$window', 'api', 'domainDisapproveModal', function($scope, $rootScope, $http, $route, $routeParams, $window, api, domainDisapproveModal) {
      var status, success;
      this.currentPreviewUrl = null;
      this.previewUrl = (function(_this) {
        return function(url) {
          return _this.currentPreviewUrl = url;
        };
      })(this);
      switch ($rootScope.renderAction) {
        case 'domains.index.reviewing':
        case 'domains.index.approved':
        case 'domains.index.unapproved':
          status = $rootScope.renderAction.split('.')[2];
          this.tab = status;
          this.approve = function(domain) {
            var error, success;
            success = function() {
              return $route.reload();
            };
            error = function() {};
            return api.setDomainStatus(domain._id, 'approved', null, success, error);
          };
          this.showDisapproveModal = function(domain) {
            domainDisapproveModal.domain = domain;
            return domainDisapproveModal.activate();
          };
          success = (function(_this) {
            return function(res) {
              return _this.domains = res.data;
            };
          })(this);
          api.getDomainsListByStatus(status, success);
      }
      return void 0;
    }
  ]);

}).call(this);
