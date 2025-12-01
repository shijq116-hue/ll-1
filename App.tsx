import React, { useState, useEffect } from 'react';
import { AppView, IPASymbol, RecorderState, ChatMessage } from './types';
import { IPA_DATA, SENTENCE_DRILLS } from './constants';
import IPADetail from './components/IPADetail';
import RhythmVisualizer from './components/RhythmVisualizer';
import MicrophoneInput from './components/MicrophoneInput';
import { chatWithCoach } from './services/geminiService';
import { 
  BookOpen, 
  Mic2, 
  MessageCircle, 
  User, 
  ChevronRight, 
  Play, 
  Menu,
  Sparkles,
  Send,
  Zap
} from 'lucide-react';

// Subcomponents for cleaner App.tsx
const Navigation = ({ currentView, setView }: { currentView: AppView, setView: (v: AppView) => void }) => (
  <nav className="fixed bottom-0 md:bottom-auto md:top-0 w-full md:w-20 md:h-screen bg-white md:border-r border-t md:border-t-0 border-gray-200 z-40 flex md:flex-col justify-around md:justify-start items-center py-2 md:py-6 md:gap-8 shadow-lg md:shadow-none">
    <div className="hidden md:flex bg-indigo-600 w-10 h-10 rounded-xl items-center justify-center text-white font-bold mb-4">P</div>
    
    <NavBtn 
      active={currentView === AppView.HOME} 
      onClick={() => setView(AppView.HOME)} 
      icon={<BookOpen size={24} />} 
      label="Study" 
    />
    <NavBtn 
      active={currentView === AppView.IPA_CHART} 
      onClick={() => setView(AppView.IPA_CHART)} 
      icon={<Zap size={24} />} 
      label="IPA" 
    />
    <NavBtn 
      active={currentView === AppView.RHYTHM_LAB} 
      onClick={() => setView(AppView.RHYTHM_LAB)} 
      icon={<Mic2 size={24} />} 
      label="Lab" 
    />
    <NavBtn 
      active={currentView === AppView.AI_COACH} 
      onClick={() => setView(AppView.AI_COACH)} 
      icon={<MessageCircle size={24} />} 
      label="Coach" 
    />
  </nav>
);

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${active ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedIPASymbol, setSelectedIPASymbol] = useState<IPASymbol | null>(null);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hi! I'm Echo. Ready to practice? Tell me about your day or ask about a pronunciation problem." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Home View
  const HomeView = () => (
    <div className="p-6 pb-24 md:pl-28 max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <header className="flex justify-between items-center">
         <div>
           <h1 className="text-3xl font-bold text-gray-900">Hello, Learner</h1>
           <p className="text-gray-500">Ready to sound more native?</p>
         </div>
         <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
           <Sparkles size={24} />
         </div>
      </header>

      {/* Daily Challenge Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3 backdrop-blur-sm">Daily Focus</div>
          <h2 className="text-2xl font-bold mb-2">Mastering the "Schwa" /ə/</h2>
          <p className="text-indigo-100 mb-6 max-w-md">The most important sound in English. Learn to relax your mouth to sound fluent.</p>
          <button onClick={() => setCurrentView(AppView.IPA_CHART)} className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition">Start Drill</button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <Mic2 size={200} />
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-4">
         <div 
            onClick={() => setCurrentView(AppView.RHYTHM_LAB)}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-gray-800">Rhythm Trainer</h3>
            <p className="text-xs text-gray-500 mt-1">Stop sounding like a robot.</p>
         </div>
         <div 
            onClick={() => setCurrentView(AppView.AI_COACH)}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition">
              <MessageCircle size={20} />
            </div>
            <h3 className="font-bold text-gray-800">Live Chat</h3>
            <p className="text-xs text-gray-500 mt-1">Real-time correction.</p>
         </div>
      </div>

      {/* Recent Drills */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Drills</h3>
        <div className="space-y-3">
          {SENTENCE_DRILLS.map((drill, idx) => (
             <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                   <p className="font-medium text-gray-800">"{drill.text}"</p>
                   <p className="text-xs text-indigo-500 font-medium mt-1">{drill.focus}</p>
                </div>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-indigo-600 hover:text-white transition">
                  <Play size={16} fill="currentColor" />
                </button>
             </div>
          ))}
        </div>
      </div>
    </div>
  );

  // IPA View
  const IPAChartView = () => (
    <div className="p-6 pb-24 md:pl-28 max-w-5xl mx-auto animate-in fade-in">
      <h2 className="text-2xl font-bold mb-6">Phonetic Chart (IPA)</h2>
      
      <div className="mb-8">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Vowels (Monophthongs)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
           {IPA_DATA.filter(i => i.category === 'monophthong').map(s => (
             <button 
               key={s.symbol}
               onClick={() => setSelectedIPASymbol(s)}
               className="aspect-square bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center gap-1"
             >
               <span className="text-2xl font-serif font-medium text-gray-800">{s.symbol}</span>
               <span className="text-[10px] text-gray-400">{s.example}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Diphthongs (Gliding Vowels)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
           {IPA_DATA.filter(i => i.category === 'diphthong').map(s => (
             <button 
               key={s.symbol}
               onClick={() => setSelectedIPASymbol(s)}
               className="aspect-square bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center justify-center gap-1"
             >
               <span className="text-2xl font-serif font-medium text-gray-800">{s.symbol}</span>
               <span className="text-[10px] text-gray-400">{s.example}</span>
             </button>
           ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Consonants (Difficult for Chinese Speakers)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
           {IPA_DATA.filter(i => i.category === 'consonant').map(s => (
             <button 
               key={s.symbol}
               onClick={() => setSelectedIPASymbol(s)}
               className="aspect-square bg-white rounded-xl shadow-sm border-l-4 border-l-orange-400 border-slate-200 hover:shadow-md transition flex flex-col items-center justify-center gap-1"
             >
               <span className="text-2xl font-serif font-medium text-gray-800">{s.symbol}</span>
               <span className="text-[10px] text-gray-400">{s.example}</span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );

  // Rhythm Lab View
  const LabView = () => (
    <div className="p-6 pb-24 md:pl-28 max-w-4xl mx-auto animate-in fade-in space-y-8">
       <header>
           <h2 className="text-2xl font-bold mb-2">Rhythm Lab</h2>
           <p className="text-gray-500">Practice the "music" of English.</p>
       </header>

       <RhythmVisualizer />

       <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Shadowing Practice</h3>
          <div className="p-4 bg-slate-50 rounded-lg mb-6">
            <p className="text-xl font-serif text-gray-700 leading-relaxed">
              "I'd <strong className="text-indigo-600">like</strong> a <strong className="text-indigo-600">cup</strong> of <strong className="text-indigo-600">tea</strong>."
            </p>
            <div className="mt-2 text-sm text-gray-400 flex gap-4">
               <span>🔴 Stressed</span>
               <span className="opacity-50">⚪ Unstressed</span>
            </div>
          </div>
          
          <div className="flex justify-center">
             <MicrophoneInput 
               state={RecorderState.IDLE} 
               onStop={() => alert("Analysis feature connected in full version")} 
               label="Record Shadowing"
             />
          </div>
       </div>
    </div>
  );

  // AI Coach View
  const CoachView = () => {
    const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [chatHistory]);

    const handleSend = async () => {
      if (!chatInput.trim()) return;
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput };
      setChatHistory(prev => [...prev, userMsg]);
      setChatInput('');
      setIsChatLoading(true);

      try {
        const response = await chatWithCoach(chatHistory, userMsg.text);
        setChatHistory(prev => [...prev, response]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsChatLoading(false);
      }
    };

    const handleAudioSend = async (blob: Blob) => {
       const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: '(Voice Message)' };
       setChatHistory(prev => [...prev, userMsg]);
       setIsChatLoading(true);

       try {
         const response = await chatWithCoach(chatHistory, "Please analyze my audio message.", blob);
         setChatHistory(prev => [...prev, response]);
       } catch (e) {
         console.error(e);
       } finally {
         setIsChatLoading(false);
       }
    };

    return (
      <div className="flex flex-col h-[100dvh] md:h-screen md:pl-20 bg-slate-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 shadow-sm z-10">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Echo Coach</h2>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-500">Online | Corrects Grammar & Tone</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {chatHistory.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`
                 max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed
                 ${msg.role === 'user' 
                   ? 'bg-indigo-600 text-white rounded-br-none' 
                   : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}
               `}>
                 {msg.text}
               </div>
             </div>
           ))}
           {isChatLoading && (
             <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 pb-6 md:pb-4">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
             <div className="pb-1">
                <MicrophoneInput 
                  state={RecorderState.IDLE} 
                  onStop={handleAudioSend} 
                  className="scale-75 origin-bottom" 
                  label=""
                />
             </div>
             <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2 border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition">
               <input 
                 type="text" 
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Type or record..."
                 className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
               />
             </div>
             <button 
               onClick={handleSend}
               disabled={!chatInput.trim() || isChatLoading}
               className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
             >
               <Send size={20} />
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="w-full h-full">
        {currentView === AppView.HOME && <HomeView />}
        {currentView === AppView.IPA_CHART && <IPAChartView />}
        {currentView === AppView.RHYTHM_LAB && <LabView />}
        {currentView === AppView.AI_COACH && <CoachView />}
      </main>

      {/* Overlays */}
      {selectedIPASymbol && (
        <IPADetail symbol={selectedIPASymbol} onClose={() => setSelectedIPASymbol(null)} />
      )}
    </div>
  );
};

export default App;
