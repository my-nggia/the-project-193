import { useState, useMemo, useRef, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ALL_FIELDS, FIELD_LABELS } from './FieldSelector'
// import FieldSelector, { ALL_FIELDS, DEFAULT_FIELDS } from '../components/FieldSelector'

const MONO_FIELDS = new Set(['product_id', 'variant_id', 'sku', 'price', 'compare_at_price'])
const DATE_FIELDS = new Set(['published_at', 'created_at', 'updated_at'])
const ROW_HEIGHT  = 48   // px — every row is the same height for virtual scroll

function formatDate(val) {
  if (!val) return ''
  try { return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return val }
}

function CellValue({ field, value }) {
  if (field === 'available') {
    return (
      <span style={{
        display: 'inline-block', padding: '2px 10px', borderRadius: 20,
        fontSize: 11, fontWeight: 500,
        background: value === 'Yes' ? '#e6f4ec' : '#fdf0f0',
        color:      value === 'Yes' ? '#1a7a4a' : '#c0392b',
      }}>
        {value === 'Yes' ? 'In Stock' : 'Out of Stock'}
      </span>
    )
  }

  if (field === 'images') {
    const urls = value.split(' | ').filter(Boolean)
    if (!urls.length) return <span style={{ color: 'var(--text-muted)' }}>—</span>
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {urls.slice(0, 3).map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noreferrer">
            <img src={url} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }} />
          </a>
        ))}
        {urls.length > 3 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>
            +{urls.length - 3}
          </span>
        )}
      </div>
    )
  }

  if (DATE_FIELDS.has(field))
    return <span style={{ color: 'var(--text-muted)' }}>{formatDate(value)}</span>

  if (field === 'price' || field === 'compare_at_price') {
    if (!value || value === '0.00') return <span style={{ color: 'var(--text-muted)' }}>—</span>
    return <span style={{ color: 'var(--wine)', fontFamily: 'var(--mono)' }}>${value}</span>
  }

  if (!value) return <span style={{ color: 'var(--text-muted)' }}>—</span>
  return <span>{value}</span>
}

export default function DataTable({ data, selectedFields }) {
  const [sortKey, setSortKey] = useState('product_title')
  const [sortDir, setSortDir] = useState('asc')

  const topScrollRef   = useRef()
  const tableScrollRef = useRef()
  const tableRef       = useRef()
  const [tableWidth, setTableWidth] = useState(0)

  const syncFromTop   = () => { if (tableScrollRef.current) tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft }
  const syncFromTable = () => { if (topScrollRef.current)   topScrollRef.current.scrollLeft   = tableScrollRef.current.scrollLeft }

  useEffect(() => {
    if (!tableRef.current) return
    const observer = new ResizeObserver(() => setTableWidth(tableRef.current.offsetWidth))
    observer.observe(tableRef.current)
    return () => observer.disconnect()
  }, [selectedFields, data])

  const visibleFields = ALL_FIELDS.filter(f => selectedFields.has(f))

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = String(a[sortKey] ?? '')
      const bv = String(b[sortKey] ?? '')
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [data, sortKey, sortDir])

  const handleSort = (field) => {
    if (field === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(field); setSortDir('asc') }
  }

  // Virtual scroll — only renders visible rows
  const rowVirtualizer = useVirtualizer({
    count:           sorted.length,
    getScrollElement: () => tableScrollRef.current,
    estimateSize:    () => ROW_HEIGHT,
    overscan:        10,   // render 10 extra rows above/below for smooth scrolling
  })

  const virtualRows  = rowVirtualizer.getVirtualItems()
  const totalHeight  = rowVirtualizer.getTotalSize()

  // Padding rows to fill the virtual space above and below rendered rows
  const paddingTop    = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length > 0
    ? totalHeight - virtualRows[virtualRows.length - 1].end
    : 0

  return (
    <div style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: '#fff', overflow: 'hidden' }}>

      {/* ── Top scrollbar mirror ── */}
      <div
        ref={topScrollRef}
        onScroll={syncFromTop}
        style={{ overflowX: 'auto', overflowY: 'hidden', height: 12, borderBottom: '1px solid var(--border)' }}
      >
        <div style={{ width: tableWidth, height: 1 }} />
      </div>

      {/* ── Scrollable table container — fixed height so virtual scroll works ── */}
      <div
        ref={tableScrollRef}
        onScroll={syncFromTable}
        style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '65vh' }}
      >
        <table
          ref={tableRef}
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}
        >

          {/* Column widths */}
          <colgroup>
            {visibleFields.map(f => (
              <col key={f} style={{ width: ['tags','options','product_title'].includes(f) ? 220 : f === 'images' ? 130 : 150 }} />
            ))}
          </colgroup>

          {/* Sticky header */}
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
              {visibleFields.map(f => (
                <th
                  key={f}
                  onClick={() => handleSort(f)}
                  style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    color: sortKey === f ? 'var(--wine)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap', cursor: 'pointer',
                    userSelect: 'none', fontFamily: 'var(--font)',
                    background: 'var(--cream)',
                  }}
                >
                  {FIELD_LABELS[f] ?? f} {sortKey === f ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Top padding — represents rows above the visible window */}
            {paddingTop > 0 && (
              <tr><td colSpan={visibleFields.length} style={{ height: paddingTop, padding: 0, border: 'none' }} /></tr>
            )}

            {/* Only the visible rows get rendered */}
            {virtualRows.map(virtualRow => {
              const row = sorted[virtualRow.index]
              return (
                <tr
                  key={`${row.product_id}-${row.variant_id}-${virtualRow.index}`}
                  style={{
                    height: ROW_HEIGHT,
                    borderBottom: '1px solid var(--border)',
                    background: virtualRow.index % 2 === 0 ? '#fff' : '#fdfaf9',
                  }}
                >
                  {visibleFields.map(f => (
                    <td key={f} style={{
                      padding: '0 14px',
                      fontFamily: MONO_FIELDS.has(f) ? 'var(--mono)' : 'var(--font)',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: f === 'tags' || f === 'options' ? 'normal' : 'nowrap',
                      verticalAlign: 'middle',
                      height: ROW_HEIGHT,
                    }}>
                      <CellValue field={f} value={String(row[f] ?? '')} />
                    </td>
                  ))}
                </tr>
              )
            })}

            {/* Bottom padding — represents rows below the visible window */}
            {paddingBottom > 0 && (
              <tr><td colSpan={visibleFields.length} style={{ height: paddingBottom, padding: 0, border: 'none' }} /></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '8px 14px', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--cream)', fontSize: 12, color: 'var(--text-muted)'
      }}>
        <span>Showing {sorted.length.toLocaleString()} rows</span>
        <span>{visibleFields.length} columns</span>
      </div>

    </div>
  )
}