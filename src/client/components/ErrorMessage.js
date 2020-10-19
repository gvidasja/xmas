import '../styles/ErrorMessage.css'

const MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Kažkas či neveik',
  BAD_REQUEST: 'Kažko neteip įvedė',
  ALREADY_EXISTS: 'Jau yra toks pavadinioms',
  WRONG_PERSON: 'Ti kų či darai',
}

const ErrorMessage = ({ error, onClose }) =>
  error ? (
    <div onClick={onClose} className="error">
      {MESSAGES[error.message] || MESSAGES.INTERNAL_SERVER_ERROR}
    </div>
  ) : (
    ''
  )

export default ErrorMessage
