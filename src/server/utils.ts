import { Request } from 'express'

export const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress

export const decode = (str: string) => Buffer.from(str, 'base64').toString('utf-8')
export const encode = (str: string) => Buffer.from(str, 'utf-8').toString('base64')
