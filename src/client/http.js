import axios from 'axios'
import qs from 'querystring'

export const createApiClient = ({ baseUrl = undefined, errorHandler }) => {
  const clientInstance = axios.create({
    baseURL: baseUrl,
  })

  const request = (method, url, query = {}, body) =>
    clientInstance
      .request({
        method,
        url: `${url}?${qs.encode(query)}`,
        data: body,
      })
      .then(
        ({ data }) => data,
        ({ ...data }) => console.error(data) || errorHandler(data)
      )

  const get = (url, query = {}) => request('get', url, query)
  const post = (url, body, query) => request('post', url, query, body)
  const put = (url, body, query) => request('put', url, query, body)
  const del = (url, body, query) => request('delete', url, query, body)

  return { get, post, put, delete: del }
}
