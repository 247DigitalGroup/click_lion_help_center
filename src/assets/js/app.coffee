if WOW?
  new WOW().init()

if FastClick?
  FastClick.attach document.body

unless ClickLion? then window.ClickLion = {}

init = (context) ->

  initTooltipster = () ->
    if $::tooltipster?
      $ '.tooltip'
        .tooltipster
          delay: 0

  initImagePicker = (_context = document) ->
    if $::clImagePicker?
      $ _context
        .find 'label[data-image-picker]'
        .clImagePicker()

  initDatePicker = (_context = document) ->
    if $::fdatepicker?
      $ _context
        .find '.date-picker'
        .each (i, e) ->
          base = $ e
            .closest '.date-picker-base' 
          if base.length is 0 then base = $ 'body'
          $ e
            .fdatepicker
              format: 'dd-mm-yyyy'
              appendTo: base

  initInputMask = (_context = document) ->
    if $::inputmask?
      $ _context
        .find ':input'
        .inputmask()

  initTooltipster()
  initImagePicker context
  initDatePicker context
  initInputMask context

$.fn.clReinit = () ->
  init @

ClickLion['app'] = 

  ready: () ->

    init document

if $?
  $ document
    .ready ClickLion['app'].ready