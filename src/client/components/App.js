import { React, useCallback, useEffect, useState } from '../react.js'
import GameRow from './GameRow.js'
import ErrorMessage from './ErrorMessage.js'
import { createApiClient } from '../http.js'

const App = () => {
  const [games, setGames] = useState()
  const [error, setError] = useState()

  const apiClient = createApiClient({ errorHandler: setError })

  const onRefresh = useCallback(() => apiClient.get('api/games').then(setGames))

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

    await apiClient.post('api/games', {
      name,
      contestants,
    })

    onRefresh()
  })

  useEffect(() => {
    onRefresh()
  }, [])

  return [
    <ErrorMessage error={error} onClose={() => setError()}></ErrorMessage>,
    <div>
      <button onClick={addGame}>Kurk nauj traukimo</button>
    </div>,
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
    </div>,
  ]
}

export default App
