import { RequestHandler, Response } from 'express'
import { decode } from './utils'

const unauthorized = (res: Response) => {
  res.setHeader('www-authenticate', 'Basic realm="kaledos.gvidasja.com"')
  res.status(401).end()
}

const auth: (u: string, p: string) => RequestHandler = (username, password) => (req, res, next) => {
  const [scheme = '', auth = ''] = (req.headers.authorization || '').split(' ')
  const [user, pass] = decode(auth).split(':')

  if (!/^basic$/i.test(scheme)) {
    return unauthorized(res)
  }

  if (user !== username || pass !== password) {
    return unauthorized(res)
  }

  return next()
}

export default auth
