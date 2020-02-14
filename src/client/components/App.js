import React, { useEffect, useState, useCallback } from 'react'
import GameRow from './GameRow'
import ErrorMessage from './ErrorMessage'
import { handleErrorWith } from '../util'

const App = () => {
  const [games, setGames] = useState()
  const [error, setError] = useState()
  const h = handleErrorWith(setError)
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

  return (
    <>
      <ErrorMessage error={error} onClose={() => setError()}></ErrorMessage>
      <div>
        <button onClick={addGame}>Kurk nauj traukimo</button>
      </div>
      <div className="list">
        {games &&
          games.map(game => (
            <GameRow
              game={game}
              key={game.name}
              onRevealed={onRefresh}
              onCalculated={onRefresh}
              onDeleted={onRefresh}
              onError={setError}
            ></GameRow>
          ))}
      </div>
    </>
  )
}

export default App
