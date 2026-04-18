export default async function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream request failed' })
    }

    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch: ' + err.message })
  }
}