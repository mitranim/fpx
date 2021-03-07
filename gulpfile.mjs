import afr               from 'afr'
import cp                from 'child_process'
import del               from 'del'
import fs                from 'fs'
import gulp              from 'gulp'
import gWatch            from 'gulp-watch'
import gSass             from 'gulp-sass'
import gAutoprefixer     from 'gulp-autoprefixer'
import gCleanCss         from 'gulp-clean-css'
import gTerser           from 'gulp-terser'
import log               from 'fancy-log'
import {compileTemplate} from 'statil'
import {promisify}       from 'util'
import {Transform}       from 'stream'
import {md}              from './md.mjs'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

/**
 * Globals
 */

const SRC_SCRIPT_FILES      = 'fpx.mjs'
const SRC_DOC_HTML          = 'docs/templates/index.html'
const SRC_DOC_MD            = 'docs/templates/index.md'
const SRC_DOC_STYLE_FILES   = 'docs/styles/**/*.scss'
const SRC_DOC_STYLE_MAIN    = 'docs/styles/docs.scss'
const SRC_DOC_SCRIPT_FILES  = 'docs/scripts/*.mjs'

const OUT_DOC_DIR           = 'gh-pages'
const OUT_DOC_HTML_FILE     = 'gh-pages/index.html'

const TEST_SCRIPT_FILES     = 'test/**/*.mjs'

const GulpErr = msg => ({showStack: false, toString: () => msg})

const COMMIT = cp.execSync('git rev-parse --short HEAD').toString().trim()
const {version: VERSION} = JSON.parse(fs.readFileSync('./package.json'))
const PROD = process.env.NODE_ENV === 'production'

/**
 * Tasks
 */

/* --------------------------------- Clear ---------------------------------- */

gulp.task('clear', () => (
  del([
    // Skips dotfiles like `.git` and `.gitignore`.
    `${OUT_DOC_DIR}/*`,
  ]).catch(console.error.bind(console))
))

/* ---------------------------------- Lib -----------------------------------*/

gulp.task('lib:measure', () => (
  gulp.src(SRC_SCRIPT_FILES)
    // Lets us measure minified size.
    .pipe(gTerser({
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

  testProc = cp.fork('./test/test.mjs')

  testProc.once('exit', code => {
    done(code ? GulpErr(`Test failed with exit code ${code}`) : null)
  })
})

gulp.task('lib:watch', () => {
  gWatch(SRC_SCRIPT_FILES, gulp.series('lib:measure', 'lib:test'))
  gWatch(TEST_SCRIPT_FILES, gulp.series('lib:test'))
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
  gWatch(SRC_DOC_HTML, gulp.series('docs:templates:build'))
  gWatch(SRC_DOC_MD, gulp.series('docs:templates:build'))
})

/* -------------------------------- Styles ----------------------------------*/

gulp.task('docs:styles:build', () => (
  gulp.src(SRC_DOC_STYLE_MAIN)
    .pipe(gSass())
    .pipe(gAutoprefixer())
    .pipe(gCleanCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false,
      compatibility: {properties: {colors: false}},
    }))
    .pipe(gulp.dest(OUT_DOC_DIR))
))

gulp.task('docs:styles:watch', () => {
  gWatch(SRC_DOC_STYLE_FILES, gulp.series('docs:styles:build'))
})

/* ------------------------------- Scripts ----------------------------------*/

gulp.task('docs:scripts:copy', () => (
  gulp.src([SRC_SCRIPT_FILES, SRC_DOC_SCRIPT_FILES])
    .pipe(gulp.dest(OUT_DOC_DIR))
))

gulp.task('docs:scripts:build', gulp.series('docs:scripts:copy'))

gulp.task('docs:scripts:watch', () => {
  gWatch([SRC_SCRIPT_FILES, SRC_DOC_SCRIPT_FILES], gulp.series('docs:scripts:copy'))
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
  gulp.series('lib:measure', 'docs:scripts:build'),
  'docs:templates:build',
  'docs:styles:build',
))

gulp.task('watch', gulp.parallel(
  'lib:watch',
  'docs:templates:watch',
  'docs:styles:watch',
  'docs:scripts:watch',
  'docs:server',
))

gulp.task('build', gulp.series('clear', 'buildup', 'lib:test'))

gulp.task('default', gulp.series('clear', 'buildup', 'lib:test', 'watch'))
