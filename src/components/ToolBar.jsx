import { useRef } from 'react'
import { exportCSV, exportXLSX } from '../utils/exporter'

export default function Toolbar({
  data, filteredCount, totalCount,
  search, onSearch,
  filterAvailable, onFilterAvailable,
  selectedFields,
  onSkuUpload,
  skuFilter, onClearSku,
  filename,
}) {
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target.result
      // Support CSV or plain text — one SKU per line or comma-separated
      const skus = text
        .split(/[\n,]+/)
        .map(s => s.trim().replace(/^"|"$/g, ''))
        .filter(Boolean)
      onSkuUpload(skus)
    }
    reader.readAsText(file)
    // Reset input so same file can be re-uploaded
    e.target.value = ''
  }

  return (
    <div style={{
      position: 'sticky',
      top: 64,               // sits right below the navbar
      zIndex: 90,
      background: 'var(--cream)',
      borderBottom: '1px solid var(--border)',
      padding: '10px 0 12px',
      marginBottom: 12,
    }}>

      {/* Row 1 — search + filters + export */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by name, SKU, brand, tag…"
            style={{
              width: '100%', padding: '8px 12px 8px 32px', fontSize: 13,
              border: '1px solid var(--border)', borderRadius: 10,
              background: '#fff', color: 'var(--text)', outline: 'none',
              fontFamily: 'var(--font)'
            }}
          />
          {search && (
            <button onClick={() => onSearch('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
              color: 'var(--text-muted)', fontFamily: 'var(--font)'
            }}>✕</button>
          )}
        </div>

        {/* In stock filter */}
        <button
          onClick={() => onFilterAvailable(!filterAvailable)}
          style={{
            padding: '8px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
            border: `1px solid ${filterAvailable ? '#1a7a4a' : 'var(--border)'}`,
            background: filterAvailable ? '#e6f4ec' : '#fff',
            color: filterAvailable ? '#1a7a4a' : 'var(--text-muted)',
            fontFamily: 'var(--font)', fontWeight: filterAvailable ? 500 : 400,
            transition: 'all 0.15s', whiteSpace: 'nowrap'
          }}
        >
          {filterAvailable ? '✓ ' : ''}In stock only
        </button>

        {/* SKU upload */}
        <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: 'none' }} />
        <button
          onClick={() => fileRef.current.click()}
          style={{
            padding: '8px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
            border: `1px solid ${skuFilter ? 'var(--wine)' : 'var(--border)'}`,
            background: skuFilter ? 'var(--wine-pale)' : '#fff',
            color: skuFilter ? 'var(--wine)' : 'var(--text-muted)',
            fontFamily: 'var(--font)', fontWeight: skuFilter ? 500 : 400,
            transition: 'all 0.15s', whiteSpace: 'nowrap'
          }}
        >
          ↑ Filter by SKU file
        </button>

        {/* Clear SKU filter */}
        {skuFilter && (
          <button onClick={onClearSku} style={{
            padding: '8px 12px', borderRadius: 10, fontSize: 12, cursor: 'pointer',
            border: '1px solid var(--border)', background: '#fff',
            color: 'var(--text-muted)', fontFamily: 'var(--font)'
          }}>
            ✕ Clear SKU filter ({skuFilter.length} SKUs)
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* Row count */}
        <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {filteredCount === totalCount
            ? `${totalCount} rows`
            : `${filteredCount} of ${totalCount} rows`}
        </span>

        {/* Export */}
        <button
          onClick={() => exportCSV(data, selectedFields, filename)}
          style={{
            background: 'var(--wine)', color: '#fff', border: 'none',
            borderRadius: 10, padding: '8px 16px', fontSize: 13,
            cursor: 'pointer', fontWeight: 500, fontFamily: 'var(--font)',
            whiteSpace: 'nowrap'
          }}
        >
          ↓ CSV
        </button>
        <button
          onClick={() => exportXLSX(data, selectedFields, filename)}
          style={{
            background: 'var(--wine-pale)', color: 'var(--wine)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '8px 16px', fontSize: 13, cursor: 'pointer',
            fontWeight: 500, fontFamily: 'var(--font)', whiteSpace: 'nowrap'
          }}
        >
          ↓ XLSX
        </button>
      </div>
    </div>
  )
}