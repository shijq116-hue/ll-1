import { IPASymbol } from './types';

export const IPA_DATA: IPASymbol[] = [
  // Monophthongs (Vowels)
  { symbol: 'iː', example: 'see', category: 'monophthong', voice: 'voiced', description: '长衣音，嘴角向两侧拉开', tip: '比中文的“一”更长、更紧' },
  { symbol: 'ɪ', example: 'sit', category: 'monophthong', voice: 'voiced', description: '短衣音，腹部放松', tip: '不要发成“一”，口型微张' },
  { symbol: 'æ', example: 'cat', category: 'monophthong', voice: 'voiced', description: '梅花音，下巴向下', tip: '嘴张大，舌尖抵下齿' },
  { symbol: 'ɑː', example: 'father', category: 'monophthong', voice: 'voiced', description: '长阿音，口腔打开', tip: '像看医生检查喉咙' },
  { symbol: 'ə', example: 'about', category: 'monophthong', voice: 'voiced', description: '中央元音 (Schwa)', tip: '最放松的音，非常短轻' },
  
  // Diphthongs
  { symbol: 'eɪ', example: 'say', category: 'diphthong', voice: 'voiced', description: '双元音 A', tip: '滑动要明显，不可读成单纯的“诶”' },
  { symbol: 'aɪ', example: 'my', category: 'diphthong', voice: 'voiced', description: '双元音 I', tip: '口型由大变小，滑动完整' },

  // Consonants (Specific Challenges)
  { symbol: 'θ', example: 'think', category: 'consonant', voice: 'unvoiced', description: '咬舌音 (轻)', tip: '务必伸出舌尖，不要发成 s 或 f' },
  { symbol: 'ð', example: 'this', category: 'consonant', voice: 'voiced', description: '咬舌音 (浊)', tip: '舌尖伸出震动，不要发成 z 或 d' },
  { symbol: 'v', example: 'very', category: 'consonant', voice: 'voiced', description: '唇齿音', tip: '上齿轻咬下唇，区别于 w' },
  { symbol: 'r', example: 'red', category: 'consonant', voice: 'voiced', description: '卷舌音', tip: '舌尖卷起不接触上颚，区别于 l' },
  { symbol: 'l', example: 'light/ball', category: 'consonant', voice: 'voiced', description: '边音 (Light/Dark)', tip: '词尾Dark L舌根抬起，不要加元音' },
];

export const SENTENCE_DRILLS = [
  { text: "I'd like a cup of tea.", focus: "Linking & Weak forms" },
  { text: "What are you doing?", focus: "Intonation & Reduction" },
  { text: "Thirty-three thousand thoughts.", focus: "The 'th' Sound" },
  { text: "She sells sea shells by the sea shore.", focus: "s vs ʃ Distinction" },
];
