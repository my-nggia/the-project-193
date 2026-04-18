import { useState } from 'react'

export const ALL_FIELDS = [
  'product_id', 'product_title', 'vendor', 'product_type', 'tags', 'options',
  'variant_id', 'variant_title', 'sku', 'price', 'compare_at_price', 'available',
  'images', 'published_at', 'created_at', 'updated_at',
]

export const FIELD_GROUPS = [
  { label: 'Product', fields: ['product_id', 'product_title', 'vendor', 'product_type', 'tags', 'options'] },
  { label: 'Variant', fields: ['variant_id', 'variant_title', 'sku', 'price', 'compare_at_price', 'available'] },
  { label: 'Media',   fields: ['images'] },
  { label: 'Dates',   fields: ['published_at', 'created_at', 'updated_at'] },
]

export const FIELD_LABELS = {
  product_id:       'Product ID',
  product_title:    'Product Name',
  vendor:           'Brand',
  product_type:     'Category',
  tags:             'Tags',
  options:          'Options (Size, Color…)',
  variant_id:       'Variant ID',
  variant_title:    'Variant',
  sku:              'SKU',
  price:            'Price',
  compare_at_price: 'Original Price',
  available:        'In Stock',
  images:           'Image URLs',
  published_at:     'Published Date',
  created_at:       'Created Date',
  updated_at:       'Last Updated',
}

export const DEFAULT_FIELDS = new Set([
  'product_title', 'vendor', 'product_type',
  'tag_category', 'tag_subcategory', 'tag_room',
  'variant_title', 'sku', 'price', 'on_sale', 'available',
  'variant_image',
])

export default function FieldSelector({ selected, onChange }) {
  const [open, setOpen] = useState(false)

  const toggle = (field) => {
    const next = new Set(selected)
    next.has(field) ? next.delete(field) : next.add(field)
    onChange(next)
  }

  const selectGroup   = (fields) => { const n = new Set(selected); fields.forEach(f => n.add(f));    onChange(n) }
  const deselectGroup = (fields) => { const n = new Set(selected); fields.forEach(f => n.delete(f)); onChange(n) }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 12 }}>

      {/* Header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
            Columns
          </span>
          <span style={{
            fontSize: 11, background: 'var(--wine-pale)', color: 'var(--wine)',
            padding: '2px 8px', borderRadius: 20, fontWeight: 500
          }}>
            {selected.size} / {ALL_FIELDS.length} selected
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {/* Expandable body */}
      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '10px 0' }}>
            <button onClick={() => onChange(new Set(ALL_FIELDS))}
              style={{ fontSize: 12, color: 'var(--wine)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
              Select all
            </button>
            <button onClick={() => onChange(new Set())}
              style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
              Clear all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FIELD_GROUPS.map(group => (
              <div key={group.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {group.label.toUpperCase()}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <button onClick={() => selectGroup(group.fields)}
                    style={{ fontSize: 11, color: 'var(--wine)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>+ all</button>
                  <button onClick={() => deselectGroup(group.fields)}
                    style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>− none</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {group.fields.map(f => (
                    <button key={f} onClick={() => toggle(f)} style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 13,
                      border: `1px solid ${selected.has(f) ? 'var(--wine)' : 'var(--border)'}`,
                      background: selected.has(f) ? 'var(--wine-pale)' : '#fff',
                      color: selected.has(f) ? 'var(--wine)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: 'var(--font)', fontWeight: selected.has(f) ? 500 : 400
                    }}>
                      {FIELD_LABELS[f]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}