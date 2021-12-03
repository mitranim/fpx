/* global Deno */

import * as f from '../fpx.mjs'

const start = performance.now()

const [
  srcPackage,
  srcMain,
  srcTest,
  srcReadme,
] = await Promise.all([
  Deno.readTextFile(`package.json`),
  Deno.readTextFile(`fpx.mjs`),
  Deno.readTextFile(`test/test.mjs`),
  Deno.readTextFile(`doc/readme.md`),
])

function main() {
  dat.reqTests()
  dat.reqDocs()

  const readme = new Templ(srcReadme, dat)
  Deno.writeTextFileSync(`readme.md`, readme.toString())
}

class Templ extends String {
  constructor(src, dat) {
    super(src)
    this.dat = dat
  }

  toString() {
    const replace = (_, key) => this.repl(key)
    return this.valueOf().replace(/{{([^{}]*)}}/g, replace)
  }

  repl(key) {
    const {dat} = this
    if (!(key in dat)) throw Error(`missing template method ${f.show(key)}`)
    return dat[key]()
  }
}

class Dat {
  constructor(pkg, main, test) {
    this.pkg = pkg
    this.main = main
    this.test = test
    this.linesMain = splitLines(main)
    this.linesTest = splitLines(test)
    this.exp = new Exports().addLines(this.linesMain)
  }

  version() {return f.req(this.pkg.version, f.isStr)}
  reqTests() {for (const val of this.exp) val.reqTest()}
  reqDocs() {for (const val of this.exp) val.reqDoc()}
  apiToc(lvl = 1) {return joinLines(f.map(this.exp, val => indent(lvl) + ` * ` + val.linkDoc()))}
  api() {return joinLines(f.map(this.exp, val => val.reqDoc()))}
  touchFiles() {for (const val of this.exp) touch(val.docPath())}
}

class Exports extends Set {
  addLines(lines) {
    for (const [ind, text] of lines.entries()) {
      const match = text.match(/^export\s+(\w+)\s+(\w+)\b/)
      if (!match) continue
      this.add(new Export(match[1], match[2], ind))
    }
    return this
  }
}

class Export {
  constructor(type, name, line) {
    this.type = type
    this.name = name
    this.lineMain = line
    this.lineTest = undefined
    this.docBody = undefined
  }

  rowMain() {return this.lineMain + 1}
  rowTest() {return (this.lineTest ?? (this.lineTest = findTestLine(this.name))) + 1}
  reqTest() {this.rowTest()}
  linkDoc() {return `[#${this.head()}](#${this.type}-${this.name.toLowerCase()})`}
  linkMain() {return `fpx.mjs#L${this.rowMain()}`}
  linkTest() {return `test/test.mjs#L${this.rowTest()}`}

  head() {
    const {type, name} = this
    return `\`${type} ${name}\``
  }

  doc() {return withNewlines(this.docHead(), 2) + withNewline(this.docRest())}

  reqDoc() {
    if (!this.docRest()) throw Error(`missing doc for ${f.show(this.name)}`)
    return this.doc()
  }

  docHead() {
    return `### ${this.head()}

Links: [source](${this.linkMain()}); [test/example](${this.linkTest()}).`
  }

  docRest() {
    return this.docBody ?? (this.docBody = Deno.readTextFileSync(this.docPath()).trim())
  }

  docPath() {return `doc/api/${this.name}.md`}
}

function findTestLine(name) {
  const exp = `t.test(function test_${name}(`
  for (const [ind, text] of dat.linesTest.entries()) {
    if (text.startsWith(exp)) return ind
  }
  throw Error(`failed to find test for ${f.show(name)}`)
}

function splitLines(str) {return str.split(/\r\n|\r|\n/g)}

function touch(path) {
  try {
    const info = Deno.statSync(path)
    if (!info.isFile) throw Error(`${f.show(path)} is not a file`)
    return
  }
  catch (err) {
    if (!f.isInst(err, Deno.errors.NotFound)) throw err
  }

  Deno.createSync(path)
}

function withNewline(str) {return withNewlines(str, 1)}
function withNewlines(str, len) {return str.trim() + newlines(len)}
function newlines(len) {return repeatStr(len, `\n`)}
function repeatStr(len, val) {return f.repeat(len, val).join(``)}
function indent(len) {return repeatStr(len, `  `)}
function joinLines(val) {return f.arr(val).join(`\n`)}

export const dat = new Dat(JSON.parse(srcPackage), srcMain, srcTest)
export const readme = new Templ(srcReadme, dat)

if (import.meta.main) {
  main()
  const end = performance.now()
  console.log(`[doc] done in ${end - start}ms`)
}
