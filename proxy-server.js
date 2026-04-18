import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/api/proxy', async (req, res) => {
  const { url } = req.query

  if (!url) return res.status(400).json({ error: 'Missing url parameter' })

  try {
    const response = await fetch(url)
    if (!response.ok) return res.status(response.status).json({ error: 'Upstream failed' })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'))