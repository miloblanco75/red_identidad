import React, { useState } from 'react';
import { Send, ShieldCheck, Image, CheckCircle, MessageSquare, AlertCircle, FileText } from 'lucide-react';
import ComodatoAgreementModal from './ComodatoAgreementModal';

export default function ChatSystem({ chats, activeChatId, onSelectChat, onSendMessage, onCompleteDelivery, user }) {
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const [inputMsg, setInputMsg] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showComodatoModal, setShowComodatoModal] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryImage, setDeliveryImage] = useState('');

  if (!activeChat) {
    return (
      <div className="chat-layout" style={{ justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
        <p style={{ color: '#64748b' }}>No tienes mensajes activos por el momento.</p>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    onSendMessage(activeChat.id, inputMsg);
    setInputMsg('');
  };

  const handleFinishDelivery = (e) => {
    e.preventDefault();
    onCompleteDelivery(activeChat, deliveryNote, deliveryImage);
    setShowDeliveryModal(false);
    setDeliveryNote('');
    setDeliveryImage('');
  };

  const handleSignAgreement = (agreementData) => {
    // Post automated message into the chat confirming agreement signed
    onSendMessage(
      activeChat.id,
      `📜 ACUERDO DE COMODATO DIGITAL FIRMADO: Préstamo gratuito acordado por ${agreementData.duration} a partir del ${agreementData.date}. Resguardado por el Staff.`
    );
  };

  return (
    <div className="chat-layout">
      {/* Sidebar Threads List */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <span className="chat-sidebar-title">Conversaciones Solidarias</span>
          <span className="badge badge-private" style={{ fontSize: '0.72rem' }}>
            <ShieldCheck size={12} color="#059669" /> Chat Protegido
          </span>
        </div>

        <div className="chat-threads-list">
          {chats.map(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isSelected = chat.id === activeChat.id;

            return (
              <div
                key={chat.id}
                className={`chat-thread-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <img src={chat.peerAvatar} alt={chat.peerName} className="thread-avatar" />
                <div className="thread-info">
                  <div className="thread-user-name">
                    <span>{chat.peerName}</span>
                    <span className="thread-time">{chat.lastActivity}</span>
                  </div>
                  <div className="thread-last-msg">
                    {lastMsg ? lastMsg.text : 'Conversación iniciada'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Conversation View */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-user-header">
            <img src={activeChat.peerAvatar} alt={activeChat.peerName} className="user-avatar-sm" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{activeChat.peerName}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Asunto: <strong>{activeChat.postTitle}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', borderColor: '#2563eb', color: '#1d4ed8' }}
              onClick={() => setShowComodatoModal(true)}
              title="Generar Acuerdo de Comodato Digital para préstamo temporal"
            >
              <FileText size={14} color="#2563eb" />
              <span>Firmar Comodato</span>
            </button>

            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
              onClick={() => setShowDeliveryModal(true)}
            >
              <CheckCircle size={14} color="#059669" />
              <span>Completar Entrega</span>
            </button>
          </div>
        </div>

        {/* Staff Protection Notice Banner */}
        <div className="staff-protection-banner">
          <ShieldCheck size={18} />
          <span>
            <strong>Resguardo del Staff:</strong> Chat supervisado en segundo plano. Puedes generar un <strong>Acuerdo de Comodato Digital</strong> si se trata de un préstamo temporal de equipo.
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="messages-container">
          {activeChat.messages.map(msg => {
            const isSentByMe = msg.sender === 'me';
            const isStaffNotice = msg.sender === 'staff';

            if (isStaffNotice) {
              return (
                <div key={msg.id} className="msg-bubble-wrap staff" style={{ alignSelf: 'center', maxWidth: '85%' }}>
                  <div className="msg-bubble">
                    {msg.text}
                  </div>
                  <div className="msg-time" style={{ textAlign: 'center' }}>{msg.time}</div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`msg-bubble-wrap ${isSentByMe ? 'sent' : 'received'}`}>
                <div className="msg-bubble">
                  {msg.text}
                </div>
                <div className="msg-time">{msg.time}</div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="chat-input-bar">
          <input 
            type="text"
            className="chat-input-field"
            placeholder="Escribe un mensaje para acordar la entrega o el periodo de préstamo..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, justifyContent: 'center' }}>
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Complete Delivery Modal */}
      {showDeliveryModal && (
        <div className="modal-overlay" onClick={() => setShowDeliveryModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle color="#059669" size={20} />
                Confirmar Entrega / Donación Realizada
              </h3>
            </div>
            <form onSubmit={handleFinishDelivery} className="modal-body">
              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1rem' }}>
                ¡Qué gran momento! Puedes compartir unas palabras de agradecimiento y (opcionalmente) una foto de la entrega para inspirar a la comunidad en la Galería.
              </p>

              <div className="form-group">
                <label className="form-label">Mensaje o Testimonio de Gratitud</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  placeholder="Ej. Entregamos la silla ortopédica con mucho amor y cariño..."
                  required
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Foto de la Entrega (URL Opcional)</label>
                <input 
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={deliveryImage}
                  onChange={e => setDeliveryImage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowDeliveryModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                  Guardar y Publicar en Galería
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comodato Agreement Modal */}
      <ComodatoAgreementModal 
        isOpen={showComodatoModal}
        onClose={() => setShowComodatoModal(false)}
        post={{ title: activeChat.postTitle, userName: activeChat.peerName }}
        user={user}
        peerName={activeChat.peerName}
        onSignAgreement={handleSignAgreement}
      />
    </div>
  );
}
