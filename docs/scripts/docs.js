const {
  location,
  history,
  fpx: {
    and, bind, curry1, rest, getAt, seq, pipe, id: exists, ifelse, ifthen,
    slice, find
  },
} = window

// Elems

const sidenav = document.getElementById('sidenav')

const main = document.getElementById('main')

const links = slice(sidenav.getElementsByTagName('a'))

const targets = main.querySelectorAll('[id]:not([id=""])')

// Utils

const getf = rest(curry1(getAt))

const hasVisibleId = and(exists, tangible, withinViewport, getf('id'))

const findId = pipe(bind(find, hasVisibleId, targets), getf('id'))

const ifexists = bind(ifthen, exists)

const getLink = ifexists(function getLink (id) {
  return find(bind(matchHref, id), links)
})

const updateHash = ifelse(exists, setHash, unsetHash)

function linksOff () {links.forEach(deactivate)}

const reactivate = ifexists(seq(activate, scrollIntoViewIfNeeded))

const update = pipe(findId, seq(updateHash, linksOff, pipe(getLink, reactivate)))

const reachedScrollEdge = ifexists(function reachedScrollEdge (elem, {deltaY}) {
  return (
    deltaY < 0 && reachedTop(elem) ||
    deltaY > 0 && reachedBottom(elem)
  )
})

const reachedTop = ifexists(function reachedTop ({scrollTop}) {return scrollTop < 3})

const reachedBottom = ifexists(function reachedBottom (elem) {
  return Math.abs(elem.scrollHeight - absBottom(elem)) < 3
})

function absBottom (elem) {
  return elem.getBoundingClientRect().height + elem.scrollTop
}

function findParent (test, node) {
  return !node ? null : (test(node) ? node : findParent(test, node.parentNode))
}

function hasAttr (name, elem) {
  return elem && elem.hasAttribute && elem.hasAttribute(name)
}

function tangible (elem) {
  const {height, width} = elem.getBoundingClientRect()
  return height > 0 && width > 0
}

function withinViewport (elem) {
  const {top, bottom} = elem.getBoundingClientRect()
  return (
    bottom > -3 && bottom < window.innerHeight ||
    top > 3 && top < (window.innerHeight + 3)
  )
}

function activate (elem) {
  elem.classList.add('active')
}

function deactivate (elem) {
  elem.classList.remove('active')
}

function matchHref (id, link) {
  return !!~link.href.indexOf('#' + id)
}

function setHash (id) {
  history.replaceState('', null, `${location.origin}${location.pathname}#${id}`)
}

function unsetHash () {
  history.replaceState('', null, location.origin + location.pathname)
}

function scrollIntoViewIfNeeded (elem) {
  if (!withinViewport(elem)) elem.scrollIntoView()
}

function throttle (fun, delay) {
  let id
  let tail = false

  function start () {
    return setInterval(function runThrottled () {
      if (!tail) {
        clearInterval(id)
        id = null
      }
      tail = false
      fun(...arguments)
    }, delay)
  }

  return function throttled () {
    if (!id) id = start(...arguments)
    else if (!tail) tail = true
  }
}

// Setup

window.addEventListener('scroll', throttle(update, 250))

const hasNoSpill = bind(hasAttr, 'data-nospill')

window.addEventListener('wheel', function preventSpill (event) {
  if (reachedScrollEdge(findParent(hasNoSpill, event.target), event)) {
    event.preventDefault()
  }
})
