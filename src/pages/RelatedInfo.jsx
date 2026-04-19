const SECTIONS = [
  {
    label: 'How it works',
    items: [
      {
        tag: 'API',
        title: 'The Shopify /products.json endpoint',
        body: 'Every store built on Shopify automatically exposes a public REST endpoint at /products.json. No API key or login is required - it returns the same product data any visitor can see by browsing the store. It supports up to 250 products per request, so this tool paginates automatically until all products are fetched.',
        code: 'https://store-domain.com/products.json?limit=250&page=2',
      },
      {
        tag: 'Technical',
        title: 'Why a proxy server is needed',
        body: 'Browsers enforce a security rule called CORS (Cross-Origin Resource Sharing) that blocks JavaScript from directly fetching data from a different domain. To get around this, the tool routes every request through a lightweight server function hosted on Vercel - the server fetches the data on your behalf and returns it to the browser.',
        code: 'Browser → /api/proxy → Shopify store → JSON → Browser',
      },
      {
        tag: 'Technical',
        title: 'Rate limiting and retry logic',
        body: 'Shopify throttles requests that come too fast - typically returning a 429 or 503 error. This tool adds a 300ms pause between each page request and automatically retries failed requests up to 3 times using exponential backoff (waiting 1s, then 2s, then 4s). This makes large store scrapes reliable without overloading Shopify\'s servers.',
        code: 'Page 1 → wait 300ms → Page 2 → wait 300ms → Page 3…',
      },
      {
        tag: 'Technical',
        title: 'Virtual scrolling for large datasets',
        body: 'Rendering 20,000+ rows in a browser table at once would freeze the page. This tool uses @tanstack/react-virtual to only render the rows currently visible on screen - typically 15 to 20 at a time. The rest of the scroll space is filled with invisible padding so the scrollbar behaves correctly. The result is that 20,000 rows feels as fast as 20.',
        code: 'DOM renders ~20 rows at a time regardless of dataset size',
      },
    ],
  },
  {
    label: 'Data & limitations',
    items: [
      {
        tag: 'Data',
        title: 'What data is available',
        body: 'The public Shopify API exposes product titles, descriptions, vendors, product types, tags, variants (with prices, SKUs, and availability), images, and timestamps. This covers the vast majority of what merchandising and buying teams need for competitor analysis and catalogue management.',
        code: 'id · title · vendor · variants · images · tags · timestamps',
      },
      {
        tag: 'Limitation',
        title: 'What is not available',
        body: 'Exact inventory quantities, cost prices, customer data, order history, and metafields (custom product attributes) are all private and require a store-owner-issued API key. The public endpoint also does not expose wholesale pricing, B2B catalogues, or draft products. This tool only reads what is publicly visible.',
        code: 'inventory_quantity · cost_price · metafields → private API only',
      },
      {
        tag: 'Data',
        title: 'How variants work',
        body: 'In Shopify, a single product can have multiple variants - for example a t-shirt in 3 sizes × 4 colours = 12 variants. Each variant has its own price, SKU, and availability. This tool creates one row per variant in the export, which is the standard format for importing into ERP systems, buying tools, and spreadsheets.',
        code: '1 product × 12 variants = 12 rows in the export file',
      },
      {
        tag: 'Data',
        title: 'Structured tags',
        body: 'Some Shopify stores organise their tags using a "Key: Value" convention - for example "Category: Tables" or "Room: Living Room". This tool automatically detects and splits these into dedicated columns (Tag → Category, Tag → Room) for easier filtering and sorting in spreadsheets. Stores that use flat tags like "sale" or "new" will show those in the plain Tags column instead.',
        code: '"Cat: Tables" → tag_category: Tables',
      },
    ],
  },
  {
    label: 'Ethics & responsible use',
    items: [
      {
        tag: 'Ethics',
        title: 'This tool only reads public data',
        body: 'Everything this tool accesses is publicly available - the same information any customer sees when browsing the store. It does not bypass login walls, access private APIs, or collect any customer or order data. Think of it as reading a shop\'s catalogue, just faster.',
        code: null,
      },
      {
        tag: 'Ethics',
        title: 'Responsible use guidelines',
        body: 'Use data for research, analysis, and internal business purposes - not for republishing or reselling another store\'s catalogue. The 300ms delay built into this tool is intentional - it avoids putting excessive load on the store\'s servers.',
        code: null,
      },
      {
        tag: 'Legal',
        title: 'Legal context',
        body: 'In most jurisdictions, scraping publicly available data is legal - a position upheld in the 2022 US court case hiQ Labs v. LinkedIn. However, laws vary by country and use case. This tool is intended for legitimate business intelligence purposes. Users are responsible for ensuring their use complies with applicable laws and the store\'s terms.',
        code: null,
      },
    ],
  },
  {
    label: 'Comparison with paid tools',
    items: [
      {
        tag: 'Comparison',
        title: 'vs. Jungle Scout / Helium 10',
        body: 'Tools like Jungle Scout and Helium 10 focus on Amazon seller data - sales rank, review counts, estimated revenue. They do not scrape Shopify stores. This tool fills a completely different niche: direct-to-consumer Shopify catalogue data for merchandising and buying teams.',
        code: null,
      },
      {
        tag: 'Comparison',
        title: 'vs. Import2 / Matrixify',
        body: 'These are Shopify-to-Shopify migration tools that require API keys from both the source and destination stores. They are powerful but need store owner cooperation. This tool requires nothing from the store owner and works on any public Shopify store instantly.',
        code: null,
      },
      {
        tag: 'Comparison',
        title: 'vs. manual copy-pasting',
        body: 'Manually copying product data from a competitor\'s store into a spreadsheet takes hours and is error-prone. A buyer cataloguing 500 products manually might spend a full day. This tool does the same job in under 60 seconds with zero errors, freeing the team to focus on analysis rather than data entry.',
        code: 'Manual: ~ an hours for 500 products → Tool: ~8 seconds',
      },
    ],
  },
  {
    label: 'What comes next',
    items: [
      {
        tag: 'Roadmap',
        title: 'Price change tracking',
        body: 'By storing each scrape result locally with a timestamp, the tool could detect when a competitor changes a price. A buyer could check back weekly and immediately see what went on sale, what increased, and what was discontinued - turning a one-time export into ongoing market intelligence.',
        code: null,
      },
      {
        tag: 'Roadmap',
        title: 'Multi-store comparison',
        body: 'Scraping two stores simultaneously and showing a side-by-side summary - total products, average price, overlapping SKUs, unique categories - would let buying teams benchmark competitors at a glance without opening a spreadsheet.',
        code: null,
      },
      // {
      //   tag: 'Roadmap',
      //   title: 'Authenticated access for private data',
      //   body: 'Store owners could optionally provide a private API key to unlock exact inventory quantities, cost prices, metafields, and draft products. This would make the tool useful not just for competitor research but for a brand\'s own internal catalogue management.',
      //   code: null,
      // },
      {
        tag: 'Roadmap',
        title: 'Scheduled scraping',
        body: 'A backend job that automatically scrapes a list of stores on a schedule (daily, weekly) and emails a summary of changes would turn this from a manual tool into a passive monitoring system - alerting teams the moment a competitor launches new products or runs a sale.',
        code: null,
      },
    ],
  },
]

