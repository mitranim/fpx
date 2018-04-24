'use strict'

/**
 * Dependencies
 */

const $ = require('gulp-load-plugins')()
const bs = require('browser-sync').create()
const del = require('del')
const gulp = require('gulp')
const log = require('fancy-log')
const {Transform} = require('stream')
const cp = require('child_process')
const statilConfig = require('./statil')

/**
 * Globals
 */

const srcScriptFiles = 'src/**/*.js'
const srcDocHtmlFiles = 'docs/html/**/*'
const srcDocStyleFiles = 'docs/styles/**/*.scss'
const srcDocStyleMain = 'docs/styles/docs.scss'
const srcDocScriptMain = 'docs/scripts/docs.js'

const outEsDir = 'es'
const outDistDir = 'dist'
const outDocDir = 'gh-pages'
const outDocStyleDir = 'gh-pages/styles'
const outDocScriptDir = 'gh-pages/scripts'
const outEsFiles = 'es/**/*.js'
const outDistScriptFiles = 'dist/**/*.js'
const outMainScriptFile = require('./package').main

const testScriptFiles = 'test/**/*.js'

const GulpErr = msg => ({showStack: false, toString: () => msg})

process.env.COMMIT = cp.execSync('git rev-parse --short HEAD').toString().trim()

/**
 * Tasks
 */

/* --------------------------------- Clear ---------------------------------- */

gulp.task('clear', () => (
  del([
    outDistScriptFiles,
    outEsFiles,
    // Skips dotfiles like `.git` and `.gitignore`
    `${outDocDir}/*`,
  ]).catch(console.error.bind(console))
))

/* ---------------------------------- Lib -----------------------------------*/

gulp.task('lib:build', () => (
  gulp.src(srcScriptFiles)
    .pipe($.babel())
    .pipe(gulp.dest(outEsDir))
    .pipe($.babel({
      plugins: [
        ['transform-es2015-modules-commonjs', {strict: true}],
      ],
    }))
    .pipe(gulp.dest(outDistDir))
    // Ensures ES5 compliance and lets us measure minified size
    .pipe($.uglify({
      mangle: {toplevel: true},
      compress: {warnings: false},
    }))
    .pipe(new Transform({
      objectMode: true,
      transform(file, __, done) {
        log(`Minified size: ${file.relative} — ${file._contents.length} bytes`)
        done()
      },
    }))
))

let testProc = null

gulp.task('lib:test', done => {
  // Still running, let it finish
  if (testProc && testProc.exitCode == null) {
    done()
    return
  }

  testProc = cp.fork('./test/test')

  testProc.once('exit', code => {
    done(code ? GulpErr(`Test failed with exit code ${code}`) : null)
  })
})

gulp.task('lib:watch', () => {
  $.watch(srcScriptFiles, gulp.series('lib:build', 'lib:test'))
  $.watch(testScriptFiles, gulp.series('lib:test'))
})

/* --------------------------------- HTML -----------------------------------*/

gulp.task('docs:html:build', () => (
  gulp.src(srcDocHtmlFiles)
    .pipe($.statil(statilConfig))
    .pipe(gulp.dest(outDocDir))
))

gulp.task('docs:html:watch', () => {
  $.watch(srcDocHtmlFiles, gulp.series('docs:html:build'))
})

/* -------------------------------- Styles ----------------------------------*/

gulp.task('docs:styles:build', () => (
  gulp.src(srcDocStyleMain)
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.cleanCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false,
      compatibility: {properties: {colors: false}},
    }))
    .pipe(gulp.dest(outDocStyleDir))
))

gulp.task('docs:styles:watch', () => {
  $.watch(srcDocStyleFiles, gulp.series('docs:styles:build'))
})

/* ------------------------------- Scripts ----------------------------------*/

gulp.task('docs:scripts:copy', () => (
  gulp.src(outMainScriptFile)
    .pipe($.wrap(
`// Transpiled version. See src/fpx.js.
void function(exports) {
<%= contents %>
}(window.fpx = window.f = {});`))
    .pipe(gulp.dest(outDocScriptDir))
))

gulp.task('docs:scripts:compile', () => (
  gulp.src(srcDocScriptMain)
    .pipe($.babel())
    .pipe($.wrap(
`void function() {
'use strict';

<%= contents %>
}();`))
    .pipe(gulp.dest(outDocScriptDir))
))

gulp.task('docs:scripts:build', gulp.parallel('docs:scripts:copy', 'docs:scripts:compile'))

gulp.task('docs:scripts:watch', () => {
  $.watch(outMainScriptFile, gulp.series('docs:scripts:copy'))
  $.watch(srcDocScriptMain, gulp.series('docs:scripts:compile'))
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
  'docs:styles:build'
))

gulp.task('watch', gulp.parallel(
  'lib:watch',
  'docs:html:watch',
  'docs:styles:watch',
  'docs:scripts:watch',
  'docs:server'
))

gulp.task('build', gulp.series('clear', 'buildup', 'lib:test'))

gulp.task('default', gulp.series('clear', 'buildup', 'lib:test', 'watch'))
