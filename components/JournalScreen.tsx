import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Send, BarChart3 } from 'lucide-react';
import { PersonalityType, JournalEntry } from '../App';

interface JournalScreenProps {
  setCurrentScreen: (screen: string) => void;
  personalityType: PersonalityType;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
}

export function JournalScreen({ setCurrentScreen, personalityType, addJournalEntry }: JournalScreenProps) {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

  const mbtiPrompts = {
    // Extroverted Types
    'ESTP': [
      'What exciting activity or adventure did you experience today?',
      'Describe a practical problem you solved using your hands-on approach.',
      'How did you adapt to an unexpected situation today?',
      'What real-world challenge energized you most recently?',
      'When did you feel most alive and engaged with your environment?'
    ],
    'ESFP': [
      'What joyful moment did you create or experience with others today?',
      'Describe a time when you helped someone feel better or more included.',
      'How did you express your creativity or spontaneity recently?',
      'What new experience brought you excitement today?',
      'When did you feel most connected to the people around you?'
    ],
    'ENFP': [
      'What new possibility or idea inspired you today?',
      'Describe a meaningful connection you made with someone.',
      'How did you help someone see their potential recently?',
      'What creative project or idea is currently exciting you?',
      'When did you feel most aligned with your values and passions?'
    ],
    'ENTP': [
      'What interesting debate or discussion challenged your thinking today?',
      'Describe a new concept or idea you explored recently.',
      'How did you challenge a conventional way of thinking?',
      'What mental puzzle or complex problem engaged you most?',
      'When did you feel most intellectually stimulated?'
    ],
    'ESTJ': [
      'What goal did you make progress on today?',
      'Describe how you organized or improved a system recently.',
      'How did you lead or guide others toward an objective?',
      'What tradition or established method served you well?',
      'When did you feel most productive and accomplished?'
    ],
    'ESFJ': [
      'How did you help or care for someone important to you today?',
      'Describe a moment when you contributed to group harmony.',
      'What did you do to make someone feel valued and appreciated?',
      'How did you strengthen a relationship recently?',
      'When did you feel most needed and appreciated by others?'
    ],
    'ENFJ': [
      'How did you inspire or motivate someone today?',
      'Describe a moment when you helped someone grow or develop.',
      'What did you do to create positive change in your community?',
      'How did you use your empathy to understand someone deeply?',
      'When did you feel most fulfilled helping others reach their potential?'
    ],
    'ENTJ': [
      'What strategic decision did you make today?',
      'Describe how you organized people or resources to achieve a goal.',
      'What long-term vision are you working toward?',
      'How did you overcome a significant challenge recently?',
      'When did you feel most effective as a leader?'
    ],
    
    // Introverted Types
    'ISTJ': [
      'What routine or system helped you stay organized today?',
      'Describe how you fulfilled an important responsibility.',
      'What detail did you notice that others might have missed?',
      'How did you apply past experience to solve a current problem?',
      'When did you feel most secure and stable?'
    ],
    'ISFJ': [
      'How did you quietly support someone in need today?',
      'Describe a moment when you preserved something important.',
      'What did you do to maintain harmony in your environment?',
      'How did you show care for someone without them asking?',
      'When did you feel most useful and appreciated?'
    ],
    'INFJ': [
      'What deeper meaning or insight did you discover today?',
      'Describe a moment when you understood someone\'s true motivations.',
      'How did you work toward your vision of a better future?',
      'What pattern or connection did you notice in your experiences?',
      'When did you feel most aligned with your purpose?'
    ],
    'INTJ': [
      'What complex idea or concept did you master today?',
      'Describe progress you made on a long-term project or goal.',
      'How did you improve or optimize a system or process?',
      'What independent insight did you develop recently?',
      'When did you feel most intellectually satisfied?'
    ],
    'ISTP': [
      'What did you fix, build, or improve with your hands today?',
      'Describe a moment when you solved a practical problem efficiently.',
      'How did you use your skills to understand how something works?',
      'What tool or technique did you master recently?',
      'When did you feel most competent and capable?'
    ],
    'ISFP': [
      'What beauty or aesthetic experience moved you today?',
      'Describe a moment when you stayed true to your values.',
      'How did you express your creativity or artistic side?',
      'What authentic experience brought you joy recently?',
      'When did you feel most at peace with yourself?'
    ],
    'INFP': [
      'What personal value did you honor or defend today?',
      'Describe a moment when you felt deeply understood.',
      'How did you contribute to something meaningful to you?',
      'What creative expression helped you process your feelings?',
      'When did you feel most authentic and true to yourself?'
    ],
    'INTP': [
      'What fascinating idea or theory captivated your mind today?',
      'Describe a logical connection you made between different concepts.',
      'How did you analyze or deconstruct a complex problem?',
      'What knowledge did you acquire that excited you?',
      'When did you feel most intellectually curious and engaged?'
    ]
  };

  const moods = [
    { emoji: '🧠', label: 'Analytical', value: 'analytical' },
    { emoji: '🌟', label: 'Inspired', value: 'inspired' },
    { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
    { emoji: '⚡', label: 'Energized', value: 'energized' },
    { emoji: '🤔', label: 'Contemplative', value: 'contemplative' },
    { emoji: '🎯', label: 'Focused', value: 'focused' }
  ];

  // Set the prompt once based on personality type and don't change it
  useEffect(() => {
    if (!currentPrompt) {
      const typePrompts = mbtiPrompts[personalityType];
      const randomPrompt = typePrompts[Math.floor(Math.random() * typePrompts.length)];
      setCurrentPrompt(randomPrompt);
    }
  }, [personalityType, currentPrompt]);

  const handleSubmit = () => {
    if (content.trim()) {
      addJournalEntry({
        prompt: currentPrompt,
        content: content.trim(),
        mood: selectedMood,
        date: new Date().toISOString()
      });
      setContent('');
      setSelectedMood('');
      setCurrentPrompt(''); // Reset for next session
      setCurrentScreen('advice');
    }
  };

  const handleBackToAdvice = () => {
    setCurrentScreen('advice');
  };

  const handleBackToQuiz = () => {
    setCurrentScreen('quiz');
  };

  const getTypeDescription = (type: PersonalityType) => {
    const descriptions = {
      'ESTP': 'The Dynamo',
      'ESFP': 'The Entertainer',
      'ENFP': 'The Campaigner',
      'ENTP': 'The Debater',
      'ESTJ': 'The Executive',
      'ESFJ': 'The Caregiver',
      'ENFJ': 'The Protagonist',
      'ENTJ': 'The Commander',
      'ISTJ': 'The Inspector',
      'ISFJ': 'The Defender',
      'INFJ': 'The Advocate',
      'INTJ': 'The Architect',
      'ISTP': 'The Virtuoso',
      'ISFP': 'The Adventurer',
      'INFP': 'The Mediator',
      'INTP': 'The Thinker'
    };
    return descriptions[type];
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('results')}
          className="text-[#82667F] hover:text-[#B486AB] hover:bg-[#EACBD2]/50 rounded-full p-2 border-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-[#82667F] text-center font-medium">Daily Reflection</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('progress')}
          className="text-[#82667F] hover:text-[#B486AB] hover:bg-[#EACBD2]/50 rounded-full p-2 border-0"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
      </div>

      {/* Prompt - Fixed and doesn't change */}
      <div className="bg-[#EACBD2]/60 backdrop-blur-md rounded-2xl p-6 border border-[#DFAEB4]/40 shadow-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#DD9AC2]/30 rounded-full flex items-center justify-center">
            <span className="text-sm">💭</span>
          </div>
          <div>
            <span className="text-[#82667F]/80 text-sm font-medium">
              Prompt for {personalityType}s
            </span>
            <p className="text-[#82667F]/60 text-xs">
              {getTypeDescription(personalityType)}
            </p>
          </div>
        </div>
        <p className="text-[#82667F] leading-relaxed">
          {currentPrompt || 'Loading your personalized prompt...'}
        </p>
      </div>

      {/* Journal Input */}
      <div className="flex-1 mb-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="min-h-[200px] bg-[#EACBD2]/40 border-[#DFAEB4]/40 text-[#82667F] placeholder:text-[#82667F]/50 rounded-2xl resize-none focus:bg-[#EACBD2]/60 focus:border-[#B486AB]/40 transition-colors"
        />
      </div>

      {/* Mood Selector */}
      <div className="mb-6">
        <p className="text-[#82667F]/80 text-sm mb-3 font-medium">How are you feeling?</p>
        <div className="grid grid-cols-3 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-xl border transition-all ${
                selectedMood === mood.value
                  ? 'bg-[#DD9AC2]/30 border-[#B486AB]/40 scale-105'
                  : 'bg-[#EACBD2]/30 border-[#DFAEB4]/30 hover:bg-[#DD9AC2]/20'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{mood.emoji}</div>
                <div className="text-xs text-[#82667F]/70 font-medium">{mood.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="w-full bg-[#B486AB] hover:bg-[#82667F] text-white shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:bg-[#DFAEB4]/60 disabled:text-[#82667F]/70 font-medium"
        >
          <span className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Save Entry
          </span>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleBackToAdvice}
            variant="outline"
            className="bg-[#DD9AC2]/20 hover:bg-[#DD9AC2]/40 text-[#82667F] border-[#B486AB]/30 hover:border-[#82667F]/40 rounded-2xl py-4 font-medium"
          >
            Back to Advice
          </Button>
          <Button
            onClick={handleBackToQuiz}
            variant="outline"
            className="bg-[#EACBD2]/40 hover:bg-[#EACBD2]/60 text-[#82667F] border-[#DFAEB4]/40 hover:border-[#B486AB]/40 rounded-2xl py-4 font-medium"
          >
            Back to Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}