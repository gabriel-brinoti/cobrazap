export function formatCurrency(value) {
  const number = Number(value || 0)
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(date) {
  if (!date) return '-'
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '')
}

export function normalizePhoneBR(phone) {
  const numbers = onlyNumbers(phone)
  if (numbers.startsWith('55')) return numbers
  return `55${numbers}`
}

export function isOverdue(date, status) {
  if (!date || status === 'pago' || status === 'cancelado') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${date}T00:00:00`)
  return due < today
}
