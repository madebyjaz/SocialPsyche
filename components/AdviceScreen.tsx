import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  BookOpen,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PersonalityType, MBTIScores } from "../App";

interface AdviceScreenProps {
  setCurrentScreen: (screen: string) => void;
  personalityType: PersonalityType;
  mbtiScores: MBTIScores;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  advisor_type?: "ai" | "human";
}

interface ChatSession {
  messages: ChatMessage[];
  source: "ai" | "human";
  name: string;
  isTyping: boolean;
}

interface ApiChatMessage {
  id: string;
  content: string;
  is_user: boolean;
  timestamp: string;
  advisor_type?: "ai" | "human";
}

interface ChatResponse {
  message: ApiChatMessage;
  typing_delay: number;
  session_id: string;
}

interface GuessResult {
  correct_a: boolean;
  correct_b: boolean;
  actual_advisor_a: "ai" | "human";
  actual_advisor_b: "ai" | "human";
  score: number;
}

// API Configuration
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-api-domain.com"
    : "http://localhost:8000";

// Fallback responses for offline mode
const FALLBACK_RESPONSES = {
  human: {
    social_anxiety: [
      "I totally get that feeling! I used to feel the same way at social events. What helped me was giving myself permission to take breaks when I needed them.",
      "I can really relate to this! Social situations can feel so overwhelming sometimes. I've learned that it's okay to step outside for air or find a quiet corner to recharge.",
      "That sounds really challenging. I remember feeling like everyone could see right through me at parties. But honestly, most people are thinking about themselves, not judging us as much as we think.",
      "I hear you on that. It's tough when your mind starts spiraling about what others might think. Have you tried going with a friend who understands? That buddy system can make such a difference.",
    ],
    confidence: [
      "Building confidence is such a journey! I've found that celebrating small wins really helps. Like, if I managed to speak up in one conversation, that's worth acknowledging.",
      "I struggled with confidence for years too. What shifted things for me was realizing that 'fake it till you make it' actually works - our brains start believing the confident actions we take.",
      "This hits home for me. I used to think confident people never felt nervous, but that's not true! They just learned to act despite the nerves, and that's something we can all practice.",
      "I appreciate you sharing that with me. Your thoughtful approach to these challenges shows such self-awareness, which is honestly half the battle in personal growth.",
    ],
    general: [
      "That's such an insightful way to look at it! It sounds like you're really self-aware, which is honestly half the battle in personal growth.",
      "I appreciate you sharing that with me. It takes courage to be vulnerable about these things, and that courage itself is something to be proud of.",
      "Your perspective is really thoughtful. I think many people can relate to what you're going through, even if they don't always talk about it openly.",
      "Thanks for opening up about this. It's conversations like these that remind me how much we all have in common, even when we feel alone in our struggles.",
    ],
  },
  ai: {
    social_anxiety: [
      "Analysis indicates elevated social apprehension markers. Research shows systematic desensitization through graduated exposure reduces social anxiety by 73% in controlled studies.",
      "Your response suggests activation of the sympathetic nervous system during social encounters. I recommend implementing the 4-7-8 breathing technique to regulate physiological responses.",
      "Processing your social interaction data through validated psychological frameworks. Consider implementing structured social scripts and pre-planned conversation topics to reduce cognitive load.",
      "Based on your personality assessment, your social anxiety correlates with perfectionist tendencies. Implementing 'good enough' benchmarks can reduce anticipatory anxiety by up to 60%.",
    ],
    confidence: [
      "Confidence metrics can be systematically improved through evidence-based protocols. I recommend implementing daily confidence-building exercises with measurable benchmarks and progress tracking.",
      "Self-efficacy theory suggests confidence builds through mastery experiences and vicarious learning. Implementing power posing for 2 minutes before social interactions can increase confidence hormones by 20%.",
      "Analysis indicates your confidence levels are approximately 34% below optimal ranges for your personality type. Starting with micro-challenges can build neural pathways for increased self-assurance.",
      "Based on psychological research, confidence is a learnable skill set. I recommend documenting one small social success per day for systematic confidence calibration.",
    ],
    general: [
      "Processing your input through multiple psychological frameworks to provide optimized recommendations tailored to your specific personality profile and behavioral patterns.",
      "Your response data suggests high emotional intelligence and self-awareness metrics. These are strong predictive factors for successful personal development outcomes.",
      "Analysis complete. Your psychological profile indicates significant potential for growth using evidence-based intervention strategies customized to your MBTI type.",
      "Integrating your personality assessment data with current research in social psychology to generate personalized recommendations with >85% success probability.",
    ],
  },
};

