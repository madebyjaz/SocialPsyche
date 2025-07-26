import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Bot, User, Sparkles, RotateCcw, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdviceScreenProps {
  setCurrentScreen: (screen: string) => void;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatSession {
  messages: ChatMessage[];
  source: 'ai' | 'human';
  name: string;
  isTyping: boolean;
}

export function AdviceScreen({ setCurrentScreen }: AdviceScreenProps) {
  const [chatA, setChatA] = useState<ChatSession>({
    messages: [
      {
        id: '1',
        content: "Hi! I saw your reflection about social interactions. Your thoughtful approach to connections is really admirable. Have you considered that your reflective nature might actually be a superpower in social situations? I'd love to help you explore some strategies that honor your authentic style.",
        isUser: false,
        timestamp: new Date().toISOString()
      }
    ],
    source: 'human',
    name: 'Advisor A',
    isTyping: false
  });

  const [chatB, setChatB] = useState<ChatSession>({
    messages: [
      {
        id: '1',
        content: "Based on your personality assessment and journal entry, I can provide personalized social strategies. Your Social Introvert type suggests you process interactions deeply. Consider implementing a 'social energy budget' - allocating specific amounts of energy to different interaction types while reserving some for meaningful connections.",
        isUser: false,
        timestamp: new Date().toISOString()
      }
    ],
    source: 'ai',
    name: 'Advisor B',
    isTyping: false
  });

  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [guesses, setGuesses] = useState<{ A: 'ai' | 'human' | null, B: 'ai' | 'human' | null }>({
    A: null,
    B: null
  });
  const [showResults, setShowResults] = useState(false);

  // Refs for maintaining focus
  const textareaARef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>;
  const textareaBRef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>;
  const chatARef = useRef<HTMLDivElement>(null);
  const chatBRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatARef.current) {
      chatARef.current.scrollTop = chatARef.current.scrollHeight;
    }
  }, [chatA.messages]);

  useEffect(() => {
    if (chatBRef.current) {
      chatBRef.current.scrollTop = chatBRef.current.scrollHeight;
    }
  }, [chatB.messages]);

  const sendMessageA = () => {
    if (!inputA.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputA.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setChatA(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    setInputA('');
    
    // Keep focus on textarea
    setTimeout(() => {
      textareaARef.current?.focus();
    }, 100);

    // Simulate human response with typing delay
    setTimeout(() => {
      const responses = [
        "That's such a thoughtful perspective! I can really relate to feeling that way sometimes. What I've found helpful is giving yourself permission to take breaks during social events.",
        "I hear you on that. It sounds like you're being really hard on yourself. From my experience, most people appreciate authenticity over trying to be 'on' all the time.",
        "You know, I used to struggle with similar feelings. What helped me was starting small - maybe just one meaningful conversation instead of trying to connect with everyone.",
        "That makes total sense given your personality type. Have you tried approaching it from a different angle, like finding one person who seems approachable and starting there?"
      ];
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setChatA(prev => ({
        ...prev,
        messages: [...prev.messages, response],
        isTyping: false
      }));
    }, 2000);
  };

  const sendMessageB = () => {
    if (!inputB.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputB.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setChatB(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    setInputB('');
    
    // Keep focus on textarea
    setTimeout(() => {
      textareaBRef.current?.focus();
    }, 100);

    // Simulate AI response with typing delay
    setTimeout(() => {
      const responses = [
        "Based on your input, I recommend implementing structured social interaction techniques that align with your introversion patterns. Try the 'quality over quantity' approach with a maximum of 2-3 meaningful interactions per event.",
        "Analysis suggests this relates to energy management optimization for your personality type. Research shows that individuals with your profile benefit from pre-event mental preparation and post-event recovery time.",
        "Your response indicates a need for customized social frameworks. Consider implementing the 'social stamina system' - rating your energy from 1-10 before events to set appropriate expectations.",
        "Processing your feedback through social psychology models, I suggest focusing on systematic approaches to social situations, such as preparing 3-5 conversation topics in advance."
      ];
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setChatB(prev => ({
        ...prev,
        messages: [...prev.messages, response],
        isTyping: false
      }));
    }, 1500);
  };

  const handleGuess = (advisor: 'A' | 'B', guess: 'ai' | 'human') => {
    setGuesses(prev => ({ ...prev, [advisor]: guess }));
  };

  const revealResults = () => {
    setShowResults(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent, sendFunction: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendFunction();
    }
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 p-3 bg-[#EACBD2]/40 rounded-2xl mr-4 max-w-[80%]"
    >
      <div className="flex gap-1">
        <motion.div
          className="w-2 h-2 bg-[#82667F]/60 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-[#82667F]/60 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-[#82667F]/60 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-xs text-[#82667F]/60 font-medium">thinking...</span>
    </motion.div>
  );

  const ChatPanel = ({ 
    chat, 
    input, 
    setInput, 
    sendMessage, 
    advisor,
    textareaRef,
    chatRef 
  }: { 
    chat: ChatSession, 
    input: string, 
    setInput: (value: string) => void, 
    sendMessage: () => void,
    advisor: 'A' | 'B',
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    chatRef: React.RefObject<HTMLDivElement>
  }) => (
    <div className="bg-[#EACBD2]/50 backdrop-blur-md rounded-2xl border border-[#DFAEB4]/40 shadow-lg flex flex-col h-80">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#DFAEB4]/30">
        <div className="flex items-center justify-between">
          <h3 className="text-[#82667F] font-medium">{chat.name}</h3>
          {!showResults && (
            <div className="flex gap-1">
              <button
                onClick={() => handleGuess(advisor, 'ai')}
                className={`p-2 rounded-lg border transition-all ${
                  guesses[advisor] === 'ai'
                    ? 'bg-[#DD9AC2]/30 border-[#B486AB]/40'
                    : 'bg-[#EACBD2]/30 border-[#DFAEB4]/30'
                }`}
              >
                <Bot className="w-4 h-4 text-[#82667F]" />
              </button>
              <button
                onClick={() => handleGuess(advisor, 'human')}
                className={`p-2 rounded-lg border transition-all ${
                  guesses[advisor] === 'human'
                    ? 'bg-[#DD9AC2]/30 border-[#B486AB]/40'
                    : 'bg-[#EACBD2]/30 border-[#DFAEB4]/30'
                }`}
              >
                <User className="w-4 h-4 text-[#82667F]" />
              </button>
            </div>
          )}
          {showResults && (
            <div className="flex items-center gap-2">
              {chat.source === 'ai' ? (
                <Bot className="w-5 h-5 text-[#DD9AC2]" />
              ) : (
                <User className="w-5 h-5 text-[#B486AB]" />
              )}
              <span className="text-xs text-[#82667F]/80 font-medium">
                {chat.source === 'ai' ? 'AI' : 'Human'}
              </span>
              {guesses[advisor] === chat.source && (
                <Badge className="bg-[#B486AB]/20 text-[#82667F] border-[#B486AB]/30 text-xs">
                  Correct!
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto scroll-smooth"
      >
        <AnimatePresence>
          {chat.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={message.isUser ? { 
                opacity: 0, 
                x: 20, 
                scale: 0.95 
              } : { 
                opacity: 0, 
                y: 10 
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: 0, 
                scale: 1 
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeOut",
                delay: message.isUser ? 0 : 0.1
              }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed break-words ${
                  message.isUser
                    ? 'bg-[#DD9AC2]/30 text-[#82667F] ml-4'
                    : 'bg-[#EACBD2]/40 text-[#82667F]/90 mr-4'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          {chat.isTyping && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Input Area */}
      <div className="p-4 border-t border-[#DFAEB4]/30">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, sendMessage)}
              placeholder="Type your response... (Press Enter to send, Shift+Enter for new line)"
              className="bg-[#EACBD2]/40 border-[#DFAEB4]/40 text-[#82667F] placeholder:text-[#82667F]/50 rounded-xl resize-none min-h-[44px] max-h-[120px] text-sm leading-relaxed focus:bg-[#EACBD2]/60 focus:border-[#B486AB]/40 transition-all duration-200 pr-12"
              rows={1}
              maxLength={500}
              style={{
                height: 'auto',
                minHeight: '44px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            {/* Character count overlay */}
            <div className="absolute bottom-2 right-2 text-xs text-[#82667F]/40 pointer-events-none">
              {input.length}/500
            </div>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || chat.isTyping}
            size="sm"
            className="bg-[#B486AB]/80 hover:bg-[#82667F] text-white border-0 rounded-xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('journal')}
          className="text-[#82667F] hover:text-[#B486AB] hover:bg-[#EACBD2]/50 rounded-full p-2 border-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-[#82667F] text-center font-medium">Chat with Advisors</h2>
        <div className="w-9"></div>
      </div>

      {/* Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#EACBD2]/60 backdrop-blur-md rounded-2xl p-4 border border-[#DFAEB4]/40 shadow-lg mb-6"
      >
        <p className="text-[#82667F] text-sm text-center">
          {!showResults 
            ? "Chat with both advisors and guess who's AI vs Human!"
            : "Results revealed! See how you did with your guesses."
          }
        </p>
      </motion.div>

      {/* Chat Panels */}
      <div className="space-y-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ChatPanel
            chat={chatA}
            input={inputA}
            setInput={setInputA}
            sendMessage={sendMessageA}
            advisor="A"
            textareaRef={textareaARef}
            chatRef={chatARef}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChatPanel
            chat={chatB}
            input={inputB}
            setInput={setInputB}
            sendMessage={sendMessageB}
            advisor="B"
            textareaRef={textareaBRef}
            chatRef={chatBRef}
          />
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {!showResults && guesses.A && guesses.B && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Button
                onClick={revealResults}
                className="w-full bg-[#B486AB] hover:bg-[#82667F] text-white shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105 font-medium"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Reveal Who's Who
                </span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setCurrentScreen('quiz')}
            variant="outline"
            className="bg-[#DD9AC2]/20 hover:bg-[#DD9AC2]/40 text-[#82667F] border-[#B486AB]/30 hover:border-[#82667F]/40 rounded-2xl py-4 transition-all duration-200 hover:scale-105 font-medium"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </span>
          </Button>
          <Button
            onClick={() => setCurrentScreen('journal')}
            variant="outline"
            className="bg-[#EACBD2]/40 hover:bg-[#EACBD2]/60 text-[#82667F] border-[#DFAEB4]/40 hover:border-[#B486AB]/40 rounded-2xl py-4 transition-all duration-200 hover:scale-105 font-medium"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Return to Journal
            </span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}