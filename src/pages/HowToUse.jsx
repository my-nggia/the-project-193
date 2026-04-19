import { Link } from 'react-router-dom'

const STEPS = [
  {
    number: '1',
    title: 'Find a Shopify store',
    description: 'Go to any online store you want to get data from. You can tell it\'s built on Shopify if you see "Powered by Shopify" in the footer, or you can try pasting the URL anyway, the tool will let you know if it\'s not compatible.',
    tip: 'Examples: avasahome.com, abowlofsoupllc.com, theroost.com',
    icon: '🔍',
  },
  {
    number: '2',
    title: 'Paste the store URL',
    description: 'Copy the store\'s website address from your browser and paste it into the input field on the Get Data page. You don\'t need to add anything special - just the homepage URL is enough.',
    tip: 'Example: https://www.avasahome.com',
    icon: '🔗',
  },
  {
    number: '3',
    title: 'Click "Get data" and wait',
    description: 'The tool will automatically fetch all products from the store. Small stores (under 1,000 products) take a few seconds. Large stores like The Roost (20,000+ products) can take up to 60 seconds — keep the tab open and watch the counter tick up.',
    tip: 'Don\'t refresh the page while it\'s loading!',
    icon: '⏳',
  },
  {
    number: '4',
    title: 'Preview the data',
    description: 'Once loaded, all products appear in a table. You can scroll through them, sort any column by clicking its header, and search for specific products using the search bar at the top.',
    tip: 'Click any column header to sort A→Z or Z→A',
    icon: '👀',
  },
  {
    number: '5',
    title: 'Filter what you need',
    description: 'Use the toolbar to narrow down the data. Search by product name, SKU, brand or tag. Toggle "In stock only" to hide unavailable products. Or upload a CSV/TXT file of SKUs to see only those specific products.',
    tip: 'The export will only include what\'s currently visible after filtering',
    icon: '🎯',
  },
  {
    number: '6',
    title: 'Choose your columns',
    description: 'Click "Columns" to expand the field selector. Toggle on or off any column you want in your export - product name, price, SKU, images, dates and more. Use "Reset to default" to go back to the most useful set.',
    tip: 'Less columns = smaller, cleaner file',
    icon: '⚙️',
  },
  {
    number: '7',
    title: 'Download your file',
    description: 'Click "↓ CSV" for a file that opens in Excel, Google Sheets, or any spreadsheet app. Click "↓ XLSX" for a formatted Excel file. The file is named automatically after the store domain.',
    tip: 'CSV works in every app. Use XLSX if you\'re opening in Excel.',
    icon: '📥',
  },
]

const FAQS = [
  {
    q: 'Why does the tool say "This is not a Shopify store"?',
    a: 'Not every online store is built on Shopify. The tool only works with Shopify-based stores. If you\'re unsure, scroll to the bottom of the store\'s website and look for "Powered by Shopify".',
  },
  {
    q: 'Why are some prices showing as $0.00 or blank?',
    a: 'Some stores hide their prices or use custom pricing that requires logging in. The tool can only read publicly available data - if the store doesn\'t show a price publicly, neither can we.',
  },
  {
    q: 'Why is the inventory quantity not shown?',
    a: 'Shopify\'s public API does not share exact stock numbers - only whether a product is in stock or not. To get exact quantities you would need a private API key from the store owner.',
  },
  {
    q: 'The "Tag → Category" column is empty. Why?',
    a: 'That column only fills in if the store organises its tags in a structured "Category: Value" format. Many stores use simple tags like "sale" or "new" - those appear in the plain Tags column instead.',
  },
  {
    q: 'Can I scrape any Shopify store?',
    a: 'This tool only reads publicly available product data - the same information anyone can see by browsing the store.',
  },
  {
    q: 'My download has thousands of rows - is that normal?',
    a: 'Yes! Each product variant gets its own row. A t-shirt with 3 sizes × 4 colours = 12 rows. This is the standard format for spreadsheet analysis and importing into other systems.',
  },
]

export default function HowToUse() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 8 }}>
          How to use
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Get product data from any Shopify store in under a minute - no technical knowledge needed.
        </p>
      </div>

      {/* Steps */}
      <div style={{ marginBottom: 56 }}>
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            style={{
              display: 'flex', gap: 20,
              paddingBottom: i < STEPS.length - 1 ? 32 : 0,
            }}
          >
            {/* Left — number + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--wine)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono)',
                flexShrink: 0,
              }}>
                {step.number}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 8 }} />
              )}
            </div>

            {/* Right — content */}
            <div style={{ paddingTop: 8, paddingBottom: i < STEPS.length - 1 ? 0 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{step.icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{step.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 8 }}>
                {step.description}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--wine-pale)', borderRadius: 8,
                padding: '5px 12px', fontSize: 12, color: 'var(--wine)',
              }}>
                <span>💡</span>
                <span>{step.tip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', marginBottom: 40 }} />

      {/* FAQ */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map(faq => (
            <div
              key={faq.q}
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '16px 20px',
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                {faq.q}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        marginTop: 48, background: 'var(--wine-pale)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '24px', textAlign: 'center',
      }}>
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
          Ready to get started?
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Paste any Shopify store URL and get all their product data.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block', background: 'var(--wine)', color: '#fff',
            borderRadius: 10, padding: '10px 28px', fontSize: 14,
            fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font)',
          }}
        >
          Get Data
        </Link>
      </div>

    </div>
  )
}
