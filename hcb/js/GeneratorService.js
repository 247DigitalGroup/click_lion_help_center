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
                return page.slug;
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
          var article, articleLi, articleUl, j, k, l, len, len1, len2, li, outline, page, ref, section, sectionLi, sectionUl, ul;
          ul = $('<ul class="pages"/>');
          for (j = 0, len = pages.length; j < len; j++) {
            page = pages[j];
            li = $("<li><a href=\"/" + page.slug + ".html\">" + page.title + "</a></li>").appendTo(ul);
            sectionUl = $('<ul class="sections"/>').appendTo(li);
            outline = this.getOutline(page.html);
            for (k = 0, len1 = outline.length; k < len1; k++) {
              section = outline[k];
              sectionLi = $("<li><a href=\"" + page.slug + ".html#" + section.slug + "\">" + section.title + "</a></li>").appendTo(sectionUl);
              articleUl = $('<ul class="articles"/>').appendTo(sectionLi);
              ref = section.articles;
              for (l = 0, len2 = ref.length; l < len2; l++) {
                article = ref[l];
                articleLi = $("<li><a href=\"" + page.slug + ".html#" + article.slug + "\">" + article.title + "</a></li>").appendTo(articleUl);
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
                slug: $(se).closest('article').attr('id'),
                title: $(se).text()
              });
            });
            return outline.push({
              slug: title.closest('section').attr('id'),
              title: title.text(),
              articles: articles
            });
          });
          return outline;
        };

        HelpCenterGenerator.prototype.normalize = function(html) {
          var article, body, content, dom, h1, h1s, h2, h2s, j, k, len, len1, section, subBody;
          content = $(html);
          dom = [];
          h1s = content.filter('h1').add(content.find('h1'));
          for (j = 0, len = h1s.length; j < len; j++) {
            h1 = h1s[j];
            h1 = $(h1);
            h1.addClass('title');
            body = $('<div class="body"/>').append(h1.nextUntil('h1'));
            section = $('<section/>').attr('id', this.createSlugFromText(h1.text())).append(body).after(h1).prepend(h1);
            dom.push(section);
            h2s = body.filter('h2').add(body.find('h2'));
            for (k = 0, len1 = h2s.length; k < len1; k++) {
              h2 = h2s[k];
              h2 = $(h2);
              h2.addClass('title');
              subBody = $('<div class="body"/>').append(h2.nextUntil('h1, h2'));
              article = $('<article/>').attr('id', this.createSlugFromText(h2.text())).append(subBody).insertAfter(h2).prepend(h2);
            }
          }
          return $('<div/>').append(dom).html();
        };

        return HelpCenterGenerator;

      })();
      return new HelpCenterGenerator();
    }
  ]);

}).call(this);
