gulp = require 'gulp'
gutil  = require 'gulp-util'
minimist = require 'minimist'
nib = require 'nib'
del = require 'del'

debug = true

plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*']
    replaceString: /\bgulp[\-.]/
  })


basePaths =

  src: 'src'
  dest: 'www'
  assetSrc: 'src/assets'
  assetDest: 'www/assets'
  compressed: 'www/assets/bin'
  bowerDirectory: '/bower_components'
  bower: 'src/assets/bower_components'

paths =

  img:
    src: basePaths.assetSrc + '/img'
    dest: basePaths.assetDest + '/img'

  html:
    src: basePaths.src
    dest: basePaths.dest
    jade: [
      "#{basePaths.src}/**/*.jade"
      "!#{basePaths.src}/**/_**/**"
      "!#{basePaths.src}/**/_*"
      "!#{basePaths.bower}/**"
    ]

  js:
    src: basePaths.assetSrc + '/js'
    dest: basePaths.assetDest + '/js'
    coffee: [
      "#{basePaths.assetSrc}/js/**/*.coffee"
      "!#{basePaths.assetSrc}/js/**/_**/**"
      "!#{basePaths.assetSrc}/js/**/_*"
    ]

  css:
    src: basePaths.assetSrc + '/css'
    dest: basePaths.assetDest + '/css'
    stylus: [
      "#{basePaths.assetSrc}/css/**/*.styl"
      "!#{basePaths.assetSrc}/css/**/_**/**"
      "!#{basePaths.assetSrc}/css/**/_*"
    ]

compressed =
  'app.css':
    [
      '/css/app.css'
      basePaths.bowerDirectory + '/animate.css/animate.min.css'
      basePaths.bowerDirectory + '/fontawesome/css/font-awesome.min.css'
    ]

configs =

  jade:
    pretty: false
    locals:
      bower: basePaths.bowerDirectory
      # set debug mode
      debug: debug
      # get compress file data
      _c: (file) ->
        if compressed[file]?
          return compressed[file]
        else
          return []
      # format number
      _f: (input, decimal) ->
        parseFloat input
          .toFixed decimal
          .replace /\B(?=(\d{3})+\b)/g, ','
      # create slug
      _s: (str) ->
        str = str
          .toLowerCase()
          .replace /\ /g, '-'
          .replace /[^\w-]+/g,''
          .replace /\-\-/g, '-'
        return str
      # get asset src
      _a: (src) ->
        if debug
          if src.substr(0, 5) is '/img/' then return src
          return '/assets' + src
        else
          if src.substr(0, 5) is '/img/' then return src
          return '/assets' + src

  coffee:
    bare: false

  stylus:
    compress: true
    use: nib()
    import: 'nib'

  size:
    showFiles: true
    gzip: true

  clone:
    src: [
        "#{basePaths.src}/**/*"
        "!#{basePaths.src}/**/*.coffee"
        "!#{basePaths.src}/**/*.styl"
        "!#{basePaths.src}/**/*.jade"
        "!#{basePaths.src}/**/_**/**"
        "!#{basePaths.src}/**/_*"
      ]

knowOptions =
  string: 'p',
  default: { p: 8080 }

options = minimist(process.argv.slice(2), knowOptions)

onError = (e) ->
  gutil.log e
  this.emit 'end'

