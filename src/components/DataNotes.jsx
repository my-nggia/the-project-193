const NOTES = [
  {
    icon: '📦',
    title: 'Stock levels are limited',
    body: 'Shopify\'s public API only tells us whether a product is in stock or not - not the exact quantity. The "In Stock" column means at least 1 unit is available.',
  },
  {
    icon: '🏷️',
    title: 'Tag columns depend on the store',
    body: 'The "Tag → Category", "Tag → Room" columns only populate if the store organises its tags in a "Key: Value" format. Many stores use flat tags like "sale" or "new" - those appear in the Tags column instead.',
  },
  {
    icon: '📝',
    title: 'Descriptions may be empty',
    body: 'Some stores write product descriptions using page builders or metafields that are not accessible from the public API. If the Description column is blank, that\'s why.',
  },
  {
    icon: '🔒',
    title: 'Some data is private',
    body: 'Cost prices, customer data, exact inventory counts, and metafields are only accessible with a private API key from the store owner. This tool only reads publicly available data.',
  },
]

export default function DataNotes({ productCount, variantCount }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      marginBottom: 12,
      overflow: 'hidden',
    }}>

      {/* Header row — summary stats */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          { label: 'Products scraped', value: productCount.toLocaleString() },
          { label: 'Rows (variants)',   value: variantCount.toLocaleString() },
          { label: 'Variants / product', value: productCount > 0 ? (variantCount / productCount).toFixed(1) : '—' },
          { label: 'Data source',        value: 'Public Shopify API' },
        ].map((stat, i, arr) => (
          <div key={stat.label} style={{
            flex: 1, padding: '12px 18px',
            borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{stat.label}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Notes grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 0,
      }}>
        {NOTES.map((note, i) => (
          <div key={note.title} style={{
            padding: '14px 18px',
            borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
            borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{note.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>
                  {note.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {note.body}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
