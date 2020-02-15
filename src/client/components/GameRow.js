import { useCallback } from 'preact/hooks'
import { base64toUtf8, formatDate } from '../util'
import { createApiClient } from '../http'

const GameRow = ({ game, onCalculated, onRevealed, onDeleted, onError }) => {
  const apiClient = createApiClient({ errorHandler: onError })

  const onCalculate = useCallback(() => {
    if (!confirm('Tiokrai nor traukt?')) return

    return apiClient.post(`api/games/${game.name}`).then(onCalculated)
  })

  const onDelete = useCallback(() => {
    if (!confirm('Tiokrai nor ištrint?')) return

    apiClient.delete(`api/games/${game.name}`).then(onDeleted)
  })

  const onReveal = useCallback(async () => {
    const name = prompt('Kas toks es?')

    if (!name) return

    return apiClient.get(`api/games/${game.name}/result/${name}`).then(({ result }) => {
      if (result) {
        confirm(`Tu ištraukei: ${base64toUtf8(result)}`)
      } else {
        onError({ message: 'INTERNAL_SERVER_ERROR' })
      }

      onRevealed(result)
    })
  })

  return (
    <div className="row">
      <b className="cell name">{game.name}</b>
      <div className="cell date">{formatDate(game.lastCalculated)}</div>
      <div className="cell buttons">
        <button onClick={onReveal} disabled={!game.lastCalculated}>
          Pažiūrem!
        </button>
        <div className="cell">
          <button onClick={onCalculate}>Traukiam iš nauja!</button>
        </div>
        <div className="cell">
          <button onClick={onDelete}>Trink laukan!</button>
        </div>
      </div>
      <div className="cell seen-display">
        {Object.entries(game.seen).map(([name, seen]) => (
          <div key={name} className={seen ? 'seen' : 'not-seen'}>
            {name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameRow
