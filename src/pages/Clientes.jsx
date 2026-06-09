import { useEffect, useState } from 'react'
import ClienteForm from '../components/ClienteForm.jsx'
import { supabase } from '../lib/supabase.js'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadClientes() }, [])

  async function loadClientes() {
    const { data, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false })
    if (!error) setClientes(data || [])
  }

  async function createCliente(form) {
    setLoading(true)
    const { error } = await supabase.from('clientes').insert({
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
      observacao: form.observacao.trim() || null,
    })
    if (error) alert(error.message)
    await loadClientes()
    setLoading(false)
  }

  async function deleteCliente(id) {
    if (!confirm('Excluir cliente?')) return
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (error) alert(error.message)
    await loadClientes()
  }

  return (
    <section>
      <div className="page-title"><div><h1>Clientes</h1><p>Cadastre os contatos que vão receber cobranças.</p></div></div>
      <div className="two-columns">
        <ClienteForm onSubmit={createCliente} loading={loading} />
        <div className="card list-card">
          <h2>Lista de clientes</h2>
          {clientes.length === 0 && <p className="muted">Nenhum cliente cadastrado ainda.</p>}
          <div className="stack">
            {clientes.map((cliente) => (
              <div className="list-item" key={cliente.id}>
                <div><strong>{cliente.nome}</strong><span>{cliente.telefone}</span>{cliente.observacao && <small>{cliente.observacao}</small>}</div>
                <button className="danger-button small" onClick={() => deleteCliente(cliente.id)}>Excluir</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
