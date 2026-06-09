import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) setError('E-mail ou senha inválidos. Confira o usuário no Supabase Auth.')
    setLoading(false)
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand large"><div className="brand-icon">CZ</div><div><strong>CobraZap</strong><span>Controle simples de cobranças</span></div></div>
        <h1>Entrar</h1>
        <label>E-mail</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="error-box">{error}</div>}
        <button disabled={loading}>{loading ? 'Entrando...' : 'Acessar sistema'}</button>
      </form>
    </div>
  )
}
