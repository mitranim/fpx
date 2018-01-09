'use strict'

const hljs = require('highlight.js')
const marked = require('marked')
const pt = require('path')
const fs = require('fs')

const {version: VERSION} = require('./package.json')
const iconDir = pt.join(process.cwd(), 'node_modules/feather-icons/dist/icons')

/**
 * Markdown
 */

marked.setOptions({
  smartypants: true,
  highlight (code, lang) {
    return (lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code)).value
  },
})

const linkSvg = fs.readFileSync(pt.join(iconDir, 'link-2.svg'))

marked.Renderer.prototype.heading = function heading (text, level, raw) {
  const id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-')
  return (
`<h${level}>
  <span>${text}</span>
  <a class="heading-anchor" href="#${id}" id="${id}">${linkSvg}</a>
</h${level}>
`
  )
}

/**
 * Statil
 */

module.exports = {
  imports: {
    VERSION,
    md (content) {
      return marked(content)
        .replace(/<pre><code class="(.*)">|<pre><code>/g, '<pre><code class="hljs $1">')
        .replace(/<!--\s*:((?:[^:]|:(?!\s*-->))*):\s*-->/g, '$1')
    },
    url (path) {
      return pt.join(pt.dirname(path), pt.parse(path).name)
    },
    featherIcon (name) {
      return fs.readFileSync(pt.join(iconDir, name))
    },
  },
  ignorePath: path => /^partials/.test(path),
  renamePath: (path, {dir, name}) => (
    path === 'index.html' || path === '404.html'
    ? path
    : pt.join(dir, name, 'index.html')
  ),
}
