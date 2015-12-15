(function() {
  angular.module('HCB').factory('editorModal', [
    'btfModal', 'configs', function(btfModal, configs) {
      return btfModal({
        controller: 'EditorController',
        controllerAs: 'modal',
        templateUrl: configs.tplRoot + "/modals/editor.html"
      });
    }
  ]).controller('EditorController', [
    'editorModal', 'api', 'Notification', '$http', 'generator', function(editorModal, api, Notification, $http, generator) {
      this.page = editorModal.page;
      this.editor = {
        language: 'en',
        entities: false,
        height: 400
      };
      this.getOutline = (function(_this) {
        return function() {
          Notification.info({
            title: _this.page.title + ' Ouline',
            message: 'Check Javascript console for outline results!'
          });
          return console.log(JSON.stringify(generator.getOutline(_this.page.body), null, '  '));
        };
      })(this);
      this.close = function(e) {
        if ((e == null) || e.target.classList.contains('modal-overlay')) {
          return editorModal.deactivate();
        }
      };
    }
  ]).controller('PagesController', [
    '$scope', '$rootScope', '$http', '$route', '$routeParams', '$location', '$window', 'cfpLoadingBar', 'Notification', 'editorModal', 'api', 'generator', 'parser', function($scope, $rootScope, $http, $route, $routeParams, $location, $window, cfpLoadingBar, Notification, editorModal, api, generator, parser) {
      var editPage;
      this.ckeditor = {
        language: 'en',
        entities: false,
        height: 710
      };
      editPage = (function(_this) {
        return function(page) {
          _this.page = page;
          _this.html = _this.page.html;
          return _this.save = function() {
            this.page.html = generator.normalize(this.html);
            return this.page.save(null, (function(_this) {
              return function() {
                Notification.success({
                  title: _this.page.title,
                  message: 'Page successfully saved!'
                });
                return $location.path('/pages');
              };
            })(this));
          };
        };
      })(this);
      switch ($rootScope.renderAction) {
        case 'pages.index':
          cfpLoadingBar.start();
          api.getPages().then((function(_this) {
            return function(pages) {
              _this.pages = pages;
              return cfpLoadingBar.complete();
            };
          })(this));
          break;
        case 'pages.publish':
          cfpLoadingBar.start();
          api.getPages().then((function(_this) {
            return function(pages) {
              var htmls, menu;
              menu = generator.compileMenu(pages);
              htmls = {};
              return generator.getTemplate().then(function(template) {
                var content, file, files, html, i, len, page;
                for (i = 0, len = pages.length; i < len; i++) {
                  page = pages[i];
                  html = generator.compile(template, menu, page);
                  htmls[page.slug + '.html'] = html;
                }
                _this.htmls = htmls;
                files = {};
                for (file in htmls) {
                  content = htmls[file];
                  files[file] = content.length;
                }
                _this.report = JSON.stringify(files, null, '  ');
                return cfpLoadingBar.complete();
              });
            };
          })(this));
          this.publish = function() {
            if (this.htmls != null) {
              cfpLoadingBar.start();
              return api.syncPages(this.htmls).then(function() {
                cfpLoadingBar.complete();
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
          cfpLoadingBar.start();
          this.id = $routeParams.id;
          api.getPageById(this.id).then((function(_this) {
            return function(page) {
              editPage(page);
              return cfpLoadingBar.complete();
            };
          })(this));
          break;
        case 'pages.new':
          editPage(api.createNewPage());
      }
    }
  ]);

}).call(this);
