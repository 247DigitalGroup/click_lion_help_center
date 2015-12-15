(function() {
  angular.module('HCB').factory('parser', [
    '$http', function($http) {
      var HelpCenterParser;
      HelpCenterParser = (function() {
        function HelpCenterParser() {}

        HelpCenterParser.prototype.getPageFromHTML = function(html) {
          var page;
          page = {
            html: html,
            title: $(html).find('.title-bar .title').text(),
            description: $(html).find('.title-bar .description').text(),
            body: $(html).find('.doc-body.document').html()
          };
          return page;
        };

        HelpCenterParser.prototype.getTitleFromHTML = function(html) {
          return $(html).find('.title-bar .title').text();
        };

        HelpCenterParser.prototype.getDescriptionFromHTML = function(html) {
          return $(html).find('.title-bar .description').text();
        };

        HelpCenterParser.prototype.getBodyFromHTML = function(html) {
          return $(html).find('.doc-body.document').html();
        };

        return HelpCenterParser;

      })();
      return new HelpCenterParser();
    }
  ]);

}).call(this);
