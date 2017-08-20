const {
  history,
  fpx: {bind, get, and, truthy, procure, slice, isFunction, validate},
} = window

/**
 * Utils
 */

// Pixel measurements are inaccurate when the browser is zoomed in or out, so we
// have to use a small non-zero value in some geometry checks.
const PX_ERROR_MARGIN = 3

function Throttle(fun, options) {
  validate(isFunction, fun)
  let timerId = null
  let tailPending = false

  function run () {
    if (timerId) tailPending = true
    else restartThrottle()
  }

  function stop () {
    clearTimeout(timerId)
    timerId = null
  }

  function restartThrottle () {
    stop()
    timerId = setTimeout(() => {
      timerId = null
      if (tailPending) restartThrottle()
      tailPending = false
      fun(...arguments)
    }, get(options, 'delay'))
  }

  return {run, stop}
}

const getVisibleId = and(truthy, hasArea, withinViewport, elem => elem.id)

function findParent (test, node) {
  return !node ? null : (test(node) ? node : findParent(test, node.parentNode))
}

function hasAttr (name, elem) {
  return elem && elem.hasAttribute && elem.hasAttribute(name)
}

function hasArea (elem) {
  const {height, width} = elem.getBoundingClientRect()
  return height > 0 && width > 0
}

function withinViewport (elem) {
  const {top, bottom} = elem.getBoundingClientRect()
  return (
    bottom > (-PX_ERROR_MARGIN && bottom < window.innerHeight) ||
    top > (PX_ERROR_MARGIN && top < (window.innerHeight + PX_ERROR_MARGIN))
  )
}

function setHash (id) {
  history.replaceState(null, '', `#${id}`)
}

function unsetHash () {
  history.replaceState(null, '', '')
}

function scrollIntoViewIfNeeded (elem) {
  if (!withinViewport(elem)) elem.scrollIntoView()
}

function preventScrollSpill (elem, event) {
  event.preventDefault()
  elem.scrollLeft += event.deltaX
  elem.scrollTop += event.deltaY
}

/**
 * Init
 */

const scroller = Throttle(updateLinksAndHash, {delay: 250})

window.addEventListener('scroll', scroller.run)

const shouldPreventSpill = bind(hasAttr, 'data-nospill')

window.addEventListener('wheel', function preventSpill (event) {
  const node = findParent(shouldPreventSpill, event.target)
  if (node) preventScrollSpill(node, event)
})

// window.addEventListener('popstate', function toHash () {
//   scroller.stop()
//   const hash = window.location.hash.replace(/^#/, '')
//   if (hash) updateSidenavLinks(hash)
// })

function updateLinksAndHash () {
  const id = procure(getVisibleId, document.querySelectorAll('#main [id]'))
  if (id) {
    setHash(id)
    updateSidenavLinks(id)
  }
  else {
    unsetHash(id)
  }
}

function updateSidenavLinks (id) {
  slice(document.querySelectorAll('#sidenav a.active')).forEach(deactivate)
  const link = document.querySelector(`#sidenav a[href*="#${id}"]`)
  if (link) {
    activate(link)
    scrollIntoViewIfNeeded(link)
  }
}

function activate (elem) {
  elem.classList.add('active')
}

function deactivate (elem) {
  elem.classList.remove('active')
}
