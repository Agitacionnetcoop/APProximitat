const optionsBuilder = (method, path, body) => {
  return {
    method,
    'url': `${process.env.ONESIGNAL_BASE_URL}${path}`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: body ? JSON.stringify(body) : null
  };
}

module.exports = optionsBuilder