import { useEffect, useMemo, useState } from 'react'
import CobrancaCard from '../components/CobrancaCard.jsx'
import CobrancaForm from '../components/CobrancaForm.jsx'
import MessageModal from '../components/MessageModal.jsx'
import { supabase } from '../lib/supabase.js'
import { buildDefaultMessage, buildWhatsAppLink } from '../utils/whatsapp.js'
import { isOverdue } from '../utils/formatters.js'

export default function Cobrancas() {
  const [clientes, setClientes] = useState([])
  const [cobrancas, setCobrancas] = useState([])
  const [filter, setFilter] = useState('todas')
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [{ data: clientesData }, { data: cobrancasData }] = await Promise.all([
      supabase.from('clientes').select('*').order('nome'),
      supabase.from('cobrancas').select('*, clientes(*)').order('vencimento', { ascending: true }),
    ])
    setClientes(clientesData || [])
    setCobrancas(cobrancasData || [])
  }

  async function createCobranca(form) {
    setLoading(true)
    const { error } = await supabase.from('cobrancas').insert({
      cliente_id: form.cliente_id,
      descricao: form.descricao.trim() || null,
      valor: Number(form.valor),
      vencimento: form.vencimento,
      status: 'pendente',
    })
    if (error) alert(error.message)
    await loadAll()
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('cobrancas').update({ status }).eq('id', id)
    if (error) alert(error.message)
    await loadAll()
  }

  function prepareMessage(cobranca) {
    const msg = cobranca.mensagem_customizada || buildDefaultMessage(cobranca.clientes, cobranca)
    setSelected(cobranca)
    setMessage(msg)
  }

  async function sendMessage() {
    if (!selected) return
    const link = buildWhatsAppLink(selected.clientes.telefone, message)
    await supabase.from('cobrancas').update({ status: 'enviado', mensagem_customizada: message }).eq('id', selected.id)
    window.open(link, '_blank', 'noopener,noreferrer')
    setSelected(null)
    setMessage('')
    await loadAll()
  }

  const filteredCobrancas = useMemo(() => {
    if (filter === 'todas') return cobrancas
    if (filter === 'vencidas') return cobrancas.filter((item) => isOverdue(item.vencimento, item.status))
    return cobrancas.filter((item) => item.status === filter)
  }, [cobrancas, filter])

  return (
    <section>
      <div className="page-title"><div><h1>Cobranças</h1><p>Crie, envie e acompanhe suas cobranças pelo WhatsApp.</p></div></div>
      <div className="two-columns">
        <CobrancaForm clientes={clientes} onSubmit={createCobranca} loading={loading} />
        <div>
          <div className="filters card">
            {['todas', 'pendente', 'vencidas', 'enviado', 'pago', 'cancelado'].map((item) => (
              <button key={item} className={filter === item ? 'active-filter' : 'secondary-button'} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
          <div className="stack">
            {filteredCobrancas.length === 0 && <div className="card muted">Nenhuma cobrança nesse filtro.</div>}
            {filteredCobrancas.map((cobranca) => (
              <CobrancaCard key={cobranca.id} cobranca={cobranca} onPrepareMessage={prepareMessage} onStatusChange={updateStatus} />
            ))}
          </div>
        </div>
      </div>
      {selected && <MessageModal message={message} setMessage={setMessage} onClose={() => setSelected(null)} onSend={sendMessage} />}
    </section>
  )
}
