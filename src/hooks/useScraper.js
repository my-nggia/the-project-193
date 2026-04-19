import { useState, useCallback } from 'react'
import { scrapeStore, flattenProducts } from '../utils/scraper'

export function useScraper() {
  const [status, setStatus]           = useState('idle')
  const [data, setData]               = useState([])
  const [productCount, setProductCount] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)
  const [error, setError]             = useState('')

  const run = useCallback(async (url) => {
    if (!url.trim()) { setError('Please enter a store URL.'); return }

    setStatus('loading')
    setError('')
    setData([])
    setProductCount(0)
    setLoadedCount(0)

    try {
      const raw = await scrapeStore(url, (count) => {
        // Called after each page — update the live counter
        setLoadedCount(count)
      })

      setProductCount(raw.length)
      const flat = flattenProducts(raw)
      setData(flat)
      setStatus('done')

    } catch (err) {
      setError(err.message || 'Something went wrong. Is this a Shopify store?')
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setData([])
    setProductCount(0)
    setLoadedCount(0)
    setError('')
  }, [])

  return { status, data, productCount, loadedCount, error, run, reset }
}
