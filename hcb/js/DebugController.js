(function() {
  angular.module('HCB').controller('DebugController', [
    'configs', 'Notification', function(configs, Notification) {
      var e;
      try {
        this.configs = JSON.parse(localStorage.getItem('HCB.configs'));
        this.configs = $.extend(configs, this.configs);
      } catch (_error) {
        e = _error;
        this.configs = configs;
      }
      return this.save = function() {
        localStorage.setItem('HCB.configs', JSON.stringify(this.configs));
        Notification.info({
          delay: false,
          title: 'Saved',
          message: JSON.stringify(this.configs, null, '  ')
        });
        return angular.module('HCB').constant('configs', this.configs);
      };
    }
  ]);

}).call(this);
