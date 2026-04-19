const requests = new Map()
const LIMIT    = 100   // max requests
const WINDOW   = 60 * 60 * 1000  // per hour (ms)

function isRateLimited(ip) {
  const now  = Date.now()
  const data = requests.get(ip) ?? { count: 0, start: now }

  // Reset window if expired
  if (now - data.start > WINDOW) {
    requests.set(ip, { count: 1, start: now })
    return false
  }

  if (data.count >= LIMIT) return true

  requests.set(ip, { count: data.count + 1, start: data.start })
  return false
}

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] ?? 'unknown'

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Too many requests — please wait an hour before trying again'
    })
  }

  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing url parameter' })

  try {
    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream request failed' })
    }

    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json(data)

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timed out' })
    }
    return res.status(500).json({ error: err.message })
  }
}