// Connection status indicator
const ConnectionStatus = ({
  isOnline,
}: {
  isOnline: boolean;
}) => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EACBD2]/40 border border-[#DFAEB4]/30">
    {isOnline ? (
      <>
        <Wifi className="w-3 h-3 text-[#B486AB]" />
        <span className="text-xs text-[#82667F]">
          AI Connected
        </span>
      </>
    ) : (
      <>
        <WifiOff className="w-3 h-3 text-[#82667F]/60" />
        <span className="text-xs text-[#82667F]/60">
          Offline Mode
        </span>
      </>
    )}
  </div>
);

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
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-[#82667F]/60 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-[#82667F]/60 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
    </div>
    <span className="text-xs text-[#82667F]/60 font-medium">
      thinking...
    </span>
  </motion.div>
);

// Chat Panel Component
interface ChatPanelProps {
  chat: ChatSession;
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  advisor: "A" | "B";
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  chatRef: React.RefObject<HTMLDivElement>;
  guesses: {
    A: "ai" | "human" | null;
    B: "ai" | "human" | null;
  };
  showResults: boolean;
  handleGuess: (
    advisor: "A" | "B",
    guess: "ai" | "human",
  ) => void;
  handleKeyPress: (
    e: React.KeyboardEvent,
    sendFunction: () => void,
  ) => void;
  isLoading: boolean;
}

