import { useEffect, useState, useCallback } from 'preact/hooks'
import GameRow from './GameRow'
import ErrorMessage from './ErrorMessage'
import { createApiClient } from '../http'
import '../styles/App.css'

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
      <button class="waves-effect waves-light btn-large green darken-2 new-row-btn"
      onClick={addGame}>
        <i class="material-icons left">add_circle</i>Naujas traukimas
      </button>
    </div>,
    <div class="grid-wrapper">
      <div class="games-grid">
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
    </div>,
  ]
}

export default App
