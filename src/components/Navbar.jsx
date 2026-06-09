import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, LogOut, MessageCircle, UsersRound } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <aside className="navbar">
      <div className="brand">
        <div className="brand-icon">CZ</div>
        <div>
          <strong>CobraZap</strong>
          <span>cobranças via WhatsApp</span>
        </div>
      </div>

      <nav>
        <Link className={isActive('/') ? 'active' : ''} to="/"><LayoutDashboard size={18} /> Dashboard</Link>
        <Link className={isActive('/clientes') ? 'active' : ''} to="/clientes"><UsersRound size={18} /> Clientes</Link>
        <Link className={isActive('/cobrancas') ? 'active' : ''} to="/cobrancas"><MessageCircle size={18} /> Cobranças</Link>
      </nav>

      <button className="ghost-button" onClick={logout}><LogOut size={18} /> Sair</button>
    </aside>
  )
}