const ChatPanel = ({
  chat,
  input,
  setInput,
  sendMessage,
  advisor,
  textareaRef,
  chatRef,
  guesses,
  showResults,
  handleGuess,
  handleKeyPress,
  isLoading,
}: ChatPanelProps) => (
  <div className="bg-[#EACBD2]/50 backdrop-blur-md rounded-2xl border border-[#DFAEB4]/40 shadow-lg flex flex-col h-80">
    {/* Chat Header */}
    <div className="p-4 border-b border-[#DFAEB4]/30">
      <div className="flex items-center justify-between">
        <h3 className="text-[#82667F] font-medium">
          {chat.name}
        </h3>
        {!showResults && (
          <div className="flex gap-1">
            <button
              onClick={() => handleGuess(advisor, "ai")}
              className={`p-2 rounded-lg border transition-all ${
                guesses[advisor] === "ai"
                  ? "bg-[#DD9AC2]/30 border-[#B486AB]/40"
                  : "bg-[#EACBD2]/30 border-[#DFAEB4]/30"
              }`}
            >
              <Bot className="w-4 h-4 text-[#82667F]" />
            </button>
            <button
              onClick={() => handleGuess(advisor, "human")}
              className={`p-2 rounded-lg border transition-all ${
                guesses[advisor] === "human"
                  ? "bg-[#DD9AC2]/30 border-[#B486AB]/40"
                  : "bg-[#EACBD2]/30 border-[#DFAEB4]/30"
              }`}
            >
              <User className="w-4 h-4 text-[#82667F]" />
            </button>
          </div>
        )}
        {showResults && (
          <div className="flex items-center gap-2">
            {chat.source === "ai" ? (
              <Bot className="w-5 h-5 text-[#DD9AC2]" />
            ) : (
              <User className="w-5 h-5 text-[#B486AB]" />
            )}
            <span className="text-xs text-[#82667F]/80 font-medium">
              {chat.source === "ai" ? "AI" : "Human"}
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
            initial={
              message.isUser
                ? {
                    opacity: 0,
                    x: 20,
                    scale: 0.95,
                  }
                : {
                    opacity: 0,
                    y: 10,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: message.isUser ? 0 : 0.1,
            }}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed break-words ${
                message.isUser
                  ? "bg-[#DD9AC2]/30 text-[#82667F] ml-4"
                  : "bg-[#EACBD2]/40 text-[#82667F]/90 mr-4"
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
            disabled={isLoading}
            style={{
              height: "auto",
              minHeight: "44px",
            }}
          />
          {/* Character count overlay */}
          <div className="absolute bottom-2 right-2 text-xs text-[#82667F]/40 pointer-events-none">
            {input.length}/500
          </div>
        </div>
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || chat.isTyping || isLoading}
          size="sm"
          className="bg-[#B486AB]/80 hover:bg-[#82667F] text-white border-0 rounded-xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  </div>
);

export function AdviceScreen({
  setCurrentScreen,
  personalityType,
  mbtiScores,
}: AdviceScreenProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [chatA, setChatA] = useState<ChatSession>({
    messages: [],
    source: "human", // Will be updated from backend
    name: "Advisor A",
    isTyping: false,
  });

  const [chatB, setChatB] = useState<ChatSession>({
    messages: [],
    source: "ai", // Will be updated from backend
    name: "Advisor B",
    isTyping: false,
  });

  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [guesses, setGuesses] = useState<{
    A: "ai" | "human" | null;
    B: "ai" | "human" | null;
  }>({
    A: null,
    B: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);

  // Refs for maintaining focus
  const textareaARef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>;
  const textareaBRef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>;
  const chatARef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const chatBRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatARef.current) {
      chatARef.current.scrollTop =
        chatARef.current.scrollHeight;
    }
  }, [chatA.messages]);

  useEffect(() => {
    if (chatBRef.current) {
      chatBRef.current.scrollTop =
        chatBRef.current.scrollHeight;
    }
  }, [chatB.messages]);

  // Auto-resize textareas based on content
  useEffect(() => {
    if (textareaARef.current) {
      textareaARef.current.style.height = "auto";
      textareaARef.current.style.height =
        Math.min(textareaARef.current.scrollHeight, 120) + "px";
    }
  }, [inputA]);

  useEffect(() => {
    if (textareaBRef.current) {
      textareaBRef.current.style.height = "auto";
      textareaBRef.current.style.height =
        Math.min(textareaBRef.current.scrollHeight, 120) + "px";
    }
  }, [inputB]);

  // Initialize chat session on component mount
  useEffect(() => {
    initializeChatSession();
  }, [personalityType]);

  // Helper function to classify message topics
  const classifyTopic = (message: string) => {
    const lower = message.toLowerCase();
    if (
      lower.includes("anxious") ||
      lower.includes("nervous") ||
      lower.includes("worried") ||
      lower.includes("scared")
    ) {
      return "social_anxiety";
    }
    if (
      lower.includes("confident") ||
      lower.includes("confidence") ||
      lower.includes("shy") ||
      lower.includes("insecure")
    ) {
      return "confidence";
    }
    return "general";
  };

  // Check API health and initialize
  const checkApiHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        5000,
      ); // 5 second timeout

      const response = await fetch(
        `${API_BASE_URL}/api/health`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        },
      );

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log("API health check failed:", error);
      return false;
    }
  };

  const initializeChatSession = async () => {
    try {
      // First check if API is available
      const apiHealthy = await checkApiHealth();

      if (!apiHealthy) {
        console.log("API not available, using offline mode");
        setIsOnline(false);
        initializeOfflineMode();
        return;
      }

      setIsOnline(true);
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);

      const response = await fetch(
        `${API_BASE_URL}/api/chat/initial/${newSessionId}?personality_type=${personalityType}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to initialize chat session");
      }

      const data = await response.json();

      // Convert API messages to frontend format
      if (data.advisor_a_initial) {
        const message: ChatMessage = {
          id: data.advisor_a_initial.id,
          content: data.advisor_a_initial.content,
          isUser: false,
          timestamp: data.advisor_a_initial.timestamp,
          advisor_type: data.advisor_a_initial.advisor_type,
        };
        setChatA((prev) => ({
          ...prev,
          messages: [message],
          source: data.advisor_a_initial.advisor_type,
        }));
      }

      if (data.advisor_b_initial) {
        const message: ChatMessage = {
          id: data.advisor_b_initial.id,
          content: data.advisor_b_initial.content,
          isUser: false,
          timestamp: data.advisor_b_initial.timestamp,
          advisor_type: data.advisor_b_initial.advisor_type,
        };
        setChatB((prev) => ({
          ...prev,
          messages: [message],
          source: data.advisor_b_initial.advisor_type,
        }));
      }
    } catch (error) {
      console.error("Error initializing chat session:", error);
      setIsOnline(false);
      initializeOfflineMode();
    }
  };

  const initializeOfflineMode = () => {
    // Randomize advisor types for offline mode
    const advisorA = Math.random() > 0.5 ? "human" : "ai";
    const advisorB = advisorA === "human" ? "ai" : "human";

    // Set initial messages based on personality type and advisor type
    const getPersonalityContext = () => {
      if (mbtiScores.extraversion < 50) {
        return "As someone who seems to value deep reflection and meaningful connections";
      } else {
        return "As someone who appears to thrive in social environments";
      }
    };

    const personalityContext = getPersonalityContext();

    setChatA((prev) => ({
      ...prev,
      messages: [
        {
          id: "1",
          content:
            advisorA === "human"
              ? `Hi! I saw your reflection about social interactions. ${personalityContext}, you have such a thoughtful approach to relationships. I'd love to help you explore strategies that honor your authentic style.`
              : `Based on your personality assessment and journal entry, I can provide personalized social strategies. Your ${personalityType} type indicates specific social processing patterns. Consider implementing a systematic approach to social energy management.`,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ],
      source: advisorA,
    }));

    setChatB((prev) => ({
      ...prev,
      messages: [
        {
          id: "2",
          content:
            advisorB === "human"
              ? `Hi! I saw your reflection about social interactions. ${personalityContext}, you have such a thoughtful approach to relationships. I'd love to help you explore strategies that honor your authentic style.`
              : `Based on your personality assessment and journal entry, I can provide personalized social strategies. Your ${personalityType} type indicates specific social processing patterns. Consider implementing a systematic approach to social energy management.`,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ],
      source: advisorB,
    }));
  };

  const sendMessageToAPI = async (
    message: string,
    advisorId: "A" | "B",
  ): Promise<ChatResponse | null> => {
    if (!isOnline) return null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        10000,
      ); // 10 second timeout

      const response = await fetch(
        `${API_BASE_URL}/api/chat/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            message,
            advisor_id: advisorId,
            user_personality: personalityType,
            mbti_scores: {
              extraversion: mbtiScores.extraversion,
              intuition: mbtiScores.intuition,
              feeling: mbtiScores.feeling,
              perceiving: mbtiScores.perceiving,
            },
            session_id: sessionId,
          }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      setIsOnline(false); // Switch to offline mode on API failure
      return null;
    }
  };

  const generateOfflineResponse = (
    message: string,
    advisorType: "ai" | "human",
  ): string => {
    const topic = classifyTopic(message);
    const responses =
      FALLBACK_RESPONSES[advisorType][topic] ||
      FALLBACK_RESPONSES[advisorType].general;
    return responses[
      Math.floor(Math.random() * responses.length)
    ];
  };

  const sendMessageA = async () => {
    if (!inputA.trim()) return;

    setIsLoadingA(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputA.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setChatA((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    setInputA("");

    // Keep focus on textarea
    setTimeout(() => {
      textareaARef.current?.focus();
    }, 100);

    let responseContent: string;
    let typingDelay: number;

    if (isOnline) {
      // Try API first
      const apiResponse = await sendMessageToAPI(
        userMessage.content,
        "A",
      );

      if (apiResponse) {
        responseContent = apiResponse.message.content;
        typingDelay = apiResponse.typing_delay * 1000;
      } else {
        // API failed, fall back to offline
        responseContent = generateOfflineResponse(
          userMessage.content,
          chatA.source,
        );
        typingDelay =
          chatA.source === "human"
            ? 2000 + Math.random() * 1000
            : 1000 + Math.random() * 500;
      }
    } else {
      // Offline mode
      responseContent = generateOfflineResponse(
        userMessage.content,
        chatA.source,
      );
      typingDelay =
        chatA.source === "human"
          ? 2000 + Math.random() * 1000
          : 1000 + Math.random() * 500;
    }

    setTimeout(() => {
      const advisorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date().toISOString(),
        advisor_type: chatA.source,
      };

      setChatA((prev) => ({
        ...prev,
        messages: [...prev.messages, advisorMessage],
        isTyping: false,
      }));
      setIsLoadingA(false);
    }, typingDelay);
  };

  const sendMessageB = async () => {
    if (!inputB.trim()) return;

    setIsLoadingB(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputB.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setChatB((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    setInputB("");

    // Keep focus on textarea
    setTimeout(() => {
      textareaBRef.current?.focus();
    }, 100);

    let responseContent: string;
    let typingDelay: number;

    if (isOnline) {
      // Try API first
      const apiResponse = await sendMessageToAPI(
        userMessage.content,
        "B",
      );

      if (apiResponse) {
        responseContent = apiResponse.message.content;
        typingDelay = apiResponse.typing_delay * 1000;
      } else {
        // API failed, fall back to offline
        responseContent = generateOfflineResponse(
          userMessage.content,
          chatB.source,
        );
        typingDelay =
          chatB.source === "human"
            ? 2000 + Math.random() * 1000
            : 1000 + Math.random() * 500;
      }
    } else {
      // Offline mode
      responseContent = generateOfflineResponse(
        userMessage.content,
        chatB.source,
      );
      typingDelay =
        chatB.source === "human"
          ? 2000 + Math.random() * 1000
          : 1000 + Math.random() * 500;
    }

    setTimeout(() => {
      const advisorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date().toISOString(),
        advisor_type: chatB.source,
      };

      setChatB((prev) => ({
        ...prev,
        messages: [...prev.messages, advisorMessage],
        isTyping: false,
      }));
      setIsLoadingB(false);
    }, typingDelay);
  };

  const handleGuess = (
    advisor: "A" | "B",
    guess: "ai" | "human",
  ) => {
    setGuesses((prev) => ({ ...prev, [advisor]: guess }));
  };

  const revealResults = async () => {
    if (!guesses.A || !guesses.B) return;

    if (isOnline && sessionId) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/chat/guess`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session_id: sessionId,
              advisor_a_guess: guesses.A,
              advisor_b_guess: guesses.B,
            }),
          },
        );

        if (response.ok) {
          const result: GuessResult = await response.json();

          // Update chat sources with actual types
          setChatA((prev) => ({
            ...prev,
            source: result.actual_advisor_a,
          }));
          setChatB((prev) => ({
            ...prev,
            source: result.actual_advisor_b,
          }));
        }
      } catch (error) {
        console.error("Error submitting guesses:", error);
      }
    }
    // For offline mode, the sources are already set correctly

    setShowResults(true);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    sendFunction: () => void,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendFunction();
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen("journal")}
          className="text-[#82667F] hover:text-[#B486AB] hover:bg-[#EACBD2]/50 rounded-full p-2 border-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-[#82667F] text-center font-medium">
          Chat with Advisors
        </h2>
        <ConnectionStatus isOnline={isOnline} />
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
            : "Results revealed! See how you did with your guesses."}
        </p>
        {!isOnline && (
          <p className="text-[#82667F]/70 text-xs text-center mt-2 italic">
            Using offline mode - responses are simulated but
            still personality-aware!
          </p>
        )}
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
            guesses={guesses}
            showResults={showResults}
            handleGuess={handleGuess}
            handleKeyPress={handleKeyPress}
            isLoading={isLoadingA}
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
            guesses={guesses}
            showResults={showResults}
            handleGuess={handleGuess}
            handleKeyPress={handleKeyPress}
            isLoading={isLoadingB}
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
            onClick={() => setCurrentScreen("quiz")}
            variant="outline"
            className="bg-[#DD9AC2]/20 hover:bg-[#DD9AC2]/40 text-[#82667F] border-[#B486AB]/30 hover:border-[#82667F]/40 rounded-2xl py-4 transition-all duration-200 hover:scale-105 font-medium"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </span>
          </Button>
          <Button
            onClick={() => setCurrentScreen("journal")}
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