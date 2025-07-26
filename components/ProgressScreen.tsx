import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ArrowLeft, TrendingUp, Calendar, Heart, Target, Users, Award, Eye } from 'lucide-react';
import { JournalEntry } from '../App';

interface ProgressScreenProps {
  setCurrentScreen: (screen: string) => void;
  journalEntries: JournalEntry[];
}

export function ProgressScreen({ setCurrentScreen, journalEntries }: ProgressScreenProps) {
  // Enhanced stats with streak tracking
  const mockStats = {
    streak: 7,
    totalEntries: journalEntries.length || 12,
    weeklyEntries: [2, 3, 1, 4, 2, 3, 2], // Last 7 days
    favoriteAdvice: 'Human insights',
    topMood: 'Reflective',
    communityStats: {
      humanPreference: 78,
      aiPreference: 22,
      accuracyRate: 65
    }
  };

  // Recent mood pattern (last 7 days)
  const recentMoods = ['reflective', 'peaceful', 'inspired', 'growing', 'reflective', 'energized', 'peaceful'];
  const moodEmojis: { [key: string]: string } = {
    reflective: '🥲',
    peaceful: '😌',
    energized: '🔥',
    overwhelmed: '🤯',
    inspired: '💫',
    growing: '🌱',
    'none': '⚪'
  };

  // Check if today has an entry
  const today = new Date().toDateString();
  const hasEntryToday = journalEntries.some(entry => 
    new Date(entry.date).toDateString() === today
  );

  const todayMood = hasEntryToday ? recentMoods[6] : 'none';

  const insights = [
    "You've been most reflective on weekdays - great for processing daily experiences.",
    "Your journal entries are getting longer and more detailed over time.",
    `${mockStats.communityStats.humanPreference}% of users found human advice more helpful this week.`
  ];

  // Generate week line chart data
  const maxEntries = Math.max(...mockStats.weeklyEntries);
  const chartPoints = mockStats.weeklyEntries.map((entries, index) => {
    const x = (index / 6) * 100; // Percentage across width
    const y = 100 - ((entries / (maxEntries || 1)) * 80); // Inverted for SVG, max 80% height
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('journal')}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-white text-center">Your Growth</h2>
        <div className="w-9"></div>
      </div>

      {/* Streak & Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-white/15 backdrop-blur-md border-white/20 p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-orange-300" />
            </div>
            <div className="text-2xl text-white mb-1">{mockStats.streak}</div>
            <div className="text-sm text-white/70">Day Streak</div>
          </div>
        </Card>

        <Card className="bg-white/15 backdrop-blur-md border-white/20 p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-blue-300" />
            </div>
            <div className="text-2xl text-white mb-1">{mockStats.totalEntries}</div>
            <div className="text-sm text-white/70">Total Entries</div>
          </div>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-300" />
          <h3 className="text-white">Weekly Journal Entries</h3>
        </div>
        <div className="relative h-20 bg-white/5 rounded-lg p-2">
          <svg width="100%" height="100%" className="overflow-visible">
            <polyline
              points={chartPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            {mockStats.weeklyEntries.map((entries, index) => {
              const x = (index / 6) * 100;
              const y = 100 - ((entries / (maxEntries || 1)) * 80);
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="rgba(255, 255, 255, 0.9)"
                  className="drop-shadow-sm"
                />
              );
            })}
          </svg>
          <div className="flex justify-between text-xs text-white/50 mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Mood Pattern */}
      <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-300" />
          <h3 className="text-white">Recent Mood Pattern</h3>
        </div>
        <div className="flex justify-between items-center">
          {recentMoods.slice(-6).concat([todayMood]).map((mood, index) => {
            const isToday = index === 6;
            const dayLabel = isToday ? 'Today' : 
              new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' });
            
            return (
              <div key={index} className="text-center">
                <div className={`text-xl mb-1 ${isToday && mood === 'none' ? 'opacity-30' : ''}`}>
                  {moodEmojis[mood]}
                </div>
                <div className="text-xs text-white/50">
                  {dayLabel}
                </div>
                {isToday && mood === 'none' && (
                  <div className="text-xs text-white/40 mt-1">
                    No entry yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Community Insights */}
      <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-300" />
          <h3 className="text-white">Community Insights</h3>
        </div>
        <div className="space-y-4">
          <div className="text-center bg-white/5 rounded-xl p-4">
            <div className="text-2xl text-white mb-2">{mockStats.communityStats.humanPreference}%</div>
            <p className="text-sm text-white/80">
              of users found the human-like advisor more helpful this week
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-2">
                Your Accuracy
              </Badge>
              <p className="text-white/80">{mockStats.communityStats.accuracyRate}%</p>
            </div>
            <div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-2">
                Community Avg
              </Badge>
              <p className="text-white/80">72%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Insights */}
      <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-amber-300" />
          <h3 className="text-white">Personal Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-300 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={() => setCurrentScreen('journal')}
          className="w-full bg-white/90 hover:bg-white text-[#B486AB] shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105"
        >
          Back to Journal
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setCurrentScreen('quiz')}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-2xl py-4"
          >
            Retake Quiz
          </Button>
          <Button
            onClick={() => setCurrentScreen('progress')}
            variant="outline"
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-2xl py-4"
          >
            View Previous Entries
          </Button>
        </div>
      </div>
    </div>
  );
}