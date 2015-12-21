(function() {
  angular.module('HCB').factory('generator', [
    '$http', '$q', 'configs', function($http, $q, configs) {
      var HelpCenterGenerator;
      HelpCenterGenerator = (function() {
        function HelpCenterGenerator() {}

        HelpCenterGenerator.prototype.template = null;

        HelpCenterGenerator.prototype.createSlugFromText = function(s) {
          var res;
          res = s.toLowerCase().replace(/\ /g, '-').replace(/[^\w-]+/g, '').replace(/\-\-/g, '-');
          return res;
        };

        HelpCenterGenerator.prototype.getTemplate = function() {
          var defer;
          defer = $q.defer();
          if (this.template != null) {
            defer.resolve(this.template);
          } else {
            $.ajax({
              url: configs.tplRoot + "/pages/template.html",
              method: 'get',
              success: (function(_this) {
                return function(html) {
                  _this.template = html;
                  return defer.resolve(html);
                };
              })(this),
              error: function(e) {
                return defer.reject(e);
              }
            });
          }
          return defer.promise;
        };

        HelpCenterGenerator.prototype.compile = function(template, menu, page) {
          var html;
          html = template.replace(/\{\{(?:slug|menu|title|description|content)\}\}/g, function(term) {
            switch (term) {
              case '{{slug}}':
                return page.id;
              case '{{menu}}':
                return menu;
              case '{{title}}':
                return page.title;
              case '{{description}}':
                return page.description;
              case '{{content}}':
                return page.html;
            }
          });
          return html;
        };

        HelpCenterGenerator.prototype.compileMenu = function(pages) {
          var article, articleLi, articleUl, k, l, len, len1, len2, li, m, outline, page, ref, section, sectionLi, sectionUl, ul;
          ul = $('<ul class="pages"/>');
          for (k = 0, len = pages.length; k < len; k++) {
            page = pages[k];
            li = $("<li><a href=\"/" + page.id + ".html\">" + page.title + "</a></li>").appendTo(ul);
            sectionUl = $('<ul class="sections"/>').appendTo(li);
            outline = this.getOutline(page.html);
            for (l = 0, len1 = outline.length; l < len1; l++) {
              section = outline[l];
              sectionLi = $("<li><a href=\"" + page.id + ".html#" + section.id + "\">" + section.title + "</a></li>").appendTo(sectionUl);
              articleUl = $('<ul class="articles"/>').appendTo(sectionLi);
              ref = section.articles;
              for (m = 0, len2 = ref.length; m < len2; m++) {
                article = ref[m];
                articleLi = $("<li><a href=\"" + page.id + ".html#" + article.id + "\">" + article.title + "</a></li>").appendTo(articleUl);
              }
            }
          }
          return ul.wrap('<div/>').parent().html();
        };

        HelpCenterGenerator.prototype.getOutline = function(html) {
          var content, outline;
          content = $(this.normalize(html));
          outline = [];
          content.filter('section').each(function(i, e) {
            var articles, title;
            title = $(e).find('h1.title');
            articles = [];
            $(e).find('article h2.title').each(function(si, se) {
              return articles.push({
                id: $(se).closest('article').attr('id'),
                title: $(se).text()
              });
            });
            return outline.push({
              id: title.closest('section').attr('id'),
              title: title.text(),
              articles: articles
            });
          });
          return outline;
        };

        HelpCenterGenerator.prototype.normalize = function(html) {
          var body, h1s;
          body = $(html).appendTo('<div/>').parent();
          h1s = body.find('h1');
          h1s.each((function(_this) {
            return function(i, h1) {
              var h2s, section, sectionBody;
              h1 = $(h1).addClass('title');
              section = $('<section id="' + _this.createSlugFromText(h1.text()) + '"></section>').insertBefore(h1);
              sectionBody = $('<div class="body"></div>');
              h1.nextUntil('h1').appendTo(sectionBody);
              sectionBody.insertAfter(h1);
              h1.appendTo(section);
              sectionBody.appendTo(section);
              h2s = sectionBody.find('h2');
              return h2s.each(function(j, h2) {
                var article, articleBody;
                h2 = $(h2).addClass('title');
                article = $('<article id="' + _this.createSlugFromText(h2.text()) + '"></article>').insertBefore(h2);
                articleBody = $('<div class="body"></div>');
                h2.nextUntil('h1, h2').appendTo(articleBody);
                articleBody.insertAfter(h2);
                h2.appendTo(article);
                return articleBody.appendTo(article);
              });
            };
          })(this));
          return body.html();
        };

        return HelpCenterGenerator;

      })();
      return new HelpCenterGenerator();
    }
  ]);

}).call(this);
