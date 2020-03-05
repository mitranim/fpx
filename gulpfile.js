'use strict'

/**
 * Dependencies
 */

const $                 = require('gulp-load-plugins')()
const afr               = require('afr')
const cp                = require('child_process')
const del               = require('del')
const fs                = require('fs')
const gulp              = require('gulp')
const log               = require('fancy-log')
const {compileTemplate} = require('statil')
const {promisify}       = require('util')
const {Transform}       = require('stream')
const {md}              = require('./md')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

/**
 * Globals
 */

const SRC_SCRIPT_FILES      = 'src/**/*.js'
const SRC_DOC_HTML          = 'docs/templates/index.html'
const SRC_DOC_MD            = 'docs/templates/index.md'
const SRC_DOC_STYLE_FILES   = 'docs/styles/**/*.scss'
const SRC_DOC_STYLE_MAIN    = 'docs/styles/docs.scss'
const SRC_DOC_SCRIPT_MAIN   = 'docs/scripts/docs.js'

const OUT_ES_DIR            = 'es'
const OUT_DIST_DIR          = 'dist'
const OUT_DOC_DIR           = 'gh-pages'
const OUT_DOC_HTML_FILE     = 'gh-pages/index.html'
const OUT_ES_FILES          = 'es/**/*.js'
const OUT_DIST_SCRIPT_FILES = 'dist/**/*.js'
const OUT_SCRIPT_MAIN       = require('./package').main

const TEST_SCRIPT_FILES     = 'test/**/*.js'

const GulpErr = msg => ({showStack: false, toString: () => msg})

const COMMIT = cp.execSync('git rev-parse --short HEAD').toString().trim()
const {version: VERSION} = require('./package.json')
const PROD = process.env.NODE_ENV === 'production'

/**
 * Tasks
 */

/* --------------------------------- Clear ---------------------------------- */

gulp.task('clear', () => (
  del([
    OUT_DIST_SCRIPT_FILES,
    OUT_ES_FILES,
    // Skips dotfiles like `.git` and `.gitignore`
    `${OUT_DOC_DIR}/*`,
  ]).catch(console.error.bind(console))
))

/* ---------------------------------- Lib -----------------------------------*/

gulp.task('lib:build', () => (
  gulp.src(SRC_SCRIPT_FILES)
    .pipe($.babel())
    .pipe(gulp.dest(OUT_ES_DIR))
    .pipe($.babel({
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', {strict: true}],
      ],
    }))
    .pipe(gulp.dest(OUT_DIST_DIR))
    // Ensures ES5 compliance and lets us measure minified size
    .pipe($.terser({
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
  $.watch(SRC_SCRIPT_FILES, gulp.series('lib:build', 'lib:test'))
  $.watch(TEST_SCRIPT_FILES, gulp.series('lib:test'))
})

/* --------------------------------- HTML -----------------------------------*/

gulp.task('docs:templates:build', async () => {
  const vars = {PROD, COMMIT, VERSION}

  const mdInput = await readFile(SRC_DOC_MD, 'utf8')
  const mdOut = md(compileTemplate(mdInput)(vars))

  const htmlInput = await readFile(SRC_DOC_HTML, 'utf8')
  const htmlOut = compileTemplate(htmlInput)({...vars, content: mdOut})

  await writeFile(OUT_DOC_HTML_FILE, htmlOut)
})

gulp.task('docs:templates:watch', () => {
  $.watch(SRC_DOC_HTML, gulp.series('docs:templates:build'))
  $.watch(SRC_DOC_MD, gulp.series('docs:templates:build'))
})

/* -------------------------------- Styles ----------------------------------*/

gulp.task('docs:styles:build', () => (
  gulp.src(SRC_DOC_STYLE_MAIN)
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.cleanCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false,
      compatibility: {properties: {colors: false}},
    }))
    .pipe(gulp.dest(OUT_DOC_DIR))
))

gulp.task('docs:styles:watch', () => {
  $.watch(SRC_DOC_STYLE_FILES, gulp.series('docs:styles:build'))
})

/* ------------------------------- Scripts ----------------------------------*/

gulp.task('docs:scripts:copy', () => (
  gulp.src(OUT_SCRIPT_MAIN)
    .pipe(new Transform({
      objectMode: true,
      transform(file, __, done) {
        file.contents = Buffer.from(`
// Transpiled version. See src/fpx.js.
void function(exports) {
${String(file.contents)}
}(window.fpx = window.f = {});
`.trim())
        done(undefined, file)
      },
    }))
    .pipe(gulp.dest(OUT_DOC_DIR))
))

gulp.task('docs:scripts:transpile', () => (
  gulp.src(SRC_DOC_SCRIPT_MAIN)
    .pipe($.babel())
    .pipe(new Transform({
      objectMode: true,
      transform(file, __, done) {
        file.contents = Buffer.from(`
void function() {
'use strict';

${String(file.contents)}
}();
`.trim())
        done(undefined, file)
      },
    }))
    .pipe(gulp.dest(OUT_DOC_DIR))
))

gulp.task('docs:scripts:build', gulp.parallel('docs:scripts:copy', 'docs:scripts:transpile'))

gulp.task('docs:scripts:watch', () => {
  $.watch(OUT_SCRIPT_MAIN, gulp.series('docs:scripts:copy'))
  $.watch(SRC_DOC_SCRIPT_MAIN, gulp.series('docs:scripts:transpile'))
})

/* -------------------------------- Server ----------------------------------*/

gulp.task('docs:server', () => {
  const ds = new class extends afr.Devserver {
    onRequest(req, res) {
      req.url = req.url.replace(/^\/fpx\//, '').replace(/^[/]*/, '/')
      super.onRequest(req, res)
    }
  }()
  ds.watchFiles('./gh-pages')
  ds.serveFiles('./gh-pages')
  ds.listen(3474)
})

/* -------------------------------- Default ---------------------------------*/

gulp.task('buildup', gulp.parallel(
  gulp.series('lib:build', 'docs:scripts:build'),
  'docs:templates:build',
  'docs:styles:build'
))

gulp.task('watch', gulp.parallel(
  'lib:watch',
  'docs:templates:watch',
  'docs:styles:watch',
  'docs:scripts:watch',
  'docs:server'
))

gulp.task('build', gulp.series('clear', 'buildup', 'lib:test'))

gulp.task('default', gulp.series('clear', 'buildup', 'lib:test', 'watch'))
