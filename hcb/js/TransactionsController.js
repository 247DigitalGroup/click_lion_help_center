(function() {
  angular.module('HCB').factory('transactionConfirmModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'TransactionConfirmModalController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/confirm-transaction.html"
      });
    }
  ]).controller('TransactionConfirmModalController', [
    '$window', '$route', 'transactionConfirmModal', 'api', function($window, $route, transactionConfirmModal, api) {
      this.transaction = transactionConfirmModal.transaction;
      this.description = '';
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return transactionConfirmModal.deactivate();
        }
      };
      this.submit = (function(_this) {
        return function() {
          var note, success, transactionId, userId;
          userId = _this.transaction.user_id;
          transactionId = _this.transaction.transaction_id;
          note = _this.note;
          if (note.length > 0) {
            success = function() {
              return $route.reload();
            };
            api.confirmTransaction(userId, transactionId, note, success);
            return _this.close();
          }
        };
      })(this);
      return void 0;
    }
  ]).factory('transactionCancelModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'TransactionCancelModalController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/cancel-transaction.html"
      });
    }
  ]).controller('TransactionCancelModalController', [
    '$window', '$route', 'transactionCancelModal', 'api', function($window, $route, transactionCancelModal, api) {
      this.transaction = transactionCancelModal.transaction;
      this.description = '';
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return transactionCancelModal.deactivate();
        }
      };
      this.submit = (function(_this) {
        return function() {
          var note, success, transactionId, userId;
          userId = _this.transaction.user_id;
          transactionId = _this.transaction.transaction_id;
          note = _this.note;
          if (note.length > 0) {
            success = function() {
              return $route.reload();
            };
            api.cancelTransaction(userId, transactionId, note, success);
            return _this.close();
          }
        };
      })(this);
      return void 0;
    }
  ]).factory('transactionResendModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'TransactionResendModalController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/resend-transaction.html"
      });
    }
  ]).controller('TransactionResendModalController', [
    '$window', '$route', 'transactionResendModal', 'api', function($window, $route, transactionResendModal, api) {
      this.transaction = transactionResendModal.transaction;
      this.description = '';
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return transactionResendModal.deactivate();
        }
      };
      this.submit = (function(_this) {
        return function() {
          var success, transactionId, userId;
          userId = _this.transaction.user_id;
          transactionId = _this.transaction.transaction_id;
          success = function() {
            return $route.reload();
          };
          api.resendTransaction(userId, transactionId, success);
          return _this.close();
        };
      })(this);
      return void 0;
    }
  ]).controller('TransactionsController', [
    '$scope', '$rootScope', '$http', '$route', '$routeParams', '$window', 'api', 'transactionConfirmModal', 'transactionCancelModal', 'transactionResendModal', function($scope, $rootScope, $http, $route, $routeParams, $window, api, transactionConfirmModal, transactionCancelModal, transactionResendModal) {
      var success, type;
      switch ($rootScope.renderAction) {
        case 'transactions.index.wire-transfer':
        case 'transactions.index.paypal':
          type = $rootScope.renderAction.split('.')[2];
          this.tab = type;
          success = (function(_this) {
            return function(res) {
              return _this.transactions = res.data;
            };
          })(this);
          api.getTransactionsList((type === 'paypal' ? true : false), success);
          this.confirm = (function(_this) {
            return function(transaction) {
              transactionConfirmModal.transaction = transaction;
              return transactionConfirmModal.activate();
            };
          })(this);
          this.cancel = (function(_this) {
            return function(transaction) {
              transactionCancelModal.transaction = transaction;
              return transactionCancelModal.activate();
            };
          })(this);
          this.resend = (function(_this) {
            return function(transaction) {
              transactionResendModal.transaction = transaction;
              return transactionResendModal.activate();
            };
          })(this);
      }
      return void 0;
    }
  ]);

}).call(this);
