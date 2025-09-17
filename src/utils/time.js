export function formatDateTime(ts) {
  try {
    const d=new Date(ts)
    const dd = String(d.getDate()).padStart(2,'0')
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const yyyy = d.getFullYear()
    const hh = String(d.getHours()).padStart(2,'0')
    const mi = String(d.getMinutes()).padStart(2,'0')
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`
  } catch {
    return ''
  }
}
