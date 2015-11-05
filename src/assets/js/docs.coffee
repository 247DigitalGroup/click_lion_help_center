unless ClickLion? then window.ClickLion = {}

ClickLion['docs'] = 

  ready: () ->

    lockBody = () ->
      $ 'body'
        .addClass 'locked'
      $ '.fixed-menu'
        .removeClass 'hfso'

    unlockBody = () ->
      $ 'body'
        .removeClass 'locked'
      $ '.fixed-menu'
        .addClass 'hfso'

    initAnchorLinks = () ->
      $ window
        .on 'hashchange', (e) ->
          unlockBody()
          hash = window.location.hash
          if hash.length > 0
            if $(hash).length > 0
              $ '.wrapper'
                .stop()
                .animate
                  scrollTop: $(hash).get(0).offsetTop - $('.fixed-bar').height() - 20
                  , 0, () ->
          e.preventDefault()
        .trigger 'hashchange'

    initScrollSpy = () ->

      tops = {}

      wrapperCalcTops = () ->
        top = {}
        blocks = $ '.content'
          .find 'section, article'
        for block in blocks
          tops[$(block).attr('id')] = $(block).offset().top

      wrapperScrollBind = (e) ->
        wrapperCalcTops()
        min = 100000
        blockId = null
        for id, top of tops
          if 0 <= top < min
            min = top
            blockId = id
        $ '.content'
          .find 'section, article'
            .removeClass 'a'
            .end()
          .find "##{blockId}"
            .addClass 'a'
            .parents 'article, section'
              .addClass 'a'
        $ '.doc-index ul.sections'
          .find 'li'
            .removeClass 'a'
            .end()
          .find "a[href$=##{blockId}]"
            .parents 'li'
              .addClass 'a'

      wrapperScrollTimeout = null
      $ '.wrapper'
        .on 'scroll', (e) ->
          if wrapperScrollTimeout? then clearTimeout wrapperScrollTimeout
          wrapperScrollTimeout = setTimeout () ->
              wrapperScrollBind e
            , 50
        .scroll()

    initFixedMenu = () ->
      $ 'a.menu'
        .click (e) ->
          lockBody()
          e.preventDefault()
      $ 'a.close'
        .click (e) ->
          unlockBody()
          e.preventDefault()

    initFixedMenu()
    initAnchorLinks()
    initScrollSpy()

if $?
  $ document
    .ready ClickLion['docs'].ready