!function () {
  const {
    and, bind, apply, defer, rest, getAt, seq, pipe, id: exists, ifelse, ifthen,
    slice, find
  } = window.fpx

  const sidenav = document.getElementById('sidenav')

  const main = document.getElementById('main')

  const links = sidenav.getElementsByTagName('a')

  const targets = main.querySelectorAll('[id]:not([id=""])')

  const getf = rest(defer(getAt))

  const hasVisibleId = and(exists, tangible, withinViewport, getf('id'))

  const findId = pipe(bind(find, hasVisibleId, targets), getf('id'))

  const ifexists = bind(ifthen, exists)

  const getLink = ifexists(id => find(bind(matchHref, id), links))

  const reactivate = ifexists(link => {
    slice(links).forEach(deactivate)
    activate(link)
    link.scrollIntoViewIfNeeded()
  })

  const updateHash = ifelse(exists, setHash, unsetHash)

  const update = pipe(findId, seq(updateHash, pipe(getLink, reactivate)))

  main.addEventListener('scroll', throttle(update, 250))

  // Utils

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

  function throttle (fun, delay) {
    let id
    let tail = false

    function start () {
      return setInterval(() => {
        if (!tail) {
          clearInterval(id)
          id = null
        }

        tail = false

        apply(fun, arguments)
      }, delay)
    }

    return function throttled () {
      if (!id) id = start()
      else if (!tail) tail = true
    }
  }
}()
