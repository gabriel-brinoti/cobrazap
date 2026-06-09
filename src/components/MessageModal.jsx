export default function MessageModal({ message, setMessage, onClose, onSend }) {
  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <h2>Editar mensagem</h2>
        <p className="muted">Revise antes de abrir o WhatsApp.</p>
        <textarea className="message-editor" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="row-actions">
          <button className="secondary-button" onClick={onClose}>Cancelar</button>
          <button onClick={onSend}>Abrir WhatsApp</button>
        </div>
      </div>
    </div>
  )
}
