import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { formatCurrency, isOverdue } from '../utils/formatters.js'

export default function Dashboard() {
  const [cobrancas, setCobrancas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data, error } = await supabase.from('cobrancas').select('*, clientes(nome)').order('vencimento', { ascending: true })
    if (!error) setCobrancas(data || [])
    setLoading(false)
  }

  const stats = useMemo(() => {
    const pendentes = cobrancas.filter((item) => item.status === 'pendente')
    const vencidas = cobrancas.filter((item) => isOverdue(item.vencimento, item.status))
    const pagas = cobrancas.filter((item) => item.status === 'pago')
    const totalPendente = pendentes.reduce((sum, item) => sum + Number(item.valor || 0), 0)
    return { pendentes: pendentes.length, vencidas: vencidas.length, pagas: pagas.length, totalPendente }
  }, [cobrancas])

  return (
    <section>
      <div className="page-title"><div><h1>Dashboard</h1><p>Visão rápida das suas cobranças.</p></div><Link className="button-link" to="/cobrancas">Nova cobrança</Link></div>
      {loading ? <div className="card">Carregando...</div> : (
        <div className="grid stats-grid">
          <div className="card stat"><span>Pendentes</span><strong>{stats.pendentes}</strong></div>
          <div className="card stat"><span>Vencidas</span><strong>{stats.vencidas}</strong></div>
          <div className="card stat"><span>Pagas</span><strong>{stats.pagas}</strong></div>
          <div className="card stat"><span>Total pendente</span><strong>{formatCurrency(stats.totalPendente)}</strong></div>
        </div>
      )}
    </section>
  )
}
