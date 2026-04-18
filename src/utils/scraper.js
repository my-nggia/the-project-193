const PROXY = import.meta.env.DEV
  ? 'http://localhost:3001/api/proxy'
  : '/api/proxy'

async function fetchPage(storeUrl, page) {
  const target = `${storeUrl}/products.json?limit=250&page=${page}`
  const response = await fetch(`${PROXY}?url=${encodeURIComponent(target)}`)
  if (!response.ok) throw new Error(`Failed on page ${page}: ${response.status}`)
  const data = await response.json()
  return data.products ?? []
}

export async function scrapeStore(rawUrl) {
  let storeUrl = rawUrl.trim().replace(/\/$/, '')
  if (!storeUrl.startsWith('http')) storeUrl = 'https://' + storeUrl

  const allProducts = []
  let page = 1

  while (true) {
    const products = await fetchPage(storeUrl, page)
    if (products.length === 0) break
    allProducts.push(...products)
    if (products.length < 250) break
    page++
  }

  return allProducts
}

export function flattenProducts(products) {
  const rows = []

  products.forEach(p => {
    const tags    = Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags ?? '')
    const images  = (p.images ?? []).map(img => img.src).join(' | ')
    const options = (p.options ?? [])
      .filter(o => o.name !== 'Title')
      .map(o => `${o.name}: ${o.values.join(', ')}`)
      .join(' | ')

    if (!p.variants || p.variants.length === 0) {
      rows.push({
        product_id:        String(p.id),
        product_title:     p.title ?? '',
        vendor:            p.vendor ?? '',
        product_type:      p.product_type ?? '',
        tags,
        options,
        variant_id:        '',
        variant_title:     '',
        sku:               '',
        price:             '',
        compare_at_price:  '',
        available:         '',
        images,
        published_at:      p.published_at ?? '',
        created_at:        p.created_at ?? '',
        updated_at:        p.updated_at ?? '',
      })
      return
    }

    p.variants.forEach(v => {
      // Build a human-readable variant label e.g. "Blue / King"
      const variantParts = [v.option1, v.option2, v.option3].filter(Boolean).filter(x => x !== 'Default Title')
      const variantTitle = variantParts.join(' / ')

      rows.push({
        product_id:        String(p.id),
        product_title:     p.title ?? '',
        vendor:            p.vendor ?? '',
        product_type:      p.product_type ?? '',
        tags,
        options,
        variant_id:        String(v.id),
        variant_title:     variantTitle,
        sku:               v.sku ?? '',
        price:             v.price ?? '',
        compare_at_price:  v.compare_at_price ?? '',
        available:         v.available ? 'Yes' : 'No',
        images,
        published_at:      p.published_at ?? '',
        created_at:        p.created_at ?? '',
        updated_at:        p.updated_at ?? '',
      })
    })
  })

  return rows
}