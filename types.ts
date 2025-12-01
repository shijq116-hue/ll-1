export enum AppView {
  HOME = 'HOME',
  IPA_CHART = 'IPA_CHART',
  RHYTHM_LAB = 'RHYTHM_LAB',
  AI_COACH = 'AI_COACH',
  PROFILE = 'PROFILE'
}

export interface IPASymbol {
  symbol: string;
  example: string;
  category: 'monophthong' | 'diphthong' | 'consonant';
  voice: 'voiced' | 'unvoiced' | 'mixed'; // For consonants/vowels
  description: string; // Chinese description
  tip: string; // Specific tip for Chinese speakers
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioUrl?: string; // If we playback audio
  feedback?: PronunciationFeedback;
}

export interface PronunciationFeedback {
  score: number;
  transcription: string;
  issues: string[]; // e.g. "Missing tail consonant", "Tone interference"
  suggestions: string[];
}

export enum RecorderState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
}
