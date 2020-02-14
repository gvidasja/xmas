import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'

const { createElement: e, useEffect, useState, useCallback } = React

const base64toUtf8 = str =>
  decodeURIComponent(
    atob(str)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )

const formatDate = isoDate => {
  if (!isoDate) return ''

  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')

  return `${date} ${hours}:${minutes}`
}

const handleError = (errorHandler = e => console.error(e)) => (
  handler = r => r
) => async response => {
  if (response.ok) {
    return handler(await response.json())
  } else {
    return errorHandler(await response.json())
  }
}

const MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Kažkas či neveik',
  BAD_REQUEST: 'Kažko neteip įvedė',
  ALREADY_EXISTS: 'Jau yra toks pavadinioms',
  WRONG_PERSON: 'Ti kų či darai',
}

const ErrorMessage = ({ error, onClose }) =>
  error
    ? e(
        'div',
        {
          onClick: onClose,
          className: 'error',
        },
        MESSAGES[error.message] || MESSAGES.INTERNAL_SERVER_ERROR
      )
    : ''

const GameRow = ({ game, onCalculated, onRevealed, onDeleted, onError }) => {
  const h = handleError(onError)

  const onCalculate = useCallback(async () => {
    if (!confirm('Tiokrai nor traukt?')) return

    return fetch(`api/games/${game.name}`, {
      method: 'post',
    }).then(h(onCalculated))
  })

  const onDelete = useCallback(async () => {
    if (!confirm('Tiokrai nor ištrint?')) return

    return fetch(`api/games/${game.name}`, {
      method: 'delete',
    }).then(h(onDeleted))
  })

  const onReveal = useCallback(async () => {
    const name = prompt('Kas toks es?')

    if (!name) return

    return fetch(`api/games/${game.name}/result/${name}`).then(
      h(({ result }) => {
        if (result) {
          confirm(`Tu ištraukei: ${base64toUtf8(result)}`)
        } else {
          onError({ message: 'INTERNAL_SERVER_ERROR' })
        }

        onRevealed(result)
      })
    )
  })

  return e('div', { className: 'row' }, [
    e('b', { className: 'cell name' }, game.name),
    e('div', { className: 'cell date' }, formatDate(game.lastCalculated)),
    e(
      'div',
      { className: 'cell buttons' },
      e('button', { onClick: onReveal, disabled: !game.lastCalculated }, 'Pažiūrem!'),
      e('div', { className: 'cell' }, e('button', { onClick: onCalculate }, 'Traukiam iš nauja!')),
      e('div', { className: 'cell' }, e('button', { onClick: onDelete }, 'Trink laukan!'))
    ),
    e(
      'div',
      { className: 'cell seen-display' },
      Object.entries(game.seen).map(([name, seen]) =>
        e('div', { className: seen ? 'seen' : 'not-seen' }, name)
      )
    ),
  ])
}

const App = () => {
  const [games, setGames] = useState()
  const [error, setError] = useState()
  const h = handleError(setError)
  const onRefresh = useCallback(() => fetch('api/games').then(h(setGames)))

  const addGame = useCallback(async () => {
    const name = prompt('Įvesk traukimo pavadinimą').trim()
    const contestants = []
    let nameToAdd

    while (
      (nameToAdd = prompt(
        'Įvesk vardą ir spausk Enter arba palik tuščią ir spausk Enter, kad išsaugotum.'
      ).trim())
    ) {
      contestants.push(nameToAdd)
    }

    fetch('api/games', {
      method: 'post',
      body: JSON.stringify({
        name,
        contestants,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then(h(onRefresh))
  })

  useEffect(() => {
    onRefresh()
  }, [])

  return [
    e(ErrorMessage, { error, onClose: () => setError() }),
    e('div', {}, e('button', { onClick: addGame }, 'Kurk nauj traukimo')),
    e(
      'div',
      { className: 'list' },
      games &&
        games.map(game =>
          e(GameRow, {
            game,
            key: game.name,
            onRevealed: onRefresh,
            onCalculated: onRefresh,
            onDeleted: onRefresh,
            onError: setError,
          })
        )
    ),
  ]
}

ReactDOM.render(e(App), document.querySelector('#app'))
