import { encode } from 'https://deno.land/std@0.112.0/node/querystring.ts'

export const createApiClient = () => {
  const request = (method, url, query = {}, body) => {
    try {
      return fetch(`${url}?${encode(query)}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      }).then(async response =>
        response.ok
          ? response.json()
          : Promise.reject(await response.json().catch(() => response.text()))
      )
    } catch (e) {
      console.log(e)
    }
  }

  const get = (url, query = {}) => request('get', url, query)
  const post = (url, body, query) => request('post', url, query, body)
  const put = (url, body, query) => request('put', url, query, body)
  const del = (url, body, query) => request('delete', url, query, body)

  return { get, post, put, delete: del }
}
