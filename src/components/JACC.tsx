import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, AlertTriangle, Mic, MicOff, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { useAIAgent } from '../hooks/useAIAgent';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export default function JACC() {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    sendMessage, 
    isLoading, 
    error, 
    isConfigured,
    needsIndexing,
    lastIndexed,
    triggerDriveIndexing
  } = useAIAgent();
  
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  const {
    speak,
    cancel,
    speaking,
    supported: speechSynthesisSupported
  } = useSpeechSynthesis();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update input field with transcript when speech recognition is active
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isConfigured) return;

    // If we're listening, stop listening
    if (isListening) {
      stopListening();
      resetTranscript();
    }

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage(input.trim());
      
      if (response) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: response,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Speak the response if speech synthesis is supported and not muted
        if (speechSynthesisSupported && !isMuted) {
          speak(response);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      
      // If there's a transcript, submit it
      if (transcript) {
        setInput(transcript);
        // Use setTimeout to ensure the input state is updated before submitting
        setTimeout(() => {
          handleSubmit({ preventDefault: () => {} } as React.FormEvent);
        }, 100);
      }
    } else {
      startListening();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (speaking) {
      cancel();
    }
  };

  const handleIndexDocuments = async () => {
    const success = await triggerDriveIndexing();
    if (success) {
      const systemMessage = {
        role: 'assistant' as const,
        content: "I've started indexing the latest documents from Google Drive. This process will run in the background and may take a few minutes to complete. You can continue using me while this happens.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 p-4 bg-zinc-900 rounded-full shadow-xl border border-yellow-400/20 text-yellow-400 hover:bg-zinc-800 transition-colors duration-200"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-zinc-900 rounded-lg shadow-xl border border-yellow-400/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-yellow-400/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-yellow-400" />
          <div>
            <h3 className="font-semibold text-white">JACC</h3>
            <p className="text-xs text-yellow-400/60">Your ISO Documentation Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Configuration Warning */}
      {!isConfigured && (
        <div className="p-4 bg-yellow-400/10 border-b border-yellow-400/20">
          <div className="flex items-center space-x-2 text-yellow-400">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">AI API key is not configured. JACC is currently unavailable.</p>
          </div>
        </div>
      )}

      {/* Indexing Notification */}
      {needsIndexing && (
        <div className="p-4 bg-blue-400/10 border-b border-blue-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-400">
              <RefreshCw className="h-5 w-5" />
              <p className="text-sm">New documents may be available. Update knowledge base?</p>
            </div>
            <button 
              onClick={handleIndexDocuments}
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
          {lastIndexed && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastIndexed.toLocaleDateString()} {lastIndexed.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-4">
            <p>👋 Hi! I'm JACC, your ISO documentation assistant.</p>
            <p className="mt-2">Ask me anything about payment processing, gateways, or hardware!</p>
            {browserSupportsSpeechRecognition && (
              <p className="mt-2 text-yellow-400/60">
                You can also click the microphone icon to speak your questions.
              </p>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-yellow-400/10 text-white'
                    : 'bg-zinc-800 text-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {error && (
          <div className="text-center p-2 text-sm text-red-400 bg-red-400/10 rounded">
            {error}
          </div>
        )}
        {speechError && (
          <div className="text-center p-2 text-sm text-red-400 bg-red-400/10 rounded">
            {speechError}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-yellow-400/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isConfigured 
              ? isListening 
                ? "Listening..." 
                : "Ask about documentation, processors, or hardware..." 
              : "JACC is currently unavailable"}
            className="w-full bg-zinc-800 text-white rounded-lg pl-4 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            disabled={isLoading || !isConfigured}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {browserSupportsSpeechRecognition && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={!isConfigured}
                className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 p-1"
                title={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !isConfigured || (!input.trim() && !isListening)}
              className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 p-1"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}