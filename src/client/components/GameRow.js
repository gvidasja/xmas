import React, { useCallback } from 'react'
import { base64toUtf8, formatDate, handleErrorWith } from '../util'

const GameRow = ({ game, onCalculated, onRevealed, onDeleted, onError }) => {
  const h = handleErrorWith(onError)

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
