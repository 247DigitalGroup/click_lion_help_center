fs = require 'fs'
cheerio = require 'cheerio'
_ = require 'underscore'

parse = (html) ->
  
  $ = cheerio.load html

  result =
    index: parseInt $('.meta-index').text(), 10
    url: $('.meta-url').text()
    title: $('.meta-title').text()
    description: $('.meta-description').text()

  articlesMap = (i, e) ->
    article = {}
    article.id = $(e).attr 'id'
    article.title = $(e).find('> h2.title').text()
    return article

  sectionsMap = (i, e) -> 
    section = {}
    section.id = $(e).attr 'id'
    section.title = $(e).find('> h1.title').text()
    section.articles = $ e
      .find('article')
      .map articlesMap
      .get()
    return section

  result.sections = $ 'section[id]'
    .map sectionsMap
    .get()

  return result

pages = fs
  .readdirSync './www'
  .filter (f) ->
    return f.substr(-5) is '.html'
  .map (f) ->
    html = fs.readFileSync './www/' + f, 'utf-8'
    return parse html

pages = _.sortBy pages, (e) ->
  return e.index

console.log JSON.stringify(pages, null, '  ')
fs.writeFileSync './src/_data/docs.jade', '- menu = ' + JSON.stringify(pages), 'utf-8'

