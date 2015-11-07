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

    initEditor = () ->
      $ '.document'
        .on 'click', 'p, h1.title, h2.title', (e) ->
          $ @
            .attr 'data-text', $(@).text()
            .prop 'contenteditable', true
            .unbind 'focusout'
            .focusout (e) ->
                newText = $(@).text()
                oldText = $(@).attr 'data-text'
                if newText != oldText
                  json =
                    oldText: oldText
                    newText: newText
                    element: $(@).get(0).tagName
                    section: $(@).parents('section[id]').attr 'id'
                    article: $(@).parents('article[id]').attr 'id'
                    url: $('.meta-url').text()
                  push json
                  $(@).css
                    backgroundColor: 'yellow'
                return
            .focus()

    push = (json) ->
      $.ajax
        method: 'POST'
        url: 'http://54.169.214.119:3000/changes'
        dataType: 'json'
        data: json

    initFixedMenu()
    initAnchorLinks()
    initScrollSpy()
    initEditor()

if $?
  $ document
    .ready ClickLion['docs'].ready