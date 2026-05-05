import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/shared/Navbar';
import MarcMessageBubble from '@/components/marc/MarcMessageBubble';
import { Send, Loader2, MapPin, CheckSquare, Square, TrendingUp, BarChart2, Building2 } from 'lucide-react';
import NewClaimModal from '@/components/planner/NewClaimModal';
import { useQuery } from '@tanstack/react-query';

const MARC_AVATAR = 'https://media.base44.com/images/public/69e13864d740c55bded1c850/7f3a140dc_generated_image.png';

function MarcAvatar({ size = 'sm' }) {
  const isLg = size === 'lg';
  return (
    <div className={`relative flex-shrink-0 ${isLg ? 'w-12 h-12' : 'w-8 h-8'}`}>
      <div className={`w-full h-full rounded-xl overflow-hidden border-2 ${isLg ? 'border-[#FFD700]' : 'border-gray-200'}`}>
        <img src={MARC_AVATAR} alt="MARC" className="w-full h-full object-cover" />
      </div>
      {isLg && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />}
    </div>
  );
}

export default function Marc() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showClaim, setShowClaim] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const { data: allLocations = [] } = useQuery({
    queryKey: ['locations-marc'],
    queryFn: () => base44.entities.Location.list('-id', 5000),
  });

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      sessionStorage.setItem('mr_login_next', '/marc');
      navigate('/toegang');
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    startConversation();
  }, [isAuthenticated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'marc',
      metadata: { name: 'MARC Consult' },
    });
    setConversation(conv);

    const unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });

    // Send initial greeting trigger
    await base44.agents.addMessage(conv, {
      role: 'user',
      content: '__START__',
    });

    return () => unsubscribe();
  };

  const sendMessage = async () => {
    if (!input.trim() || sending || !conversation) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Filter locations from last assistant message that mentions a location search
  const suggestedLocations = React.useMemo(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistant?.content) return [];
    // If assistant mentions found locations, return some locations
    const content = lastAssistant.content.toLowerCase();
    if (content.includes('gevonden') && (content.includes('locatie') || content.includes('bord'))) {
      return allLocations.slice(0, 20);
    }
    return [];
  }, [messages, allLocations]);

  useEffect(() => {
    if (suggestedLocations.length > 0) setShowResults(true);
  }, [suggestedLocations]);

  const selectedLocations = suggestedLocations.filter(l => selectedIds.includes(l.id));

  // Filter out the __START__ trigger message
  const visibleMessages = messages.filter(m => !(m.role === 'user' && m.content === '__START__'));

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-24 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <MarcAvatar size="lg" />
          <div>
            <p className="font-clash font-semibold text-[#0F172A] text-lg leading-none">MARC</p>
            <p className="text-gray-400 text-xs mt-0.5">Market Rise Consultant · OOH Specialist</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-400 text-xs">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 mb-4 min-h-0 overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          {visibleMessages.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" />
            </div>
          )}
          <AnimatePresence initial={false}>
            {visibleMessages.map((msg, i) => (
              <MarcMessageBubble key={i} message={msg} />
            ))}
          </AnimatePresence>

          {/* Streaming indicator */}
          {sending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <MarcAvatar size="sm" />
              <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Location results */}
        <AnimatePresence>
          {showResults && suggestedLocations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[#0F172A] text-sm font-semibold">{suggestedLocations.length} locaties gevonden</p>
                <button onClick={() => setShowResults(false)} className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Verbergen</button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {suggestedLocations.map(loc => {
                  const isSelected = selectedIds.includes(loc.id);
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedIds(prev =>
                        prev.includes(loc.id) ? prev.filter(x => x !== loc.id) : [...prev, loc.id]
                      )}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-[#FFD700]/5' : ''}`}
                    >
                      {isSelected
                        ? <CheckSquare className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                        : <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0F172A] text-sm font-medium truncate">{loc.adres}</p>
                        <p className="text-gray-400 text-xs">{loc.post_code}{loc.stad ? ` — ${loc.stad}` : ''}</p>
                      </div>
                      <span className="text-[#0F172A] font-bold text-xs flex-shrink-0">€418/wk</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="bg-white border border-gray-200 rounded-2xl flex items-end gap-3 px-4 py-3 shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Schrijf uw bericht..."
            rows={1}
            className="flex-1 bg-transparent text-[#0F172A] placeholder:text-gray-400 text-sm resize-none focus:outline-none leading-relaxed max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-9 h-9 rounded-xl bg-[#FFD700] flex items-center justify-center flex-shrink-0 hover:scale-[1.05] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-[#0F172A]" />
          </button>
        </div>

        <p className="text-center text-gray-400 text-[10px] mt-3">
          MARC is een AI-consultant — altijd een menselijk adviseur raadplegen voor definitieve beslissingen
        </p>
      </div>

      {/* Floating claim button */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400]"
          >
            <button
              onClick={() => setShowClaim(true)}
              className="flex items-center gap-3 bg-[#FFD700] text-[#0F172A] px-8 py-4 rounded-full font-bold text-base shadow-[0_8px_30px_rgba(255,215,0,0.5)] hover:scale-[1.03] transition-all"
            >
              <CheckSquare className="w-5 h-5" />
              Claim {selectedIds.length} {selectedIds.length === 1 ? 'locatie' : 'locaties'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <NewClaimModal
        open={showClaim}
        onClose={() => setShowClaim(false)}
        selectedLocations={selectedLocations}
      />
    </div>
  );
}
