import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SolidarityWall from './components/SolidarityWall';
import GalleryView from './components/GalleryView';
import ChatSystem from './components/ChatSystem';
import ProfileView from './components/ProfileView';
import CreatePostModal from './components/CreatePostModal';
import StaffMonitorModal from './components/StaffMonitorModal';
import TransportVolunteerModal from './components/TransportVolunteerModal';
import GratitudeWallView from './components/GratitudeWallView';
import CareScheduleView from './components/CareScheduleView';
import RadarView from './components/RadarView';

import { 
  INITIAL_USER, 
  INITIAL_POSTS, 
  INITIAL_CHATS, 
  INITIAL_GALLERY,
  INITIAL_GRATITUDE_LETTERS,
  INITIAL_CARE_SCHEDULE 
} from './data/initialData';

export default function App() {
  // Navigation: 'muro', 'radar', 'cartas', 'agenda', 'galeria', 'mensajes', 'perfil'
  const [activeTab, setActiveTab] = useState('muro');

  // State with LocalStorage persistence fallbacks
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('conectando_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('conectando_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('conectando_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('conectando_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [letters, setLetters] = useState(() => {
    const saved = localStorage.getItem('conectando_letters');
    return saved ? JSON.parse(saved) : INITIAL_GRATITUDE_LETTERS;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('conectando_schedules');
    return saved ? JSON.parse(saved) : INITIAL_CARE_SCHEDULE;
  });

  const [activeChatId, setActiveChatId] = useState(INITIAL_CHATS[0].id);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('conectando_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('conectando_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('conectando_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('conectando_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('conectando_letters', JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem('conectando_schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Connect / Contact action from a post card
  const handleConnectPost = (post) => {
    let existingChat = chats.find(c => c.postId === post.id);

    if (!existingChat) {
      existingChat = {
        id: `chat-${Date.now()}`,
        postId: post.id,
        peerName: post.isPrivate ? 'Integrante Solidario' : post.userName,
        peerAvatar: post.userAvatar,
        postTitle: post.title,
        staffSupervised: true,
        lastActivity: 'Ahora',
        messages: [
          {
            id: `m-${Date.now()}-1`,
            sender: 'staff',
            text: '🛡️ Chat iniciado y protegido por el Staff de Conectando. Recuerden que todo apoyo es 100% gratuito.',
            time: 'Hace un momento'
          },
          {
            id: `m-${Date.now()}-2`,
            sender: 'me',
            text: `¡Hola! Me comunico con mucho cariño respecto a tu publicación: "${post.title}". ¿Podemos platicar al respecto?`,
            time: 'Hace un momento'
          }
        ]
      };

      setChats(prev => [existingChat, ...prev]);
    }

    setActiveChatId(existingChat.id);
    setActiveTab('mensajes');
  };

  // Create post
  const handleCreatePost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setUser(prev => ({
      ...prev,
      actsCompleted: prev.actsCompleted + 1
    }));
  };

  // Send Chat Message
  const handleSendMessage = (chatId, text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          lastActivity: timeStr,
          messages: [
            ...c.messages,
            {
              id: `m-${Date.now()}`,
              sender: 'me',
              text,
              time: timeStr
            }
          ]
        };
      }
      return c;
    }));
  };

  // Complete Delivery
  const handleCompleteDelivery = (chat, note, image) => {
    if (note) {
      const newGalEntry = {
        id: `gal-${Date.now()}`,
        title: `Entrega realizada: ${chat.postTitle}`,
        category: 'Solidaridad',
        date: new Date().toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' }),
        image: image.trim() || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
        donor: user.name,
        recipient: chat.peerName,
        story: note
      };

      setGallery(prev => [newGalEntry, ...prev]);
    }

    setUser(prev => ({
      ...prev,
      thanksReceived: prev.thanksReceived + 1
    }));

    setActiveTab('galeria');
  };

  // Filter posts belonging to active user
  const myPosts = posts.filter(p => p.userName === user.name || p.userName === 'Sofía Morales');

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        openCreateModal={() => setIsCreateModalOpen(true)}
        openStaffModal={() => setIsStaffModalOpen(true)}
        openTransportModal={() => setIsTransportModalOpen(true)}
        unreadCount={1}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'muro' && (
          <SolidarityWall 
            posts={posts}
            onConnect={handleConnectPost}
            openCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'radar' && (
          <RadarView 
            posts={posts}
            onConnect={handleConnectPost}
          />
        )}

        {activeTab === 'cartas' && (
          <GratitudeWallView 
            letters={letters}
            onAddLetter={(newLetter) => setLetters(prev => [newLetter, ...prev])}
          />
        )}

        {activeTab === 'agenda' && (
          <CareScheduleView 
            scheduleItems={schedules}
            onAddScheduleItem={(newItem) => setSchedules(prev => [...prev, newItem])}
          />
        )}

        {activeTab === 'galeria' && (
          <GalleryView 
            galleryItems={gallery}
            onAddGalleryItem={(newItem) => setGallery(prev => [newItem, ...prev])}
          />
        )}

        {activeTab === 'mensajes' && (
          <ChatSystem 
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onSendMessage={handleSendMessage}
            onCompleteDelivery={handleCompleteDelivery}
          />
        )}

        {activeTab === 'perfil' && (
          <ProfileView 
            user={user}
            onUpdateUser={setUser}
            userPosts={myPosts}
            onConnect={handleConnectPost}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '1.5rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <p>
          <strong>Conectando</strong> • Red de Ayuda Mutua y Solidaridad | Basada en Dignidad e Igualdad Absoluta
        </p>
        <p style={{ marginTop: '0.3rem', fontSize: '0.78rem' }}>
          🛡️ Todas las interacciones están libres de costos, cobros o transacciones comerciales.
        </p>
      </footer>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleCreatePost}
      />

      {/* Staff Protection Modal */}
      <StaffMonitorModal 
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />

      {/* Transport Volunteers Hub Modal */}
      <TransportVolunteerModal 
        isOpen={isTransportModalOpen}
        onClose={() => setIsTransportModalOpen(false)}
      />
    </div>
  );
}
