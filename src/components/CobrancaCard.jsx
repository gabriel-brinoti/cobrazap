import { CheckCircle2, MessageCircle, RotateCcw, XCircle } from 'lucide-react'
import { formatCurrency, formatDate, isOverdue } from '../utils/formatters.js'

const statusLabel = {
  pendente: 'Pendente',
  enviado: 'Enviado',
  pago: 'Pago',
  cancelado: 'Cancelado',
}

export default function CobrancaCard({ cobranca, onPrepareMessage, onStatusChange }) {
  const overdue = isOverdue(cobranca.vencimento, cobranca.status)

  return (
    <article className={`card cobranca-card ${overdue ? 'overdue' : ''}`}>
      <div className="card-header">
        <div>
          <h3>{cobranca.clientes?.nome || 'Cliente removido'}</h3>
          <p>{cobranca.descricao || 'Cobrança sem descrição'}</p>
        </div>
        <span className={`badge ${cobranca.status}`}>{overdue ? 'Vencida' : statusLabel[cobranca.status]}</span>
      </div>
      <div className="money-line">{formatCurrency(cobranca.valor)}</div>
      <div className="muted">Vencimento: {formatDate(cobranca.vencimento)}</div>
      <div className="row-actions wrap">
        <button onClick={() => onPrepareMessage(cobranca)}><MessageCircle size={17} /> Enviar</button>
        <button className="success-button" onClick={() => onStatusChange(cobranca.id, 'pago')}><CheckCircle2 size={17} /> Pago</button>
        <button className="secondary-button" onClick={() => onStatusChange(cobranca.id, 'pendente')}><RotateCcw size={17} /> Pendente</button>
        <button className="danger-button" onClick={() => onStatusChange(cobranca.id, 'cancelado')}><XCircle size={17} /> Cancelar</button>
      </div>
    </article>
  )
}
