import { formatCurrency, formatDate, normalizePhoneBR } from './formatters.js'

export function buildDefaultMessage(cliente, cobranca) {
  return `Olá ${cliente.nome}, tudo bem? Passando para lembrar da cobrança ${cobranca.descricao ? `referente a ${cobranca.descricao}` : ''} no valor de ${formatCurrency(cobranca.valor)}, com vencimento em ${formatDate(cobranca.vencimento)}. Qualquer dúvida fico à disposição.`
}

export function buildWhatsAppLink(phone, message) {
  const normalizedPhone = normalizePhoneBR(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`
}
