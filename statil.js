'use strict'

const hljs = require('highlight.js')
const marked = require('marked')
const pt = require('path')

const {version: VERSION} = require('./package.json')

/**
 * Markdown
 */

class MarkedRenderer extends marked.Renderer {
  // Adds ID anchors
  heading(text, level, raw) {
    const id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-')
    return (
      `<h${level}>` +
        `<span>${text}</span>` +
        `<a class="heading-anchor" href="#${id}" id="${id}">🔗</a>` +
      `</h${level}>\n`
    )
  }

  // Adds target="_blank" to external links. Mostly copied from marked's source.
  link(href, title, text) {
    if (this.options.sanitize) {
      let prot = ''
      try {
        prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase()
      }
      catch (__) {
        return ''
      }
      if (/^(javascript|vbscript):/.test(prot)) return ''
    }
    let out = '<a href="' + href + '"'
    if (title) out += ' title="' + title + '"'
    if (/^[a-z]+:\/\//.test(href)) out += ' target="_blank"'
    out += '>' + text + '</a>'
    return out
  }
}

const markedOptions = {
  renderer: new MarkedRenderer(),
  smartypants: true,
  highlight(code, lang) {
    const {value} = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code)
    return value
  },
}

/**
 * Statil
 */

module.exports = {
  imports: {
    VERSION,
    md(content) {
      return marked(content, markedOptions)
        .replace(/<pre><code class="(.*)">|<pre><code>/g, '<pre><code class="hljs $1">')
        .replace(/<!--\s*:((?:[^:]|:(?!\s*-->))*):\s*-->/g, '$1')
    },
    url(path) {
      return pt.join(pt.dirname(path), pt.parse(path).name)
    },
  },
  ignorePath: path => /^partials/.test(path),
  renamePath: (path, {dir, name}) => (
    path === 'index.html' || path === '404.html'
    ? path
    : pt.join(dir, name, 'index.html')
  ),
}
