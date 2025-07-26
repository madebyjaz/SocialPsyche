import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ArrowLeft, ArrowRight, Users, Brain, Heart, Zap, Clock, Home, Eye, MessageCircle, Battery, Handshake, Lightbulb, Mountain, Shield, Gauge } from 'lucide-react';
import { QuizAnswers, PersonalityType, PersonalityScores } from '../App';

interface QuizScreenProps {
  setCurrentScreen: (screen: string) => void;
  quizAnswers: QuizAnswers;
  setQuizAnswers: (answers: QuizAnswers) => void;
  setPersonalityType: (type: PersonalityType) => void;
  setPersonalityScores: (scores: PersonalityScores) => void;
  calculatePersonalityType: (answers: QuizAnswers) => { type: PersonalityType; scores: PersonalityScores };
}

export function QuizScreen({ 
  setCurrentScreen, 
  quizAnswers, 
  setQuizAnswers, 
  setPersonalityType,
  setPersonalityScores,
  calculatePersonalityType 
}: QuizScreenProps) {
  const questions = [
    {
      id: 'energy',
      icon: Battery,
      emoji: '🔋',
      question: 'I get my energy from...',
      leftLabel: 'Quiet time alone',
      rightLabel: 'Being around people'
    },
    {
      id: 'socialSettings',
      icon: Users,
      emoji: '👥',
      question: 'In social settings, I tend to...',
      leftLabel: 'Listen and observe',
      rightLabel: 'Lead conversations'
    },
    {
      id: 'decisions',
      icon: Brain,
      emoji: '🧠',
      question: 'When making decisions, I...',
      leftLabel: 'Think it through carefully',
      rightLabel: 'Go with my gut feeling'
    },
    {
      id: 'stress',
      icon: Heart,
      emoji: '💭',
      question: 'When stressed, I prefer to...',
      leftLabel: 'Process alone first',
      rightLabel: 'Talk it out immediately'
    },
    {
      id: 'communication',
      icon: MessageCircle,
      emoji: '💬',
      question: 'I communicate best through...',
      leftLabel: 'Writing and reflection',
      rightLabel: 'Speaking and discussing'
    },
    {
      id: 'gatherings',
      icon: Users,
      emoji: '🎉',
      question: 'I prefer gatherings that are...',
      leftLabel: 'Small and intimate',
      rightLabel: 'Big and energetic'
    },
    {
      id: 'weekend',
      icon: Home,
      emoji: '🏠',
      question: 'My ideal weekend involves...',
      leftLabel: 'Relaxing solo time',
      rightLabel: 'Trying new activities with others'
    },
    {
      id: 'newEnvironments',
      icon: Eye,
      emoji: '👁️',
      question: 'In new environments, I usually...',
      leftLabel: 'Observe before engaging',
      rightLabel: 'Jump right in'
    },
    {
      id: 'thoughtMotion',
      icon: Zap,
      emoji: '⚡',
      question: 'I often find myself...',
      leftLabel: 'Deep in thought',
      rightLabel: 'Constantly in motion'
    },
    {
      id: 'recharge',
      icon: Battery,
      emoji: '🔄',
      question: 'I recharge by...',
      leftLabel: 'Spending time alone',
      rightLabel: 'Being out with friends'
    },
    {
      id: 'meeting',
      icon: Handshake,
      emoji: '🤝',
      question: 'When meeting someone new, I...',
      leftLabel: 'Wait for them to approach',
      rightLabel: 'Start the conversation'
    },
    {
      id: 'reflection',
      icon: Lightbulb,
      emoji: '💡',
      question: 'I tend to reflect on...',
      leftLabel: 'My inner world',
      rightLabel: 'My external experiences'
    },
    {
      id: 'activities',
      icon: Mountain,
      emoji: '🎯',
      question: 'I enjoy activities that are...',
      leftLabel: 'Familiar and calming',
      rightLabel: 'Spontaneous and exciting'
    },
    {
      id: 'avoidance',
      icon: Shield,
      emoji: '🛡️',
      question: 'I avoid social settings because...',
      leftLabel: 'I feel anxious or awkward',
      rightLabel: 'I never avoid them'
    },
    {
      id: 'actions',
      icon: Gauge,
      emoji: '⏱️',
      question: 'I act...',
      leftLabel: 'Cautiously and deliberately',
      rightLabel: 'Impulsively and fast-paced'
    }
  ];

  const updateAnswer = (questionId: keyof QuizAnswers, value: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: value
    });
  };

  const handleComplete = () => {
    const { type, scores } = calculatePersonalityType(quizAnswers);
    setPersonalityType(type);
    setPersonalityScores(scores);
    setCurrentScreen('results');
  };

  const completedQuestions = Object.values(quizAnswers).filter(val => val !== 50).length;
  const progress = (completedQuestions / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('landing')}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-white text-center">Personality Discovery</h2>
        <div className="w-9"></div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/70 mb-2">
          <span>Progress</span>
          <span>{completedQuestions} of {questions.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white/80 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 space-y-4 mb-8">
        {questions.map((question, index) => {
          const IconComponent = question.icon;
          return (
            <div key={question.id} className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">{question.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/60">#{index + 1}</span>
                    <h3 className="text-white text-sm">{question.question}</h3>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Slider
                  value={[quizAnswers[question.id as keyof QuizAnswers]]}
                  onValueChange={(value) => updateAnswer(question.id as keyof QuizAnswers, value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-white/70">
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
          className="w-full bg-white/90 hover:bg-white text-[#B486AB] shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="flex items-center gap-2">
            Discover My Personality
            <ArrowRight className="w-5 h-5" />
          </span>
        </Button>
        {completedQuestions < questions.length && (
          <p className="text-center text-white/60 text-sm mt-3">
            Answer all questions to see your results
          </p>
        )}
      </div>
    </div>
  );
}