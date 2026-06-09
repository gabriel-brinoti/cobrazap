import { useState } from 'react'

export default function CobrancaForm({ clientes, onSubmit, loading }) {
  const [form, setForm] = useState({ cliente_id: '', descricao: '', valor: '', vencimento: '' })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    onSubmit(form).then(() => setForm({ cliente_id: '', descricao: '', valor: '', vencimento: '' }))
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Nova cobrança</h2>
      <label>Cliente</label>
      <select value={form.cliente_id} onChange={(e) => updateField('cliente_id', e.target.value)} required>
        <option value="">Selecione</option>
        {clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>)}
      </select>
      <label>Descrição</label>
      <input value={form.descricao} onChange={(e) => updateField('descricao', e.target.value)} placeholder="Ex: Mensalidade sistema" />
      <label>Valor</label>
      <input value={form.valor} onChange={(e) => updateField('valor', e.target.value)} type="number" min="0" step="0.01" placeholder="150.00" required />
      <label>Vencimento</label>
      <input value={form.vencimento} onChange={(e) => updateField('vencimento', e.target.value)} type="date" required />
      <button disabled={loading || clientes.length === 0}>{loading ? 'Salvando...' : 'Salvar cobrança'}</button>
    </form>
  )
}
