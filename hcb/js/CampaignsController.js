(function() {
  angular.module('LionPanel').factory('campaignDisapproveModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'CampaignDisapproveModalController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/disapprove-campaign.html"
      });
    }
  ]).controller('CampaignDisapproveModalController', [
    '$window', 'campaignDisapproveModal', 'api', function($window, campaignDisapproveModal, api) {
      this.campaign = campaignDisapproveModal.campaign;
      this.description = '';
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return campaignDisapproveModal.deactivate();
        }
      };
      this.submit = (function(_this) {
        return function() {
          var error, message, success;
          success = function() {
            return $window.location.href = '#/campaigns/' + _this.campaign.status;
          };
          error = function() {};
          message = _this.message + "\n" + _this.description;
          api.setCampaignStatus(_this.campaign.id, 'suspended', message, success, error);
          return _this.close();
        };
      })(this);
      return void 0;
    }
  ]).controller('CampaignsController', [
    '$scope', '$rootScope', '$http', '$routeParams', '$window', 'campaignDisapproveModal', 'api', function($scope, $rootScope, $http, $routeParams, $window, campaignDisapproveModal, api) {
      var status, success;
      this.currentPreviewUrl = null;
      this.previewUrl = (function(_this) {
        return function(url) {
          return _this.currentPreviewUrl = url;
        };
      })(this);
      switch ($rootScope.renderAction) {
        case 'campaigns.index.reviewing':
        case 'campaigns.index.approved':
        case 'campaigns.index.suspended':
          status = $rootScope.renderAction.split('.')[2];
          this.tab = status;
          success = (function(_this) {
            return function(res) {
              return _this.campaigns = res.data;
            };
          })(this);
          api.getCampaignsListByStatus(status, success);
          break;
        case 'campaigns.view':
          this.id = $routeParams.id;
          this.page = parseInt($routeParams.page, 10);
          success = (function(_this) {
            return function(res) {
              _this.campaign = res.data.campaign;
              _this.articles = res.data.articles;
              _this.campaign.id = _this.id;
              _this.showDisapproveModal = function() {
                campaignDisapproveModal.campaign = _this.campaign;
                return campaignDisapproveModal.activate();
              };
              return _this.approve = function(id) {
                var error;
                success = function() {
                  return $window.location.href = '#/campaigns/' + _this.campaign.status;
                };
                error = function() {};
                return api.setCampaignStatus(id, 'approved', null, success, error);
              };
            };
          })(this);
          api.getCampaignArticles(this.id, this.page, success);
      }
      return void 0;
    }
  ]);

}).call(this);
