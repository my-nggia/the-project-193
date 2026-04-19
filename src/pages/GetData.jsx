import { useState, useMemo } from 'react'
import { useScraper } from '../hooks/useScraper'
import FieldSelector, { ALL_FIELDS, DEFAULT_FIELDS } from '../components/FieldSelector'
import DataTable from '../components/DataTable'
import Toolbar from '../components/ToolBar'
import DataNotes from '../components/DataNotes'

function getStoreName(url) {
  try { return new URL(url.startsWith('http') ? url : 'https://' + url).hostname }
  catch { return 'products' }
}

export default function GetData() {
  const [url, setUrl]                         = useState('')
  const [selectedFields, setSelectedFields]   = useState(DEFAULT_FIELDS)
  const [search, setSearch]                   = useState('')
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [skuFilter, setSkuFilter]             = useState(null)

  // ── All hook calls must be at the top of the component ──
  const { status, data, productCount, loadedCount, error, run, reset } = useScraper()

  // ── Filtering logic ──
  const filtered = useMemo(() => {
    let rows = data

    if (skuFilter && skuFilter.length > 0) {
      const skuSet = new Set(skuFilter.map(s => s.toLowerCase()))
      rows = rows.filter(r => skuSet.has((r.sku ?? '').toLowerCase()))
    }

    if (filterAvailable) {
      rows = rows.filter(r => r.available === 'Yes')
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      rows = rows.filter(r =>
        ['product_title', 'vendor', 'product_type', 'tags', 'sku', 'variant_title', 'options']
          .some(f => String(r[f] ?? '').toLowerCase().includes(q))
      )
    }

    return rows
  }, [data, search, filterAvailable, skuFilter])

  const handleReset = () => {
    reset()
    setSearch('')
    setFilterAvailable(false)
    setSkuFilter(null)
    setUrl('')
  }

  const filename = getStoreName(url)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* ── URL input ── */}
      {(status === 'idle' || status === 'error') && (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', padding: '2.5rem 2rem',
          maxWidth: 680, margin: '0 auto'
        }}>
          <label style={{
            fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'block', marginBottom: 8
          }}>
            Shopify Store URL
          </label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run(url)}
            placeholder="https://www.store-domain.com"
            style={{
              width: '100%', padding: '14px 18px', fontSize: 15,
              border: '1px solid var(--border)', borderRadius: 12,
              outline: 'none', background: 'var(--cream)', color: 'var(--text)',
              fontFamily: 'var(--font)'
            }}
          />
          {error && (
            <p style={{ color: 'var(--wine)', fontSize: 13, marginTop: 8 }}>{error}</p>
          )}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => run(url)} style={{
              background: 'var(--wine)', color: '#fff', border: 'none',
              borderRadius: 12, padding: '13px 48px', fontSize: 15,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font)'
            }}>
              Get data
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {status === 'loading' && (
      <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--text-muted)' }}>
        <div style={{
          display: 'inline-block', width: 28, height: 28,
          border: '3px solid var(--wine-pale)', borderTop: '3px solid var(--wine)',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    
        <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
          Fetching products from Shopify…
        </p>
    
        {loadedCount > 0 && (
          <p style={{ fontSize: 13, color: 'var(--wine)', fontFamily: 'var(--mono)' }}>
            {loadedCount.toLocaleString()} products loaded so far
          </p>
        )}
    
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, maxWidth: 340, margin: '8px auto 0' }}>
          Large stores (10k+ products) can take 30–60 seconds. Please keep this tab open.
        </p>
      </div>
    )}

      {/* ── Results ── */}
      {status === 'done' && (
        <div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>
                {getStoreName(url)} — <span style={{ color: 'var(--wine)' }}>{data.length} rows</span>
              </h2>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 2 }}>{url}</p>
            </div>
            <button onClick={handleReset} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 10,
              padding: '8px 16px', fontSize: 13, cursor: 'pointer',
              color: 'var(--text-muted)', fontFamily: 'var(--font)'
            }}>
              ← New search
            </button>
          </div>

          {/* Data notes + summary stats */}
          <DataNotes
            productCount={productCount}
            variantCount={data.length}
          />

          {/* Collapsible field selector */}
          <FieldSelector selected={selectedFields} onChange={setSelectedFields} />

          {/* Sticky toolbar */}
          <Toolbar
            data={filtered}
            filteredCount={filtered.length}
            totalCount={data.length}
            search={search}
            onSearch={setSearch}
            filterAvailable={filterAvailable}
            onFilterAvailable={setFilterAvailable}
            skuFilter={skuFilter}
            onSkuUpload={setSkuFilter}
            onClearSku={() => setSkuFilter(null)}
            selectedFields={selectedFields}
            filename={filename}
          />

          {/* Table */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: 14 }}>
              No products match your filters.
              <button
                onClick={() => { setSearch(''); setFilterAvailable(false); setSkuFilter(null) }}
                style={{ display: 'block', margin: '12px auto 0', fontSize: 13, color: 'var(--wine)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <DataTable data={filtered} selectedFields={selectedFields} />
          )}

        </div>
      )}

    </div>
  )
}
