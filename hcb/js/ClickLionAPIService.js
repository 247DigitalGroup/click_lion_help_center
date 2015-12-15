(function() {
  var Page, getset,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  getset = function(obj, attrs) {
    var attr, i, len, results;
    results = [];
    for (i = 0, len = attrs.length; i < len; i++) {
      attr = attrs[i];
      results.push((function(attr) {
        obj.prototype.__defineGetter__(attr, function() {
          return this.get(attr);
        });
        return obj.prototype.__defineSetter__(attr, function(val) {
          return this.set(attr, val);
        });
      })(attr));
    }
    return results;
  };

  Page = Parse.Object.extend('Page');

  getset(Page, ['title', 'description', 'html', 'slug']);

  angular.module('HCB').factory('api', [
    '$http', '$q', 'Notification', 'configs', function($http, $q, Notification, configs) {
      var ClickLionAPI;
      ClickLionAPI = (function() {
        function ClickLionAPI() {
          this.defaultErrorCallback = bind(this.defaultErrorCallback, this);
          this.newRequestObject = bind(this.newRequestObject, this);
        }

        ClickLionAPI.prototype.api = {
          root: configs.apiRoot,
          frontendRoot: 'http://prototype.clicklion.com',
          pages: '/pages',
          users: {
            signIn: '',
            signOut: ''
          },
          defaultRequestObject: {
            method: 'GET',
            withCredentials: true,
            dataType: 'json',
            headers: {}
          }
        };

        ClickLionAPI.prototype.newRequestObject = function(req) {
          return $.extend({}, this.api.defaultRequestObject, req);
        };

        ClickLionAPI.prototype.defaultErrorCallback = function(res) {
          switch (res.status) {
            case 0:
              Notification.error({
                delay: 1000,
                title: 'Connection Error',
                message: 'Could not connect to API service right now. Please try again later.'
              });
              break;
            case 400:
              Notification.error({
                delay: 3000,
                title: 'Update Failed',
                message: 'Could not update data.'
              });
              break;
            case 401:
              Notification.error({
                delay: 3000,
                title: 'Authorization Error',
                message: 'Authorization token denied by API service.'
              });
              break;
            case 404:
              Notification.error({
                title: 'Not Found',
                message: 'Requested resources not found.'
              });
          }
          return null;
        };

        ClickLionAPI.prototype.createNewPage = function() {
          return new Page();
        };

        ClickLionAPI.prototype.getPages = function() {
          var defer, query;
          defer = $q.defer();
          query = new Parse.Query(Page);
          query.find({
            success: function(res) {
              return defer.resolve(res);
            },
            error: function(e) {
              return defer.reject(e);
            }
          });
          return defer.promise;
        };

        ClickLionAPI.prototype.syncPages = function(json) {
          var defer, error, req, success;
          defer = $q.defer();
          req = this.newRequestObject({
            method: 'POST',
            url: this.api.root + this.api.pages,
            data: {
              htmls: json
            }
          });
          success = (function(_this) {
            return function(data) {
              return defer.resolve(data);
            };
          })(this);
          error = (function(_this) {
            return function(e) {
              _this.defaultErrorCallback(e);
              return defer.reject(e);
            };
          })(this);
          $http(req).then(success, error);
          return defer.promise;
        };

        ClickLionAPI.prototype.getPageById = function(id) {
          var defer, query;
          defer = $q.defer();
          query = new Parse.Query(Page);
          query.get(id, {
            success: function(res) {
              return defer.resolve(res);
            },
            error: function(e) {
              return defer.reject(e);
            }
          });
          return defer.promise;
        };

        ClickLionAPI.prototype.signOut = function(success, error) {
          var req;
          if (success == null) {
            success = void 0;
          }
          if (error == null) {
            error = this.defaultErrorCallback;
          }
          req = this.newRequestObject({
            method: 'DELETE',
            url: this.api.frontendRoot + this.api.users.signOut
          });
          return $http(req).then(success, error);
        };

        ClickLionAPI.prototype.signIn = function(email, password, success, error) {
          var req;
          if (success == null) {
            success = void 0;
          }
          if (error == null) {
            error = this.defaultErrorCallback;
          }
          req = this.newRequestObject({
            method: 'POST',
            url: this.api.root + this.api.users.signIn,
            data: {
              'user[email]': email,
              'user[password]': password
            }
          });
          return $http(req).then(success, error);
        };

        return ClickLionAPI;

      })();
      return new ClickLionAPI();
    }
  ]);

}).call(this);
