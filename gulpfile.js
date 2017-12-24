'use strict'

/**
 * Dependencies
 */

const $ = require('gulp-load-plugins')()
const bs = require('browser-sync').create()
const del = require('del')
const {fork} = require('child_process')
const gulp = require('gulp')
const statilConfig = require('./statil')

/**
 * Globals
 */

const _srcDir = 'src'
const esDir = 'es'
const distDir = 'dist'
const srcFiles = 'src/**/*.js'
const esFiles = 'es/**/*.js'
const distFiles = 'dist/**/*.js'
const testFiles = 'test/**/*.js'
const distMain = require('./package').main
const docHtmlFiles = 'docs/html/**/*'
const docStyleFiles = 'docs/styles/**/*.scss'
const docStyleMain = 'docs/styles/docs.scss'
const docFontFiles = 'node_modules/font-awesome/fonts/**/*'
const docScriptMain = 'docs/scripts/docs.js'
const docOutDir = 'gh-pages'
const docOutStyleDir = 'gh-pages/styles'
const docOutFontDir = 'gh-pages/fonts'
const docOutScriptDir = 'gh-pages/scripts'

const GulpErr = msg => ({showStack: false, toString: () => msg})

/**
 * Tasks
 */

/* --------------------------------- Clear ---------------------------------- */

gulp.task('clear', () => (
  del([
    distFiles,
    esFiles,
    // Skips dotfiles like `.git` and `.gitignore`
    `${docOutDir}/*`,
  ]).catch(console.error.bind(console))
))

/* ---------------------------------- Lib -----------------------------------*/

gulp.task('lib:build', () => (
  gulp.src(srcFiles)
    .pipe($.babel())
    .pipe(gulp.dest(esDir))
    .pipe($.babel({
      plugins: [
        'transform-es2015-modules-commonjs',
      ],
    }))
    .pipe(gulp.dest(distDir))
    // Ensures ES5 compliance and shows minified size
    .pipe($.uglify({
      mangle: {toplevel: true},
      compress: {warnings: false},
    }))
    .pipe($.rename(path => {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest(distDir))
))

let testProc = null

gulp.task('lib:test', done => {
  // Still running, let it finish
  if (testProc && testProc.exitCode == null) {
    done()
    return
  }

  testProc = fork('./test/test')

  testProc.once('exit', code => {
    done(code ? GulpErr(`Test failed with exit code ${code}`) : null)
  })
})

gulp.task('lib:watch', () => {
  $.watch(srcFiles, gulp.series('lib:build', 'lib:test'))
  $.watch(testFiles, gulp.series('lib:test'))
})

/* --------------------------------- HTML -----------------------------------*/

gulp.task('docs:html:build', () => (
  gulp.src(docHtmlFiles)
    .pipe($.statil(statilConfig))
    .pipe(gulp.dest(docOutDir))
))

gulp.task('docs:html:watch', () => {
  $.watch(docHtmlFiles, gulp.series('docs:html:build'))
})

/* -------------------------------- Styles ----------------------------------*/

gulp.task('docs:styles:build', () => (
  gulp.src(docStyleMain)
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.cleanCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false,
      compatibility: {properties: {colors: false}},
    }))
    .pipe(gulp.dest(docOutStyleDir))
))

gulp.task('docs:styles:watch', () => {
  $.watch(docStyleFiles, gulp.series('docs:styles:build'))
})

/* -------------------------------- Fonts -----------------------------------*/

gulp.task('docs:fonts:build', () => (
  gulp.src(docFontFiles).pipe(gulp.dest(docOutFontDir))
))

gulp.task('docs:fonts:watch', () => {
  $.watch(docFontFiles, gulp.series('docs:fonts:build'))
})

/* ------------------------------- Scripts ----------------------------------*/

gulp.task('docs:scripts:copy', () => (
  gulp.src(distMain)
    .pipe($.wrap(
`// Built version. See lib/fpx.js.
!function (exports) {
<%= contents %>

Object.assign(window, exports);
}(window.fpx = {});`))
    .pipe(gulp.dest(docOutScriptDir))
))

gulp.task('docs:scripts:compile', () => (
  gulp.src(docScriptMain)
    .pipe($.babel())
    .pipe($.wrap(
`!function () {
'use strict';

<%= contents %>
}();`))
    .pipe(gulp.dest(docOutScriptDir))
))

gulp.task('docs:scripts:build', gulp.parallel('docs:scripts:copy', 'docs:scripts:compile'))

gulp.task('docs:scripts:watch', () => {
  $.watch(distMain, gulp.series('docs:scripts:copy'))
  $.watch(docScriptMain, gulp.series('docs:scripts:compile'))
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
        },
      ],
    },
    port: 3474,
    files: 'gh-pages',
    open: false,
    online: false,
    ui: false,
    ghostMode: false,
    notify: false,
  })
))

/* -------------------------------- Default ---------------------------------*/

gulp.task('buildup', gulp.parallel(
  gulp.series('lib:build', 'docs:scripts:build'),
  'docs:html:build',
  'docs:styles:build',
  'docs:fonts:build'
))

gulp.task('watch', gulp.parallel(
  'lib:watch',
  'docs:html:watch',
  'docs:styles:watch',
  'docs:fonts:watch',
  'docs:scripts:watch',
  'docs:server'
))

gulp.task('build', gulp.series('clear', 'buildup', 'lib:test'))

gulp.task('default', gulp.series('clear', 'buildup', 'lib:test', 'watch'))
