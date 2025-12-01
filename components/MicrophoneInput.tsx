import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { RecorderState } from '../types';

interface MicrophoneInputProps {
  onStop: (blob: Blob) => void;
  state: RecorderState;
  className?: string;
  label?: string;
}

const MicrophoneInput: React.FC<MicrophoneInputProps> = ({ onStop, state, className = "", label = "Hold to Speak" }) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        onStop(blob);
        stream.getTracks().forEach(track => track.stop()); // Stop mic usage
      };

      recorder.start();
      setMediaRecorder(recorder);
      setDuration(0);
      timerRef.current = window.setInterval(() => {
        setDuration(d => d + 0.1);
      }, 100);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      if (timerRef.current) window.clearInterval(timerRef.current);
      setMediaRecorder(null);
    }
  };

  // Toggle behavior
  const handleToggle = () => {
    if (state === RecorderState.RECORDING) {
      stopRecording();
    } else if (state === RecorderState.IDLE) {
      startRecording();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={handleToggle}
        disabled={state === RecorderState.PROCESSING}
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
          ${state === RecorderState.IDLE ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
          ${state === RecorderState.RECORDING ? 'bg-red-500 animate-pulse text-white' : ''}
          ${state === RecorderState.PROCESSING ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}
        `}
      >
        {state === RecorderState.IDLE && <Mic size={28} />}
        {state === RecorderState.RECORDING && <Square size={24} fill="currentColor" />}
        {state === RecorderState.PROCESSING && <Loader2 size={28} className="animate-spin" />}
        
        {/* Ripple effect when recording */}
        {state === RecorderState.RECORDING && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
        )}
      </button>
      <span className="text-sm font-medium text-gray-500">
        {state === RecorderState.RECORDING 
          ? `${duration.toFixed(1)}s` 
          : state === RecorderState.PROCESSING 
            ? "Analyzing..." 
            : label}
      </span>
    </div>
  );
};

export default MicrophoneInput;
