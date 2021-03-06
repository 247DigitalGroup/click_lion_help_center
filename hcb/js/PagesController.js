(function() {
  angular.module('HCB').controller('PagesController', [
    '$scope', '$rootScope', '$http', '$route', '$routeParams', '$location', '$window', 'Notification', 'api', 'generator', 'parser', function($scope, $rootScope, $http, $route, $routeParams, $location, $window, Notification, api, generator, parser) {
      var editPage;
      this.ckeditor = {
        language: 'en',
        entities: true,
        allowedContent: true,
        height: 710
      };
      editPage = (function(_this) {
        return function(page) {
          _this.page = page;
          return _this.save = function() {
            return api.savePage(_this.page).then(function() {
              Notification.success({
                title: _this.page.title,
                message: 'Page successfully saved!'
              });
              return $location.path('/pages');
            });
          };
        };
      })(this);
      switch ($rootScope.renderAction) {
        case 'pages.index':
          api.getPages().then((function(_this) {
            return function(pages) {
              return _this.pages = pages;
            };
          })(this));
          break;
        case 'pages.publish':
          api.getPages().then((function(_this) {
            return function(pages) {
              var htmls, i, len, menu, page;
              for (i = 0, len = pages.length; i < len; i++) {
                page = pages[i];
                page.html = generator.normalize(page.html);
              }
              menu = generator.compileMenu(pages);
              htmls = {};
              return generator.getTemplate().then(function(template) {
                var html, j, len1;
                for (j = 0, len1 = pages.length; j < len1; j++) {
                  page = pages[j];
                  html = generator.compile(template, menu, page);
                  htmls[page.id + '.html'] = html;
                }
                _this.htmls = htmls;
                return _this.report = JSON.stringify(htmls, null, '  ');
              });
            };
          })(this));
          this.publish = function() {
            if (this.htmls != null) {
              return api.syncPages(this.htmls).then(function() {
                return Notification.success({
                  title: 'Page successfully synced',
                  message: 'All page updated!'
                });
              });
            } else {
              return Notification.warning({
                title: 'Page sync error',
                message: 'Data in preparation.'
              });
            }
          };
          break;
        case 'pages.edit':
          this.id = $routeParams.id;
          api.getPageById(this.id).then(function(page) {
            return editPage(page);
          });
          break;
        case 'pages.new':
          editPage(api.createNewPage());
      }
    }
  ]);

}).call(this);
