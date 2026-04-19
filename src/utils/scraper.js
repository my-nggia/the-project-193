const PROXY = import.meta.env.DEV
  ? 'http://localhost:3001/api/proxy'
  : '/api/proxy'

// Wait N milliseconds between requests
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Retry a fetch up to maxRetries times with exponential backoff
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url)

      // 429 = rate limited, 503 = server busy — both are retryable
      if (response.status === 429 || response.status === 503) {
        const wait = Math.pow(2, attempt) * 1000  // 1s, 2s, 4s
        await sleep(wait)
        continue
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()

    } catch (err) {
      lastError = err
      const wait = Math.pow(2, attempt) * 1000
      await sleep(wait)
    }
  }

  throw lastError ?? new Error('Max retries exceeded')
}

async function fetchPage(storeUrl, page) {
  const target = `${storeUrl}/products.json?limit=250&page=${page}`
  const url    = `${PROXY}?url=${encodeURIComponent(target)}`
  const data   = await fetchWithRetry(url)
  return data.products ?? []
}

export async function scrapeStore(rawUrl, onProgress) {
  let storeUrl = rawUrl.trim().replace(/\/$/, '')
  if (!storeUrl.startsWith('http')) storeUrl = 'https://' + storeUrl

  const allProducts = []
  let page = 1

  while (true) {
    const products = await fetchPage(storeUrl, page)

    if (products.length === 0) break

    allProducts.push(...products)

    // Report progress back to the UI
    if (onProgress) onProgress(allProducts.length)

    if (products.length < 250) break

    page++

    // Polite delay between pages — reduces chance of getting blocked
    await sleep(300)
  }

  return allProducts
}