onChange = (e) ->
  gutil.log 'file', gutil.colors.cyan(e.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(e.type)

gulp.task 'jade', [], () ->
  gulp.src paths.html.jade, noglobstar: false
    .pipe plugins.jade(configs.jade).on('error', onError)
    # .pipe plugins.size(configs.size)
    # .pipe plugins.connect.reload()
    .pipe gulp.dest(paths.html.dest)

gulp.task 'slim', [], () ->
  gulp.src paths.html.slim, noglobstar: false
    .pipe plugins.slim(configs.slim).on('error', onError)
    # .pipe plugins.size(configs.size)
    # .pipe plugins.connect.reload()
    .pipe gulp.dest(paths.html.dest)

gulp.task 'coffee', [], () ->
  gulp.src paths.js.coffee
    .pipe plugins.coffee(configs.coffee).on('error', onError)
    # .pipe plugins.size(configs.size)
    # .pipe plugins.connect.reload()
    .pipe gulp.dest(paths.js.dest)

gulp.task 'stylus', [], () ->
  gulp.src paths.css.stylus
    .pipe plugins.stylus(configs.stylus).on('error', onError)
    # .pipe plugins.size(configs.size)
    # .pipe plugins.connect.reload()
    .pipe gulp.dest(paths.css.dest)

gulp.task 'html', ['jade']
gulp.task 'js', ['coffee']
gulp.task 'css', ['stylus']

gulp.task 'clone', () ->
  gulp.src configs.clone.src
    # .pipe plugins.size(configs.size)
    .pipe gulp.dest(basePaths.dest)
    .on 'error', (e) ->
      console.log e
      this.emit 'end'

gulp.task 'clean', (cb) ->
  del basePaths.dest

gulp.task 'connect', () ->
  plugins.connect.server({
    port: options.p
    root: './www',
    livereload: false
  })

gulp.task 'compress-css', [], () ->
  gulp.src [
        "#{paths.css.src}/gia.ui.css"
        "#{basePaths.bower}/fontawesome/css/font-awesome.min.css"
        "#{basePaths.bower}/animate.css/animate.min.css"
        "#{basePaths.bower}/angular-loading-bar/build/loading-bar.min.css"
        "#{basePaths.bower}/angular-ui-notification/dist/angular-ui-notification.min.css"
        "#{paths.css.dest}/app.css"
      ]
    # .pipe plugins.size(configs.size)
    .pipe plugins.concat('app.css')
    .pipe plugins.minifyCss()
    .pipe gulp.dest(basePaths.compressed)

gulp.task 'compress-js', [], () ->
  gulp.src [
        "#{basePaths.bower}/jquery/dist/jquery.min.js"
        "#{basePaths.bower}/angular/angular.min.js"
        "#{basePaths.bower}/angular-route/angular-route.min.js"
        "#{basePaths.bower}/angular-sanitize/angular-sanitize.min.js"
        "#{basePaths.bower}/angular-tooltips/dist/angular-tooltips.min.js"
        "#{basePaths.bower}/angular-modal/modal.min.js"
        "#{basePaths.bower}/angular-loading-bar/build/loading-bar.min.js"
        "#{basePaths.bower}/angular-ui-notification/dist/angular-ui-notification.min.js"
        "#{basePaths.bower}/angular-animate/angular-animate.min.js"
        "#{basePaths.bower}/velocity/velocity.min.js"
        "#{basePaths.bower}/velocity/velocity.ui.min.js"
        "#{basePaths.bower}/angular-velocity/angular-velocity.min.js"
        "#{paths.js.dest}/app.js"
        "#{paths.js.dest}/ClickLionAPIService.js"
        "#{paths.js.dest}/ArticleReviewDirective.js"
        "#{paths.js.dest}/CampaignsController.js"
        "#{paths.js.dest}/DomainsController.js"
        "#{paths.js.dest}/routes.js"
      ]
    # .pipe plugins.size(configs.size)
    .pipe plugins.concat('app.js')
    # .pipe plugins.uglify()
    .pipe gulp.dest(basePaths.compressed)

gulp.task 'watch', [], () ->
  gulp.watch paths.html.jade, ['html']
    .on 'change', onChange
  gulp.watch paths.js.coffee, ['js']
    .on 'change', onChange
  gulp.watch paths.css.stylus, ['css']
    .on 'change', onChange
  # gulp.watch configs.clone.src, ['clone']
  # .on 'change', onChange

gulp.task 'default', () ->
  gutil.log gutil.colors.cyan('gulp build') + ' to rebuild all files.'
  gutil.log gutil.colors.cyan('gulp clean') + ' to clean all built files.'
  gutil.log gutil.colors.cyan('gulp compile') + ' to compile HTML, JS, CSS.'
  gutil.log gutil.colors.cyan('gulp server') + ' to start server on 8080 port.'
  gutil.log gutil.colors.cyan('gulp server -p 8888') + ' to start server on 8888 port.'

gulp.task 'compress', ['compress-css', 'compress-js']
gulp.task 'compile', ['html', 'js', 'css', 'clone']
gulp.task 'build', ['clean', 'compile', 'compress']
gulp.task 'server', ['compile', 'connect', 'watch']
gulp.task 'preview', ['connect']