export default function doFetch(
  method: 'POST' | 'GET' | 'PUT' | 'DELETE',
  url: string,
  body?: Record<string, string | number | any> | null,
  token?: string,
  contentType?: string,
) {
  let paramsURL = url
  const headers = {
    'Content-Type': contentType || 'application/json',
  }

  if (token) {
    Object.assign(headers, {
      Authorization: `Bearer ${token}`,
    })
  }

  const params = {
    method: method,
    headers: {
      ...headers,
    },
  }

  if (body) {
    if (method === 'GET') {
      paramsURL = `${url}?${Object.keys(body)
        .map(key => `${key}=${body[key] as string}`)
        .join('&')}`
    } else {
      Object.assign(params, { body: JSON.stringify(body) })
    }
  }

  return fetch(paramsURL, {
    ...params,
  })
}
