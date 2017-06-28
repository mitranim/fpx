'use strict'

const hljs = require('highlight.js')
const marked = require('marked')
const pt = require('path')

/*
 * Markdown config
 */

marked.setOptions({
  smartypants: true,
  highlight (code, lang) {
    const result = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code)
    return result.value
  }
})

/*
 * Statil config
 */

module.exports = {
  imports: {
    url (path) {
      return pt.join(pt.dirname(path), pt.parse(path).name)
    }
  },
  ignorePath: path => /^partials/.test(path),
  renamePath: (path, {dir, name}) => (
    path === 'index.html' || path === '404.html'
    ? path
    : pt.join(dir, name, 'index.html')
  ),
  postProcess: (content, path, {ext}) => (
    ext !== '.md'
    ? content
    : marked(content)
        .replace(/<pre><code class="(.*)">|<pre><code>/g, '<pre><code class="hljs $1">')
        .replace(/<!--\s*:((?:[^:]|:(?!\s*-->))*):\s*-->/g, '$1')
  ),
}
