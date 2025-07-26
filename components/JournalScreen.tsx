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

  const prompts = {
    // Introvert Prompts
    'Social Introvert': [
      'What meaningful one-on-one conversation stood out to you today?',
      'Describe a moment when you felt truly understood by someone close to you.',
      'How did you recharge after being around people today?',
      'What thoughts have been quietly circling in your mind?',
      'When did you last feel completely comfortable in a small group setting?'
    ],
    'Anxious Introvert': [
      'What social situation felt challenging today, and how did you handle it?',
      'Describe a moment when you overcame initial nervousness to connect with someone.',
      'What familiar environment or person brought you comfort today?',
      'How did you practice self-compassion during a difficult moment?',
      'What small step did you take outside your comfort zone?'
    ],
    'Thinking Introvert': [
      'What interesting idea or concept captured your thoughts today?',
      'Describe a moment when you gained a new insight about yourself or the world.',
      'What philosophical question has been on your mind lately?',
      'How did quiet reflection help you process an experience today?',
      'What creative or analytical project is currently engaging your mind?'
    ],
    'Restrained Introvert': [
      'What decision did you take time to carefully consider today?',
      'Describe a situation where your deliberate approach served you well.',
      'How did you honor your need for consistency and routine?',
      'What observation did you make before deciding to participate in something?',
      'When did your reserved nature help you understand a situation better?'
    ],
    // Extrovert Prompts
    'Active Extrovert': [
      'What energizing activity or experience filled you with excitement today?',
      'Describe a moment when you took initiative and led others.',
      'How did physical movement or high-energy activities impact your mood?',
      'What spontaneous adventure or activity brought you joy?',
      'When did you feel most alive and engaged with the world around you?'
    ],
    'Affiliative Extrovert': [
      'How did you strengthen a meaningful relationship today?',
      'Describe a moment when you provided support or comfort to someone.',
      'What act of kindness either given or received touched your heart?',
      'How did spending quality time with loved ones energize you?',
      'What conversation deepened your connection with someone important to you?'
    ],
    'Social Extrovert': [
      'What group interaction or social event energized you today?',
      'Describe a moment when you helped bring people together.',
      'How did being around lots of people affect your energy and mood?',
      'What new person did you meet or reconnect with today?',
      'When did you feel most in your element during social interactions?'
    ],
    'Experimental Extrovert': [
      'What new experience or adventure did you try today?',
      'Describe an unexpected opportunity that excited you.',
      'How did trying something different expand your perspective?',
      'What spontaneous decision led to an interesting outcome?',
      'When did curiosity about something new energize and inspire you?'
    ]
  };

  const moods = [
    { emoji: '🥲', label: 'Reflective', value: 'reflective' },
    { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
    { emoji: '🔥', label: 'Energized', value: 'energized' },
    { emoji: '🤯', label: 'Overwhelmed', value: 'overwhelmed' },
    { emoji: '💫', label: 'Inspired', value: 'inspired' },
    { emoji: '🌱', label: 'Growing', value: 'growing' }
  ];

  // Set the prompt once based on personality type and don't change it
  useEffect(() => {
    if (!currentPrompt) {
      const personalityPrompts = prompts[personalityType];
      const randomPrompt = personalityPrompts[Math.floor(Math.random() * personalityPrompts.length)];
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

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('results')}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-white text-center">Daily Reflection</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('progress')}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
      </div>

      {/* Prompt - Fixed and doesn't change */}
      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm">💭</span>
          </div>
          <span className="text-white/80 text-sm">Prompt for {personalityType}s</span>
        </div>
        <p className="text-white leading-relaxed">
          {currentPrompt || 'Loading your personalized prompt...'}
        </p>
      </div>

      {/* Journal Input */}
      <div className="flex-1 mb-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl resize-none focus:bg-white/15 transition-colors"
        />
      </div>

      {/* Mood Selector */}
      <div className="mb-6">
        <p className="text-white/80 text-sm mb-3">How are you feeling?</p>
        <div className="grid grid-cols-3 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-xl border transition-all ${
                selectedMood === mood.value
                  ? 'bg-white/20 border-white/40 scale-105'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{mood.emoji}</div>
                <div className="text-xs text-white/70">{mood.label}</div>
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
          className="w-full bg-white/90 hover:bg-white text-[#B486AB] shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-2xl py-4"
          >
            Back to Advice
          </Button>
          <Button
            onClick={handleBackToQuiz}
            variant="outline"
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-2xl py-4"
          >
            Back to Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}