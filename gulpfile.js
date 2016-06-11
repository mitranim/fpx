'use strict'

/* ***************************** Dependencies ********************************/

const $ = require('gulp-load-plugins')()
const bs = require('browser-sync').create()
const del = require('del')
const {exec} = require('child_process')
const gulp = require('gulp')
const statilConfig = require('./statil')

/* ******************************** Globals **********************************/

const src = {
  lib: 'lib/**/*.js',
  dist: 'dist/**/*.js',
  docHtml: 'docs/html/**/*',
  docStyles: 'docs/styles/**/*.scss',
  docStylesMain: 'docs/styles/docs.scss',
  docFonts: 'node_modules/font-awesome/fonts/**/*',
  docScriptLib: 'dist/fpx.js',
  docScripts: 'docs/scripts/**/*.js',
  test: 'test/**/*.js'
}

const out = {
  lib: 'dist',
  docHtml: 'gh-pages',
  docStyles: 'gh-pages/styles',
  docFonts: 'gh-pages/fonts',
  docScripts: 'gh-pages/scripts'
}

const testCommand = require('./package').scripts.test

function noop () {}

/* ********************************* Tasks ***********************************/

/* ---------------------------------- Lib -----------------------------------*/

gulp.task('lib:clear', () => (
  del(out.lib).catch(noop)
))

gulp.task('lib:clear-min', () => (
  del(out.lib + '/**/*.min.js').catch(noop)
))

gulp.task('lib:compile', () => (
  gulp.src(src.lib)
    .pipe($.babel())
    .pipe(gulp.dest(out.lib))
))

// Purely for minified code size evaluation.
gulp.task('lib:minify', () => (
  gulp.src(src.dist)
    .pipe($.uglify({
      mangle: true,
      compress: {screw_ie8: true},
      wrap: true
    }))
    .pipe($.rename(path => {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest(out.lib))
))

gulp.task('lib:test', done => {
  $.util.log('Test started.')

  exec(testCommand, (err, stdout, stderr) => {
    process.stdout.write(stdout)
    process.stderr.write(stderr)

    if (err) {
      throw new $.util.PluginError('lib:test', 'Test failed', {showProperties: false})
    } else {
      $.util.log('Test finished.')
      done()
    }
  })
})

gulp.task('lib:build', gulp.series('lib:compile', 'lib:minify'))

gulp.task('lib:rebuild', gulp.series('lib:clear', 'lib:build'))

gulp.task('lib:watch', () => {
  $.watch(src.lib, gulp.parallel('lib:test', gulp.series('lib:clear-min', 'lib:build')))
  $.watch(src.test, gulp.series('lib:test'))
})

/* --------------------------------- HTML -----------------------------------*/

gulp.task('docs:html:clear', () => (
  del(out.docHtml + '/**/*.html').catch(noop)
))

gulp.task('docs:html:compile', () => (
  gulp.src(src.docHtml)
    .pipe($.statil(statilConfig))
    .pipe(gulp.dest(out.docHtml))
))

gulp.task('docs:html:build', gulp.series('docs:html:clear', 'docs:html:compile'))

gulp.task('docs:html:watch', () => {
  // No docs:html:clear because it confuses browser-sync's file watcher
  $.watch(src.docHtml, gulp.series('docs:html:compile'))
})

/* -------------------------------- Styles ----------------------------------*/

gulp.task('docs:styles:clear', () => (
  del(out.docStyles).catch(noop)
))

gulp.task('docs:styles:compile', () => (
  gulp.src(src.docStylesMain)
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.cleanCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false,
      compatibility: {properties: {colors: false}}
    }))
    .pipe(gulp.dest(out.docStyles))
))

gulp.task('docs:styles:build',
  gulp.series('docs:styles:clear', 'docs:styles:compile'))

gulp.task('docs:styles:watch', () => {
  // No docs:styles:clear because it confuses browser-sync's file watcher
  $.watch(src.docStyles, gulp.series('docs:styles:compile'))
})

/* -------------------------------- Fonts -----------------------------------*/

gulp.task('docs:fonts:clear', () => (
  del(out.docFonts).catch(noop)
))

gulp.task('docs:fonts:copy', () => (
  gulp.src(src.docFonts).pipe(gulp.dest(out.docFonts))
))

gulp.task('docs:fonts:build', gulp.series('docs:fonts:copy'))

gulp.task('docs:fonts:watch', () => {
  $.watch(src.docFonts, gulp.series('docs:fonts:build'))
})

/* ------------------------------- Scripts ----------------------------------*/

gulp.task('docs:scripts:clear', () => (
  del(out.docScripts).catch(noop)
))

gulp.task('docs:scripts:lib', () => (
  gulp.src(src.docScriptLib)
    .pipe($.wrap(
`// Built version. See lib/fpx.js.
!function (exports) {
<%= contents %>

Object.assign(window, exports);
}(window.fpx = {});`))
    .pipe(gulp.dest(out.docScripts))
))

gulp.task('docs:scripts:copy', () => (
  gulp.src(src.docScripts)
    .pipe($.babel())
    .pipe($.wrap(
`!function () {
'use strict';

<%= contents %>
}();`))
    .pipe(gulp.dest(out.docScripts))
))

gulp.task('docs:scripts:build', gulp.series(
  'docs:scripts:clear',
  gulp.parallel('docs:scripts:lib', 'docs:scripts:copy')
))

gulp.task('docs:scripts:watch', () => {
  // No docs:scripts:clear because it confuses browser-sync's file watcher
  $.watch(src.docScriptLib, gulp.series('docs:scripts:lib'))
  $.watch(src.docScripts, gulp.series('docs:scripts:copy'))
})

/* -------------------------------- Server ----------------------------------*/

gulp.task('docs:server', () => (
  bs.init({
    startPath: '/fpx/',
    server: {
      baseDir: 'gh-pages',
      middleware: [
        (req, res, next) => {
          req.url = req.url.replace(/^\/fpx\//, '').replace(/^[/]*/, '/')
          next()
        }
      ]
    },
    port: 3474,
    files: 'gh-pages',
    open: false,
    online: false,
    ui: false,
    ghostMode: false,
    notify: false
  })
))

/* -------------------------------- Default ---------------------------------*/

gulp.task('build', gulp.series(
  'lib:clear', 'lib:build', 'lib:test',
  gulp.parallel('docs:scripts:build', 'docs:html:build', 'docs:styles:build', 'docs:fonts:build')
))

gulp.task('watch', gulp.parallel(
  'lib:watch', 'docs:html:watch', 'docs:styles:watch', 'docs:fonts:watch',
  'docs:scripts:watch', 'docs:server'
))

gulp.task('default', gulp.series('build', 'watch'))
