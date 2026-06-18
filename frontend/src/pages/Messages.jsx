import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { P, PL } from '../utils/theme';

const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const socket = io(socketUrl);

const Messages = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeUser, setActiveUser] = useState(null);

  // Helper to fetch conversations list
  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/messages', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setConversations(data);
    } catch {
      toast.error('Failed to load conversations');
    }
  };

  // Fetch conversations on load
  useEffect(() => {
    fetchConversations();
  }, []);

  // Connect socket and handle incoming messages
  useEffect(() => {
    socket.emit('user_connected', user._id);

    const handleMessage = (msg) => {
      // Check if message belongs to active conversation
      const isFromActiveUser = 
        (msg.sender._id === userId || msg.receiver._id === userId) ||
        (msg.sender === userId || msg.receiver === userId);

      if (isFromActiveUser) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
      // Refresh unread counts & last messages in sidebar
      fetchConversations();
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [user._id, userId]);

  // Fetch messages with selected user
  useEffect(() => {
    if (!userId) return;
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/messages/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(data);

        // Set active user name from messages or fetch metadata fallback
        if (data.length > 0) {
          const other = data[0].sender._id === user._id ? data[0].receiver : data[0].sender;
          setActiveUser(other);
        } else {
          // If no message history exists yet, fetch recipient's metadata
          const res = await axios.get(`/auth/user/${userId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setActiveUser(res.data);
        }
      } catch {
        toast.error('Failed to load messages');
      }
    };
    fetchMessages();
  }, [userId]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    const messagePayload = {
      senderId: user._id,
      receiverId: userId,
      content: text,
    };

    // If socket is connected, send via socket
    if (socket.connected) {
      socket.emit('send_message', messagePayload);
      setText('');
    } else {
      // Fallback: Send message via REST API
      try {
        const { data } = await axios.post('/messages', {
          receiverId: userId,
          content: text,
        }, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        // Append locally immediately
        setMessages((prev) => [...prev, data]);
        setText('');
        // Refresh conversations list
        fetchConversations();
      } catch (error) {
        toast.error('Failed to send message');
      }
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const dashboardPath = user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F0EB' }}>

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(dashboardPath)}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-800">Messages</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center p-6">No conversations yet</p>
          ) : (
            conversations.map((conv, i) => (
              <Link key={i} to={`/messages/${conv.user._id}`}
                className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition border-b border-gray-50 ${userId === conv.user._id ? 'border-l-4' : ''
                  }`}
                style={userId === conv.user._id ? { borderLeftColor: P, backgroundColor: PL } : {}}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: P }}>
                  {conv.user.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{conv.user.name}</p>
                  <p className="text-gray-400 text-xs truncate">{conv.lastMsg}</p>
                </div>
                {conv.unread && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: P }} />
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {!userId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: PL }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B2D8E" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: P }}>
                {activeUser?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{activeUser?.name || 'Loading...'}</p>
                <p className="text-xs text-gray-400 capitalize">{activeUser?.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.map((msg, i) => {
                const isMine = msg.sender._id === user._id || msg.sender._id?.toString() === user._id?.toString();
                return (
                  <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                      }`}
                      style={isMine ? { backgroundColor: P } : {}}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? 'text-purple-200' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-4 flex items-center gap-3">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm text-gray-800"
              />
              <button onClick={sendMessage}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-white hover:opacity-90 transition flex-shrink-0"
                style={{ backgroundColor: P }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;