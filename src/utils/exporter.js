import * as XLSX from 'xlsx'

function getRows(data, selectedFields) {
  return data.map(row =>
    Object.fromEntries(
      [...selectedFields].map(f => [f, row[f] ?? ''])
    )
  )
}

export function exportCSV(data, selectedFields, filename = 'products') {
  const rows = getRows(data, selectedFields)
  const headers = [...selectedFields]
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function exportXLSX(data, selectedFields, filename = 'products') {
  const rows = getRows(data, selectedFields)
  const ws = XLSX.utils.json_to_sheet(rows, { header: [...selectedFields] })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Products')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}