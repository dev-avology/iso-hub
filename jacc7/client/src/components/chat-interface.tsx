import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessageContent } from "./message-content";
// Types for messages
interface MessageWithActions {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  chatId: string | null;
  onNewChatWithMessage?: (message: string) => Promise<void>;
  onChatUpdate: () => void;
  isDemo?: boolean;
}

export default function ChatInterface({
  chatId,
  onNewChatWithMessage,
  onChatUpdate,
  isDemo = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();



  // Optimized message fetching with intelligent caching
  const { data: messages = [], isLoading, error, refetch } = useQuery<MessageWithActions[]>({
    queryKey: [`/api/chats/${chatId}/messages`],
    enabled: !!chatId,
    staleTime: 10000, // Cache for 10 seconds - balance between freshness and performance
    gcTime: 120000, // Keep in cache for 2 minutes
    refetchOnMount: "always", // Always refetch when mounting to get latest data
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1, // Only retry once on failure
    queryFn: async () => {
      const startTime = performance.now();
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      const endTime = performance.now();
      
      // Only log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Messages fetched in ${Math.round(endTime - startTime)}ms:`, {
          count: Array.isArray(data) ? data.length : 0,
          chatId: chatId?.substring(0, 8)
        });
      }
      
      return Array.isArray(data) ? data : [];
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
          console.log('Voice recognition started');
          setIsRecording(true);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice transcript:', transcript);
          setInput(prev => prev + (prev ? ' ' : '') + transcript);
          setIsRecording(false);
          
          // Auto-submit if transcript ends with question mark or period
          if (transcript.trim().endsWith('?') || transcript.trim().endsWith('.')) {
            setTimeout(() => {
              if (transcript.trim()) {
                const form = document.querySelector('form') as HTMLFormElement;
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }
            }, 500);
          }
          
          toast({
            title: "Voice input captured",
            description: `Transcribed: "${transcript}"`,
          });
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          
          let errorMessage = "Please try again or type your message.";
          if (event.error === 'not-allowed') {
            errorMessage = "Please allow microphone access in your browser settings.";
          } else if (event.error === 'no-speech') {
            errorMessage = "No speech detected. Please speak clearly.";
          }
          
          toast({
            title: "Voice recognition error",
            description: errorMessage,
            variant: "destructive",
          });
        };
        
        recognition.onend = () => {
          console.log('Voice recognition ended');
          setIsRecording(false);
        };
        
        setRecognition(recognition);
      } else {
        console.log('Speech recognition not supported in this browser');
      }
    }
  }, [toast]);

  // Ensure messages is always an array to prevent crashes
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  // Optimized message validation - reduced logging for performance
  useEffect(() => {
    // Only log in development for debugging
    if (process.env.NODE_ENV === 'development' && chatId) {
      console.log(`💬 Chat ${chatId.substring(0, 8)}: ${safeMessages.length} messages, loading: ${isLoading}`);
    }
  }, [chatId, safeMessages.length, isLoading]);

  // High-performance send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!chatId) throw new Error("No active chat");
      
      setIsProcessing(true); // Start processing indicator
      
      const response = await fetch(`/api/chat/send`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        credentials: "include",
        body: JSON.stringify({
          message: content,
          chatId: chatId,
          timestamp: Date.now(),
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Send message failed:", errorText);
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    onSuccess: async (data, variables) => {
      // Optimistic update for instant UI response
      const userMessage = { 
        id: `temp-user-${Date.now()}`, 
        role: "user" as const, 
        content: variables,
        createdAt: new Date().toISOString()
      };
      const assistantMessage = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant" as const,
        content: data.response || data.message || "Response received",
        createdAt: new Date().toISOString()
      };
      
      // Update cache immediately with new messages
      queryClient.setQueryData([`/api/chats/${chatId}/messages`], (oldData: any) => {
        const currentMessages = Array.isArray(oldData) ? oldData : [];
        return [...currentMessages, userMessage, assistantMessage];
      });
      
      // Background refresh to sync with server - delayed to prevent race conditions
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [`/api/chats/${chatId}/messages`] });
        queryClient.refetchQueries({ queryKey: [`/api/chats/${chatId}/messages`] });
      }, 500);
      
      setIsProcessing(false); // Clear processing indicator
      onChatUpdate();
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      setIsProcessing(false); // Clear processing indicator on error
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending || isProcessing) return;

    const messageText = input.trim();
    setInput("");
    setIsProcessing(true); // Set processing state immediately
    
    try {
      // If no active chat, create a new chat first
      if (!chatId && onNewChatWithMessage) {
        await onNewChatWithMessage(messageText);
      } else if (chatId) {
        await sendMessageMutation.mutateAsync(messageText);
      } else {
        throw new Error("No active chat and cannot create new chat");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsProcessing(false); // Clear processing on error
      // Restore the input text if message failed
      setInput(messageText);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleVoiceRecording = () => {
    if (!recognition) {
      toast({
        title: "Voice recognition not available",
        description: "Your browser doesn't support voice recognition or microphone access is denied.",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        toast({
          title: "Voice recognition error",
          description: "Failed to start voice recording. Please check microphone permissions.",
          variant: "destructive",
        });
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Render content based on chat state - moved after all hooks to avoid conditional hook calls
  const renderContent = () => {
    // Welcome screen with conversation starters when no chat is selected
    if (!chatId) {
      return (
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
            <div className="max-w-4xl w-full mx-auto text-center space-y-8 sm:space-y-12">
              {/* Welcome Header */}
            <div className="space-y-4 sm:space-y-6 px-2">
              <div className="flex items-center justify-center">
                <img 
                  src="/jacc-logo.jpg" 
                  alt="JACC" 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg" 
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome to JACC
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                Your AI-powered assistant for merchant services. Get instant help with processing rates, 
                competitive analysis, and business insights.
              </p>
            </div>

          {/* Conversation Starters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-2 sm:px-4">
            <button
              onClick={() => onNewChatWithMessage?.("I need help calculating processing rates and finding competitive pricing")}
              className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl transition-all text-left group w-full"
            >
              <div className="flex items-start space-x-3 sm:space-x-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <span className="text-blue-600 dark:text-blue-400 text-base sm:text-lg font-semibold">%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Calculate Processing Rates</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Get competitive rate analysis and pricing comparisons</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onNewChatWithMessage?.("I need to compare payment processors - can you help me analyze different options?")}
              className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl hover:border-green-300 dark:hover:border-green-500 hover:shadow-xl transition-all text-left group w-full"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <span className="text-green-600 dark:text-green-400 text-base sm:text-lg font-semibold">⚖️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Compare Processors</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Analyze different payment processing options and features</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onNewChatWithMessage?.("I need market intelligence for a prospect - help me research their geographic area, industry niche, and competitive landscape")}
              className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-xl transition-all text-left group w-full"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <span className="text-purple-600 dark:text-purple-400 text-base sm:text-lg font-semibold">📊</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Market Intelligence</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Research geographic area, industry niche, and competitive insights</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onNewChatWithMessage?.("I need to create a proposal for a potential client")}
              className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-xl transition-all text-left group w-full"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                  <span className="text-orange-600 dark:text-orange-400 text-base sm:text-lg font-semibold">📄</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Create Proposal</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Generate customized proposals and client presentations</p>
                </div>
              </div>
            </button>
          </div>

            {/* Quick Start Tips */}
            <div className="text-lg text-muted-foreground space-y-3">
              <p>💡 <strong>Tip:</strong> You can also type any question directly to get started</p>
              <p>🔍 JACC searches FAQ knowledge base first, then documents, then the web for the most accurate answers</p>
            </div>

            {/* Chat Input */}
            <div className="max-w-4xl mx-auto w-full">
              <div className="chat-glow-container">
                <form onSubmit={handleSubmit} className="flex items-end gap-2 md:gap-2">
                  <div className="flex-1" style={{ width: '90%' }}>
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about processing rates, compare processors..."
                      className="min-h-[60px] max-h-32 resize-none text-lg w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0" style={{ width: '10%' }}>
                    <Button
                      type="button"
                      size="icon"
                      onClick={toggleVoiceRecording}
                      disabled={!recognition}
                      className={`h-8 w-full md:h-[30px] md:w-[60px] p-0 rounded-lg transition-all ${
                        isRecording
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="h-3 w-3 md:h-4 md:w-4" />
                      ) : (
                        <Mic className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || sendMessageMutation.isPending}
                      className="bg-blue-700 hover:bg-blue-800 h-8 w-full md:h-[30px] md:w-[60px] p-0 rounded-lg"
                    >
                      {sendMessageMutation.isPending ? (
                        <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }

    // Remove duplicate loading state - now handled inline

    // Error state
    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading messages: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    // Chat interface when a chat is selected
    return (
    <div className="flex-1 flex flex-col h-full w-full max-w-full overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(isLoading || sendMessageMutation.isPending || isProcessing) ? (
          // Animated working indicator with gear
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Working on it...</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Searching knowledge base and generating response
              </p>
            </div>
          </div>
        ) : safeMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {safeMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <MessageContent content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Show working indicator while sending message */}
            {(sendMessageMutation.isPending || isProcessing) && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <div className="inline-flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Working on it...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input area */}
      <div className="border-t bg-white dark:bg-gray-800 p-4 pb-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 md:gap-2">
          <div className="flex-1" style={{ width: '90%' }}>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about processing rates, compare processors..."
              className="min-h-[60px] max-h-32 resize-none text-lg w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0" style={{ width: '10%' }}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleVoiceRecording}
              className={`h-8 w-full md:h-10 md:w-full p-0 rounded-lg transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
              }`}
              disabled={!recognition}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              {isRecording ? <MicOff className="w-3 h-3 md:w-4 md:h-4" /> : <Mic className="w-3 h-3 md:w-4 md:h-4" />}
            </Button>
            
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending || !input.trim()}
              className="bg-blue-700 hover:bg-blue-800 h-8 w-full md:h-10 md:w-full p-0 rounded-lg"
            >
              {sendMessageMutation.isPending ? (
                <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
    );
  };

  // Return the rendered content
  return renderContent();
}