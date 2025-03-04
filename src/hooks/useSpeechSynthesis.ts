import { useState, useEffect } from 'react';

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true);

      // Get the list of voices
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };

      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices();

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = (text: string, voiceIndex = 0, rate = 1, pitch = 1) => {
    if (!supported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if available
    if (voices.length > 0) {
      utterance.voice = voices[voiceIndex % voices.length];
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices
  };
}