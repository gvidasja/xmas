import { useCallback } from 'preact/hooks'
import { base64toUtf8, formatDate } from '../util'
import { createApiClient } from '../http'
import '../styles/GameRow.css'

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
    <div class="row">
      <div class="col">
        <div class="card grey lighten-1">
          <div class="card-content black-text">
            <span class="card-title">{game.name}</span>
            <span class="card-title">{formatDate(game.lastCalculated)}</span>
            <div className="cell seen-display">
              {Object.entries(game.seen).map(([name, seen]) => (
                <div key={name}>
                  <i className={seen ? 'material-icons seen' : 'material-icons not-seen'}>{seen ? 'done' : 'clear'}</i>
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div class="card-action">
            <button class="waves-effect waves-light btn green" onClick={onReveal} disabled={!game.lastCalculated}>
              <i class="material-icons left">remove_red_eye</i>Pažiūrem!
            </button>
            <button class="waves-effect waves-light btn blue" onClick={onCalculate}>
              <i class="material-icons left">play_arrow</i>Pradėt traukymo!
            </button>
            <button class="waves-effect waves-light btn red" onClick={onDelete}>
              <i class="material-icons left">delete</i>Ištrinti
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameRow
