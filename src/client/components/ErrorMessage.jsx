import { React } from '../react.js'

const MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Kažkas či neveik',
  BAD_REQUEST: 'Kažko neteip įvedė',
  ALREADY_EXISTS: 'Jau yra toks pavadinioms',
  WRONG_PERSON: 'Ti kų či darai',
}

const ErrorMessage = ({ error, onClose }) => (
  <>
    {error && (
      <div className="error">
        <div className="error-text">
          {MESSAGES[error.message] || MESSAGES.INTERNAL_SERVER_ERROR}
        </div>
        <button className="error-close" onClick={onClose}>
          X
        </button>
      </div>
    )}
  </>
)

export default ErrorMessage
