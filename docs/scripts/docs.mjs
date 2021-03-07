import * as f from './fpx.mjs'

f.global.f = f
f.global.fpx = f

/**
 * Init
 */

const scroller = throttle(updateLinksAndHash, {delay: 128})

window.addEventListener('scroll', scroller.call)

window.addEventListener('wheel', function preventSpill(event) {
  const node = findAncestor(event.target, shouldPreventSpill)
  if (node) scrollWithoutSpill(node, event)
}, {passive: false})

function updateLinksAndHash() {
  const id = f.procure(document.querySelectorAll('#main [id]'), getVisibleId)
  if (id) {
    setHash(id)
    updateSidenavLinks(id)
  }
  else {
    unsetHash(id)
  }
}

function updateSidenavLinks(id) {
  f.slice(document.querySelectorAll('#sidenav a[aria-current]')).forEach(deactivate)
  const link = document.querySelector(`#sidenav a[href*="#${id}"]`)
  if (link) {
    activate(link)
    scrollIntoViewIfNeeded(link)
  }
}

function activate(elem) {
  elem.setAttribute('aria-current', 'true')
}

function deactivate(elem) {
  elem.removeAttribute('aria-current')
}

/**
 * Utils
 */

// Pixel measurements are inaccurate when the browser is zoomed in or out, so we
// have to use a small non-zero value in some geometry checks.
const PX_ERROR_MARGIN = 3

function throttle(fun, options) {
  f.validate(fun, f.isFunction)
  let active = true
  let timerId = null
  let tailPending = false
  const delay = options && options.delay

  function call() {
    if (!active) return
    if (timerId) {
      tailPending = true
      return
    }
    try {fun()}
    finally {restartThrottle()}
  }

  function restartThrottle() {
    if (!active) return

    clearTimeout(timerId)
    timerId = null

    timerId = setTimeout(function onThrottledTimer() {
      timerId = null
      if (tailPending) restartThrottle()
      tailPending = false
      fun()
    }, delay)
  }

  function deinit() {
    active = false
    clearTimeout(timerId)
    timerId = null
  }

  return {call, deinit}
}

function getVisibleId(elem) {
  return (elem && hasArea(elem) && isWithinViewport(elem)) ? elem.id : undefined
}

function findAncestor(node, test) {
  return !node
    ? null
    : test(node)
    ? node
    : findAncestor(node.parentNode, test)
}

function hasArea(elem) {
  const {height, width} = elem.getBoundingClientRect()
  return height > 0 && width > 0
}

function isWithinViewport(elem) {
  const {top, bottom} = elem.getBoundingClientRect()
  return (
    (bottom > -PX_ERROR_MARGIN && bottom < window.innerHeight) ||
    (top > PX_ERROR_MARGIN && top < (window.innerHeight + PX_ERROR_MARGIN))
  )
}

// Not good enough; we should probably scroll an element into view unless it's
// MOSTLY visible, not just partially visible.
function isKindaVisible(elem) {
  const {top, bottom} = elem.getBoundingClientRect()
  return (
    (bottom > PX_ERROR_MARGIN && bottom < window.innerHeight) ||
    (top > PX_ERROR_MARGIN && top < (window.innerHeight - PX_ERROR_MARGIN))
  )
}

function setHash(id) {
  window.history.replaceState(null, '', `#${id}`)
}

function unsetHash() {
  window.history.replaceState(null, '', '')
}

function scrollIntoViewIfNeeded(elem) {
  if (!isKindaVisible(elem)) elem.scrollIntoView()
}

function shouldPreventSpill(elem) {
  return f.isInstance(elem, Element) && elem.hasAttribute('data-nospill')
}

// Reference: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent.
function scrollWithoutSpill(elem, event) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
    scrollWithoutSpillModePixels(elem, event)
  }
  else {
    scrollWithoutSpillModeLinesOrPages(elem, event)
  }
}

// Precise but requires `event.deltaMode === WheelEvent.DOM_DELTA_PIXEL`.
// Browsers use this mode for smooth-scroll devices such as touchpads. Some
// browsers, including Chrome, also use this for regular mouse wheels.
function scrollWithoutSpillModePixels(elem, event) {
  event.preventDefault()
  elem.scrollLeft += event.deltaX
  elem.scrollTop += event.deltaY
}

// Less precise than the pixel version. Breaks when the event has BOTH scrollX
// and scrollY. Should work fine for regular mouse wheels.
function scrollWithoutSpillModeLinesOrPages(elem, event) {
  const movesLeft = event.deltaX < 0 && elem.scrollLeft > 0
  const movesRight = event.deltaX > 0 && elem.scrollLeft + elem.clientWidth < elem.scrollWidth
  const movesUp = event.deltaY < 0 && elem.scrollTop > 0
  const movesDown = event.deltaY > 0 && elem.scrollTop + elem.clientHeight < elem.scrollHeight
  if (!movesLeft && !movesRight && !movesUp && !movesDown) event.preventDefault()
}
