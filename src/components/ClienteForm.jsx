import { useState } from 'react'

export default function ClienteForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ nome: '', telefone: '', observacao: '' })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    onSubmit(form).then(() => setForm({ nome: '', telefone: '', observacao: '' }))
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Novo cliente</h2>
      <label>Nome</label>
      <input value={form.nome} onChange={(e) => updateField('nome', e.target.value)} placeholder="Ex: João Silva" required />
      <label>WhatsApp com DDD</label>
      <input value={form.telefone} onChange={(e) => updateField('telefone', e.target.value)} placeholder="Ex: 16999999999" required />
      <label>Observação</label>
      <textarea value={form.observacao} onChange={(e) => updateField('observacao', e.target.value)} placeholder="Opcional" />
      <button disabled={loading}>{loading ? 'Salvando...' : 'Salvar cliente'}</button>
    </form>
  )
}
