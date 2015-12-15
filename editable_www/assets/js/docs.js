(function() {
  if (typeof ClickLion === "undefined" || ClickLion === null) {
    window.ClickLion = {};
  }

  ClickLion['docs'] = {
    ready: function() {
      var initAnchorLinks, initFixedMenu, initScrollSpy, lockBody, unlockBody;
      lockBody = function() {
        $('body').addClass('locked');
        return $('.fixed-menu').removeClass('hfso');
      };
      unlockBody = function() {
        $('body').removeClass('locked');
        return $('.fixed-menu').addClass('hfso');
      };
      initAnchorLinks = function() {
        return $(window).on('hashchange', function(e) {
          var hash;
          unlockBody();
          hash = window.location.hash;
          if (hash.length > 0) {
            if ($(hash).length > 0) {
              $('.wrapper').stop().animate({
                scrollTop: $(hash).get(0).offsetTop - $('.fixed-bar').height() - 20
              }, 0, function() {});
            }
          }
          return e.preventDefault();
        }).trigger('hashchange');
      };
      initScrollSpy = function() {
        var tops, wrapperCalcTops, wrapperScrollBind, wrapperScrollTimeout;
        tops = {};
        wrapperCalcTops = function() {
          var block, blocks, i, len, results, top;
          top = {};
          blocks = $('.content').find('section, article');
          results = [];
          for (i = 0, len = blocks.length; i < len; i++) {
            block = blocks[i];
            results.push(tops[$(block).attr('id')] = $(block).offset().top);
          }
          return results;
        };
        wrapperScrollBind = function(e) {
          var blockId, id, min, top;
          wrapperCalcTops();
          min = 100000;
          blockId = null;
          for (id in tops) {
            top = tops[id];
            if ((0 <= top && top < min)) {
              min = top;
              blockId = id;
            }
          }
          $('.content').find('section, article').removeClass('a').end().find("#" + blockId).addClass('a').parents('article, section').addClass('a');
          return $('.doc-index ul.sections').find('li').removeClass('a').end().find("a[href$=#" + blockId + "]").parents('li').addClass('a');
        };
        wrapperScrollTimeout = null;
        return $('.wrapper').on('scroll', function(e) {
          if (wrapperScrollTimeout != null) {
            clearTimeout(wrapperScrollTimeout);
          }
          return wrapperScrollTimeout = setTimeout(function() {
            return wrapperScrollBind(e);
          }, 50);
        }).scroll();
      };
      initFixedMenu = function() {
        $('a.menu').click(function(e) {
          lockBody();
          return e.preventDefault();
        });
        return $('a.close').click(function(e) {
          unlockBody();
          return e.preventDefault();
        });
      };
      initFixedMenu();
      initAnchorLinks();
      return initScrollSpy();
    }
  };

  if (typeof $ !== "undefined" && $ !== null) {
    $(document).ready(ClickLion['docs'].ready);
  }

}).call(this);
