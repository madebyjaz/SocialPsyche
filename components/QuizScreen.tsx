import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ArrowLeft, ArrowRight, Users, Brain, Heart, Zap, Eye, Lightbulb, Calendar, Target, Clock, Layers, Compass, Settings } from 'lucide-react';
import { QuizAnswers, PersonalityType, MBTIScores, TypeAffinityScores } from '../App';

interface QuizScreenProps {
  setCurrentScreen: (screen: string) => void;
  quizAnswers: QuizAnswers;
  setQuizAnswers: (answers: QuizAnswers) => void;
  setPersonalityType: (type: PersonalityType) => void;
  setMBTIScores: (scores: MBTIScores) => void;
  setTypeAffinityScores: (scores: TypeAffinityScores) => void;
  calculateMBTIType: (answers: QuizAnswers) => { type: PersonalityType; scores: MBTIScores };
  calculateTypeAffinityScores: (scores: MBTIScores) => TypeAffinityScores;
}

export function QuizScreen({ 
  setCurrentScreen, 
  quizAnswers, 
  setQuizAnswers, 
  setPersonalityType,
  setMBTIScores,
  setTypeAffinityScores,
  calculateMBTIType,
  calculateTypeAffinityScores
}: QuizScreenProps) {
  const questions = [
    // E/I Questions (Extraversion vs Introversion)
    {
      id: 'energySource',
      category: 'E/I',
      icon: Zap,
      emoji: '🔋',
      question: 'I get my energy from...',
      leftLabel: 'Quiet time alone',
      rightLabel: 'Being around people',
      dimension: 'Energy Source'
    },
    {
      id: 'socialSettings',
      category: 'E/I',
      icon: Users,
      emoji: '👥',
      question: 'In social settings, I tend to...',
      leftLabel: 'Listen and observe',
      rightLabel: 'Lead conversations',
      dimension: 'Social Approach'
    },
    {
      id: 'recharge',
      category: 'E/I',
      icon: Heart,
      emoji: '💆',
      question: 'When I need to recharge, I...',
      leftLabel: 'Spend time alone',
      rightLabel: 'Socialize with others',
      dimension: 'Recharge Style'
    },
    {
      id: 'groupSize',
      category: 'E/I',
      icon: Users,
      emoji: '🎉',
      question: 'I prefer...',
      leftLabel: 'Small, intimate groups',
      rightLabel: 'Large, lively gatherings',
      dimension: 'Group Preference'
    },
    
    // S/N Questions (Sensing vs iNtuition)
    {
      id: 'information',
      category: 'S/N',
      icon: Eye,
      emoji: '👁️',
      question: 'I prefer information that is...',
      leftLabel: 'Concrete and factual',
      rightLabel: 'Abstract and theoretical',
      dimension: 'Information Style'
    },
    {
      id: 'future',
      category: 'S/N',
      icon: Compass,
      emoji: '🔮',
      question: 'I am more interested in...',
      leftLabel: 'Present realities',
      rightLabel: 'Future possibilities',
      dimension: 'Time Focus'
    },
    {
      id: 'details',
      category: 'S/N',
      icon: Target,
      emoji: '🔍',
      question: 'I tend to focus on...',
      leftLabel: 'Details and specifics',
      rightLabel: 'Big picture and patterns',
      dimension: 'Focus Style'
    },
    {
      id: 'possibilities',
      category: 'S/N',
      icon: Lightbulb,
      emoji: '💡',
      question: 'I am energized by...',
      leftLabel: 'Proven methods',
      rightLabel: 'New possibilities',
      dimension: 'Innovation Style'
    },
    
    // T/F Questions (Thinking vs Feeling)
    {
      id: 'decisions',
      category: 'T/F',
      icon: Brain,
      emoji: '🧠',
      question: 'When making decisions, I rely more on...',
      leftLabel: 'Logic and analysis',
      rightLabel: 'Values and feelings',
      dimension: 'Decision Making'
    },
    {
      id: 'criticism',
      category: 'T/F',
      icon: Settings,
      emoji: '⚖️',
      question: 'I am more comfortable with...',
      leftLabel: 'Constructive criticism',
      rightLabel: 'Supportive encouragement',
      dimension: 'Feedback Style'
    },
    {
      id: 'values',
      category: 'T/F',
      icon: Heart,
      emoji: '💖',
      question: 'I prioritize...',
      leftLabel: 'Objective fairness',
      rightLabel: 'Personal values',
      dimension: 'Priority System'
    },
    {
      id: 'conflict',
      category: 'T/F',
      icon: Users,
      emoji: '🤝',
      question: 'In conflicts, I focus on...',
      leftLabel: 'Finding the truth',
      rightLabel: 'Maintaining harmony',
      dimension: 'Conflict Style'
    },
    
    // J/P Questions (Judging vs Perceiving)
    {
      id: 'planning',
      category: 'J/P',
      icon: Calendar,
      emoji: '📅',
      question: 'I prefer to...',
      leftLabel: 'Plan things in advance',
      rightLabel: 'Keep options open',
      dimension: 'Planning Style'
    },
    {
      id: 'deadlines',
      category: 'J/P',
      icon: Clock,
      emoji: '⏰',
      question: 'With deadlines, I tend to...',
      leftLabel: 'Start early and finish ahead',
      rightLabel: 'Work best under pressure',
      dimension: 'Time Management'
    },
    {
      id: 'structure',
      category: 'J/P',
      icon: Layers,
      emoji: '🏗️',
      question: 'I work best with...',
      leftLabel: 'Clear structure and routine',
      rightLabel: 'Flexibility and spontaneity',
      dimension: 'Work Style'
    },
    {
      id: 'flexibility',
      category: 'J/P',
      icon: Compass,
      emoji: '🌊',
      question: 'I am more comfortable with...',
      leftLabel: 'Decided plans',
      rightLabel: 'Adaptable approaches',
      dimension: 'Adaptability'
    }
  ];

  const updateAnswer = (questionId: keyof QuizAnswers, value: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: value
    });
  };

  const handleComplete = () => {
    const { type, scores } = calculateMBTIType(quizAnswers);
    const affinityScores = calculateTypeAffinityScores(scores);
    
    setPersonalityType(type);
    setMBTIScores(scores);
    setTypeAffinityScores(affinityScores);
    setCurrentScreen('results');
  };

  const completedQuestions = Object.values(quizAnswers).filter(val => val !== 50).length;
  const progress = (completedQuestions / questions.length) * 100;

  // Get category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'E/I': return 'bg-[#B486AB]/20';
      case 'S/N': return 'bg-[#DD9AC2]/20';
      case 'T/F': return 'bg-[#DFAEB4]/20';
      case 'J/P': return 'bg-[#EACBD2]/20';
      default: return 'bg-[#EACBD2]/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('landing')}
          className="text-[#82667F] hover:text-[#B486AB] hover:bg-[#EACBD2]/50 rounded-full p-2 border-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-[#82667F] text-center font-medium">MBTI Assessment</h2>
        <div className="w-9"></div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[#82667F]/80 mb-2">
          <span>Progress</span>
          <span>{completedQuestions} of {questions.length}</span>
        </div>
        <div className="w-full bg-[#DFAEB4]/30 rounded-full h-3">
          <div 
            className="bg-[#82667F] h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 space-y-4 mb-8">
        {questions.map((question, index) => {
          const IconComponent = question.icon;
          return (
            <div key={question.id} className="bg-[#EACBD2]/60 backdrop-blur-md rounded-2xl p-5 border border-[#DFAEB4]/40 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${getCategoryColor(question.category)} rounded-full flex items-center justify-center`}>
                  <span className="text-lg">{question.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#82667F]/70 font-medium">
                      #{index + 1} • {question.category}
                    </span>
                    <span className="text-xs text-[#82667F]/50">
                      {question.dimension}
                    </span>
                  </div>
                  <h3 className="text-[#82667F] text-sm font-medium">{question.question}</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="social-slider">
                  <Slider
                    value={[quizAnswers[question.id as keyof QuizAnswers]]}
                    onValueChange={(value) => updateAnswer(question.id as keyof QuizAnswers, value[0])}
                    max={100}
                    step={1}
                    className="w-full [&>[role=slider]]:bg-[#82667F] [&>[role=slider]]:border-2 [&>[role=slider]]:border-white [&>[role=slider]]:shadow-lg [&>[role=slider]]:hover:bg-[#DD9AC2] [&>[role=slider]]:hover:scale-110 [&>[role=slider]]:focus:bg-[#B486AB] [&>[role=slider]]:transition-all [&>[role=slider]]:duration-200 [&>.slider-track]:bg-[#DFAEB4]/30 [&>.slider-range]:bg-[#82667F]"
                  />
                </div>
                
                <div className="flex justify-between text-xs text-[#82667F]/80 font-medium">
                  <span>{question.leftLabel}</span>
                  <span>{question.rightLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      <div className="pt-4">
        <Button
          onClick={handleComplete}
          disabled={completedQuestions < questions.length}
          className="w-full bg-[#B486AB] hover:bg-[#82667F] text-white shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:bg-[#DFAEB4]/60 disabled:text-[#82667F]/70"
        >
          <span className="flex items-center gap-2 font-medium">
            Discover My MBTI Type✨
            <ArrowRight className="w-5 h-5" />
          </span>
        </Button>
        {completedQuestions < questions.length && (
          <p className="text-center text-[#82667F]/70 text-sm mt-3">
            Answer all questions to discover your MBTI type
          </p>
        )}
      </div>
    </div>
  );
}