const TAG_COLORS = {
  API:         { bg: '#e8f0fe', color: '#1a56db' },
  Technical:   { bg: '#fdf0f0', color: '#8B1A1A' },
  Data:        { bg: '#e6f4ec', color: '#1a7a4a' },
  Limitation:  { bg: '#fef3e2', color: '#92500a' },
  Ethics:      { bg: '#f3f0fe', color: '#5b21b6' },
  Legal:       { bg: '#fce8f3', color: '#9d174d' },
  Comparison:  { bg: '#e8f8f5', color: '#0e7490' },
  Roadmap:     { bg: '#f1f5f9', color: '#475569' },
}

export default function RelatedInfo() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 8 }}>
          Related information
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          How this tool works under the hood, what data is and isn't available,
          and where it sits in the broader landscape of e-commerce data tools.
        </p>
      </div>

      {/* Sections */}
      {SECTIONS.map((section, si) => (
        <div key={section.label} style={{ marginBottom: 48 }}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>{section.label}</h2>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {section.items.map(item => {
              const tagStyle = TAG_COLORS[item.tag] ?? TAG_COLORS.Data
              return (
                <div
                  key={item.title}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '18px 20px',
                  }}
                >
                  {/* Tag + title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px',
                      borderRadius: 20, background: tagStyle.bg, color: tagStyle.color,
                      flexShrink: 0,
                    }}>
                      {item.tag}
                    </span>
                    <h3 style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</h3>
                  </div>

                  {/* Body */}
                  <p style={{
                    fontSize: 13, color: 'var(--text-muted)',
                    lineHeight: 1.75, marginBottom: item.code ? 12 : 0,
                  }}>
                    {item.body}
                  </p>

                  {/* Code example */}
                  {item.code && (
                    <div style={{
                      background: 'var(--cream)', borderRadius: 8,
                      padding: '8px 14px', fontFamily: 'var(--mono)',
                      fontSize: 12, color: 'var(--wine)',
                      borderLeft: '3px solid var(--wine)',
                      wordBreak: 'break-all',
                    }}>
                      {item.code}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      ))}

      {/* Built with */}
      <div style={{
        borderTop: '1px solid var(--border)', paddingTop: 32, marginTop: 16,
      }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Built with
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            'React 18', 'Vite', 'react-router-dom', '@tanstack/react-virtual',
            'SheetJS (xlsx)', 'Vercel Serverless Functions', 'Shopify Public API',
          ].map(tech => (
            <span key={tech} style={{
              fontSize: 12, padding: '5px 14px', borderRadius: 20,
              border: '1px solid var(--border)', background: '#fff',
              color: 'var(--text-muted)', fontFamily: 'var(--mono)',
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
