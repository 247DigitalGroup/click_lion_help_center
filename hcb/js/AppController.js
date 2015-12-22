(function() {
  var app;

  Parse.initialize("lYUgWbdFng9xv8eMMDTVnp4TZwq8MxCBBgLykHT9", "3wuziu0pvXvUWRSOYAsiOXwc5sKxblhqIRCTuSAU");

  app = angular.module('HCB', ['ckeditor', 'ngAnimate', 'ngRoute', 'ngSanitize', '720kb.tooltips', 'btford.modal', 'angular-loading-bar', 'cfp.loadingBar', 'angular-velocity', 'ui-notification']).constant('configs', {
    siteRoot: window.ClickLionDebugger != null ? 'http://help.clicklion.com' : 'http://help.clicklion.com',
    tplRoot: window.ClickLionDebugger != null ? '/tpl' : '/tpl',
    apiRoot: window.ClickLionDebugger != null ? 'http://edit.help.clicklion.com' : 'http://edit.help.clicklion.com'
  }).config([
    'configs', function(configs) {
      var _configs, e;
      try {
        _configs = JSON.parse(localStorage.getItem('HCB.configs'));
        _configs = $.extend(configs, _configs);
      } catch (_error) {
        e = _error;
        _configs = configs;
      }
      return app.constant('configs', _configs);
    }
  ]).config([
    'NotificationProvider', 'configs', function(NotificationProvider, configs) {
      return NotificationProvider.setOptions({
        delay: 5000,
        startTop: 25,
        startRight: 25,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top',
        templateUrl: configs.tplRoot + "/notifications/default.html"
      });
    }
  ]).config([
    '$sceDelegateProvider', function($sceDelegateProvider) {
      return $sceDelegateProvider.resourceUrlWhitelist(['**']);
    }
  ]).factory('welcomeModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'WelcomeModalController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/welcome.html"
      });
    }
  ]).controller('WelcomeModalController', [
    'welcomeModal', 'api', '$http', function(welcomeModal, api, $http) {
      this.user = {
        email: 'advertiser@click.lion',
        password: '12345678'
      };
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return welcomeModal.deactivate();
        }
      };
      this.login = function() {
        var success;
        success = function(res) {
          return console.log(res);
        };
        return api.signIn('advertiser@click.lion', '12345678', success);
      };
      this.login();
      return void 0;
    }
  ]).controller('AppController', [
    '$window', 'welcomeModal', 'api', function($window, welcomeModal, api) {
      this.role = this.role || null;
      this.menuOpened = false;
      this.closeMenu = function() {
        return this.menuOpened = false;
      };
      this.toggleMenu = function() {
        return this.menuOpened = !this.menuOpened;
      };
      this.checkLoginNeeded = function() {
        return welcomeModal.activate();
      };
      this.signOut = function() {
        var success;
        success = function(res) {
          return console.log(res);
        };
        return api.signOut(success);
      };
      return void 0;
    }
  ]);

}).call(this);
