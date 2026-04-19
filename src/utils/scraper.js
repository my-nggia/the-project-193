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

// Strip HTML tags and decode entities for clean plain text
function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\u003C/g, '<')
    .replace(/\u003E/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseTags(tags) {
  const raw = Array.isArray(tags) ? tags : []
  const structured = {}
  const plain = []

  raw.forEach(tag => {
    const match = tag.match(/^(.+?):\s*(.+)$/)
    if (match) {
      const key = match[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
      structured[key] = match[2].trim()
    } else {
      plain.push(tag)
    }
  })

  return { structured, plain }
}

function getVariantImage(variant, allImages) {
  if (variant.featured_image?.src) return variant.featured_image.src
  const tagged = allImages.find(img =>
    img.variant_ids && img.variant_ids.includes(variant.id)
  )
  if (tagged) return tagged.src
  return allImages[0]?.src ?? ''
}

export function flattenProducts(products) {
  const rows = []

  products.forEach(p => {
    const { structured, plain } = parseTags(p.tags)
    const description = stripHtml(p.body_html)
    const allImages   = p.images ?? []

    const galleryImages = allImages
      .filter(img => !img.variant_ids || img.variant_ids.length === 0)
      .map(img => img.src)

    const options = (p.options ?? [])
      .filter(o => o.name !== 'Title')
      .map(o => `${o.name}: ${o.values.join(', ')}`)
      .join(' | ')

    const variants = p.variants ?? []

    if (variants.length === 0) {
      rows.push({
        product_id:       String(p.id),
        product_title:    p.title ?? '',
        description,
        vendor:           p.vendor ?? '',
        product_type:     p.product_type ?? '',
        tags:             plain.join(', '),
        tag_category:     structured.cat ?? structured.category ?? '',
        tag_subcategory:  structured.sub_cat ?? structured.subcategory ?? '',
        tag_room:         structured.room ?? '',
        options,
        variant_id:       '',
        variant_title:    '',
        sku:              '',
        price:            '',
        compare_at_price: '',
        on_sale:          'No',
        available:        '',
        variant_image:    allImages[0]?.src ?? '',
        gallery_images:   galleryImages.join(' | '),
        published_at:     p.published_at ?? '',
        created_at:       p.created_at ?? '',
        updated_at:       p.updated_at ?? '',
      })
      return
    }

    variants.forEach(v => {
      const variantParts = [v.option1, v.option2, v.option3]
        .filter(Boolean)
        .filter(x => x !== 'Default Title')
      const variantTitle = variantParts.join(' / ')

      const price          = v.price ?? ''
      const compareAtPrice = v.compare_at_price ?? ''

      const onSale = compareAtPrice &&
        parseFloat(compareAtPrice) > parseFloat(price)
          ? 'Yes'
          : 'No'

      rows.push({
        product_id:       String(p.id),
        product_title:    p.title ?? '',
        description,
        vendor:           p.vendor ?? '',
        product_type:     p.product_type ?? '',
        tags:             plain.join(', '),
        tag_category:     structured.cat ?? structured.category ?? '',
        tag_subcategory:  structured.sub_cat ?? structured.subcategory ?? '',
        tag_room:         structured.room ?? '',
        options,
        variant_id:       String(v.id),
        variant_title:    variantTitle,
        sku:              v.sku ?? '',
        price,
        compare_at_price: onSale === 'Yes' ? compareAtPrice : '',
        on_sale:          onSale,
        available:        v.available ? 'Yes' : 'No',
        variant_image:    getVariantImage(v, allImages),
        gallery_images:   galleryImages.join(' | '),
        published_at:     p.published_at ?? '',
        created_at:       p.created_at ?? '',
        updated_at:       p.updated_at ?? '',
      })
    })
  })

  return rows
}
