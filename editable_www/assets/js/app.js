(function() {
  var init;

  if (typeof WOW !== "undefined" && WOW !== null) {
    new WOW().init();
  }

  if (typeof FastClick !== "undefined" && FastClick !== null) {
    FastClick.attach(document.body);
  }

  if (typeof ClickLion === "undefined" || ClickLion === null) {
    window.ClickLion = {};
  }

  init = function(context) {
    var initDatePicker, initImagePicker, initInputMask, initTooltipster;
    initTooltipster = function() {
      if ($.prototype.tooltipster != null) {
        return $('.tooltip').tooltipster({
          delay: 0
        });
      }
    };
    initImagePicker = function(_context) {
      if (_context == null) {
        _context = document;
      }
      if ($.prototype.clImagePicker != null) {
        return $(_context).find('label[data-image-picker]').clImagePicker();
      }
    };
    initDatePicker = function(_context) {
      if (_context == null) {
        _context = document;
      }
      if ($.prototype.fdatepicker != null) {
        return $(_context).find('.date-picker').each(function(i, e) {
          var base;
          base = $(e).closest('.date-picker-base');
          if (base.length === 0) {
            base = $('body');
          }
          return $(e).fdatepicker({
            format: 'dd-mm-yyyy',
            appendTo: base
          });
        });
      }
    };
    initInputMask = function(_context) {
      if (_context == null) {
        _context = document;
      }
      if ($.prototype.inputmask != null) {
        return $(_context).find(':input').inputmask();
      }
    };
    initTooltipster();
    initImagePicker(context);
    initDatePicker(context);
    return initInputMask(context);
  };

  $.fn.clReinit = function() {
    return init(this);
  };

  ClickLion['app'] = {
    ready: function() {
      return init(document);
    }
  };

  if (typeof $ !== "undefined" && $ !== null) {
    $(document).ready(ClickLion['app'].ready);
  }

}).call(this);
