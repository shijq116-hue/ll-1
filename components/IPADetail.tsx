import React, { useState } from 'react';
import { IPASymbol, RecorderState, PronunciationFeedback } from '../types';
import MicrophoneInput from './MicrophoneInput';
import { X, CheckCircle, AlertCircle, Volume2 } from 'lucide-react';
import { analyzePronunciation } from '../services/geminiService';

interface IPADetailProps {
  symbol: IPASymbol;
  onClose: () => void;
}

const IPADetail: React.FC<IPADetailProps> = ({ symbol, onClose }) => {
  const [recorderState, setRecorderState] = useState<RecorderState>(RecorderState.IDLE);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);

  const handleRecording = async (blob: Blob) => {
    setRecorderState(RecorderState.PROCESSING);
    // Send to Gemini
    const result = await analyzePronunciation(blob, symbol.example);
    setFeedback(result);
    setRecorderState(RecorderState.IDLE);
  };

  // Placeholder for simple TTS if no file provided
  const playSample = () => {
    const utterance = new SpeechSynthesisUtterance(symbol.example);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-start">
          <div>
            <h2 className="text-5xl font-bold font-serif mb-2">{symbol.symbol}</h2>
            <p className="text-indigo-100 text-lg opacity-90">{symbol.description}</p>
          </div>
          <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-1">
          
          {/* Tip Section */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
            <p className="text-amber-800 font-medium text-sm uppercase tracking-wide mb-1">Coach Tip</p>
            <p className="text-gray-700">{symbol.tip}</p>
          </div>

          {/* Mouth Diagram Placeholder */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
             <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                {/* SVG for simplified Mouth Diagram could go here */}
                <span className="text-4xl text-slate-400">👄</span>
             </div>
             <p className="text-xs text-center text-slate-500">
                {symbol.category === 'consonant' 
                  ? (symbol.voice === 'voiced' ? 'Voiced (震动声带)' : 'Unvoiced (只送气)') 
                  : 'Maintain steady tongue position'}
             </p>
          </div>

          {/* Practice Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-gray-500 mb-2 text-sm">Example Word</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-800">{symbol.example}</span>
                <button 
                  onClick={playSample}
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            <MicrophoneInput 
              onStop={handleRecording} 
              state={recorderState} 
              label={`Read "${symbol.example}"`}
            />

            {/* Feedback Display */}
            {feedback && (
              <div className={`w-full p-4 rounded-xl border ${feedback.score > 70 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-in slide-in-from-bottom-2`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg text-gray-800">Score: {feedback.score}</span>
                  {feedback.score > 70 ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />}
                </div>
                <div className="space-y-2">
                   {feedback.suggestions.map((s, i) => (
                     <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                       <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                       {s}
                     </p>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPADetail;
