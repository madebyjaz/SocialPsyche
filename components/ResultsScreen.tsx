import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Star, BookOpen, MessageSquare, RotateCcw, ChevronDown, ChevronUp, TrendingUp, Info } from 'lucide-react';
import { PersonalityType, PersonalityScores } from '../App';

interface ResultsScreenProps {
  setCurrentScreen: (screen: string) => void;
  personalityType: PersonalityType;
  personalityScores: PersonalityScores;
}

export function ResultsScreen({ setCurrentScreen, personalityType, personalityScores }: ResultsScreenProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSubtypesOpen, setIsSubtypesOpen] = useState(false);

  const personalityData = {
    // Introvert Subtypes
    'Social Introvert': {
      emoji: '🌙',
      category: 'Introvert',
      summary: 'You tend to feel energized by alone time, prefer small groups over crowds, and thrive in calm, low-stimulation environments.',
      description: 'Social Introverts are energized by solitude and prefer intimate gatherings over large social events. You likely enjoy deep, meaningful conversations with close friends rather than small talk with many people. You process experiences internally and may need time alone to recharge after social interactions. This doesn\'t mean you dislike people - rather, you prefer quality over quantity in your relationships and social experiences.',
      traits: ['Thoughtful', 'Selective', 'Deep', 'Calm'],
      color: 'from-[#E5B3FF] to-[#D8B4FE]'
    },
    'Anxious Introvert': {
      emoji: '🦋',
      category: 'Introvert',
      summary: 'You feel energized by solitude, may experience self-consciousness in social settings, and prefer familiar environments.',
      description: 'Anxious Introverts combine the energy preferences of introversion with some social apprehension. You may avoid social settings not because you dislike people, but because you feel nervous or self-conscious. You likely prefer familiar environments and people, and may need extra time to warm up in new situations. Your introspective nature allows you to be highly aware of social dynamics and others\' emotions.',
      traits: ['Sensitive', 'Observant', 'Cautious', 'Empathetic'],
      color: 'from-[#FFE4E1] to-[#FFC0CB]'
    },
    'Thinking Introvert': {
      emoji: '🧠',
      category: 'Introvert',
      summary: 'You feel most energized by alone time, love introspection and deep reflection, and often get lost in thought.',
      description: 'Thinking Introverts are the classic "deep thinkers" who spend much of their time in their inner world. You likely enjoy philosophical discussions, analyzing ideas, and exploring complex concepts. You may appear quiet or distant to others, but you\'re actually processing rich internal experiences. You prefer activities that allow for contemplation and may find superficial conversations draining.',
      traits: ['Analytical', 'Introspective', 'Creative', 'Independent'],
      color: 'from-[#B8E6B8] to-[#98D8C8]'
    },
    'Restrained Introvert': {
      emoji: '🎭',
      category: 'Introvert',
      summary: 'You feel energized by solitude, are reserved in nature, take time to warm up, and act deliberately in your choices.',
      description: 'Restrained Introverts are characterized by their reserved, deliberate approach to life. You likely take time to think before speaking or acting, prefer to observe before participating, and may seem formal or distant until others get to know you. You value consistency and may resist sudden changes or spontaneous activities. Your careful, measured approach often leads to well-thought-out decisions and actions.',
      traits: ['Reserved', 'Deliberate', 'Consistent', 'Reliable'],
      color: 'from-[#A8E6CF] to-[#88D8A3]'
    },
    // Extrovert Subtypes
    'Active Extrovert': {
      emoji: '⚡',
      category: 'Extrovert',
      summary: 'You feel energized by being around people, crave stimulation and high-energy settings, and thrive on activity.',
      description: 'Active Extroverts are the energetic go-getters who love high-stimulation environments. You likely enjoy physical activities, exciting experiences, and fast-paced environments. You may become restless in quiet or low-key situations and prefer to stay busy and engaged. Your energy and enthusiasm often inspire others, and you\'re probably comfortable taking on leadership roles in dynamic situations.',
      traits: ['Energetic', 'Dynamic', 'Adventurous', 'Confident'],
      color: 'from-[#FFB347] to-[#FF8C42]'
    },
    'Affiliative Extrovert': {
      emoji: '🤗',
      category: 'Extrovert',
      summary: 'You feel energized by being around people, value deep connection and warmth, and prioritize close social ties.',
      description: 'Affiliative Extroverts are the relationship builders who gain energy from forming deep, meaningful connections with others. You likely prioritize maintaining close friendships and family relationships, enjoy helping others, and feel fulfilled when you can support people you care about. You may prefer smaller, intimate gatherings where you can really connect with people rather than large, impersonal events.',
      traits: ['Caring', 'Supportive', 'Loyal', 'Nurturing'],
      color: 'from-[#FFE4E6] to-[#FFC1CC]'
    },
    'Social Extrovert': {
      emoji: '🎉',
      category: 'Extrovert',
      summary: 'You feel energized by being around people, enjoy crowds and group events, and thrive in social gatherings.',
      description: 'Social Extroverts are the classic "people persons" who genuinely enjoy large groups and social events. You likely feel comfortable being the center of attention, enjoy meeting new people, and may be seen as the social coordinator in your friend groups. You probably prefer group activities over solo pursuits and may find extended periods of solitude challenging or boring.',
      traits: ['Outgoing', 'Sociable', 'Charismatic', 'Popular'],
      color: 'from-[#87CEEB] to-[#4169E1]'
    },
    'Experimental Extrovert': {
      emoji: '🚀',
      category: 'Extrovert',
      summary: 'You feel energized by being around people, seek novelty and new experiences, and thrive on experimentation.',
      description: 'Experimental Extroverts are the adventurous explorers who gain energy from new experiences and novel situations. You likely enjoy trying new things, meeting diverse groups of people, and may become bored with routine. You probably seek out unique experiences, enjoy travel or new activities, and may be seen as spontaneous or unpredictable by others. Your openness to new experiences often leads to a rich, varied life.',
      traits: ['Adventurous', 'Curious', 'Spontaneous', 'Open-minded'],
      color: 'from-[#DDA0DD] to-[#9370DB]'
    }
  };

  const data = personalityData[personalityType];
  const isIntrovert = data.category === 'Introvert';

  // Enhanced radar chart data with proper 8-axis structure
  const radarData = [
    // Introvert subtypes (left side)
    { trait: 'Social Introvert', shortName: 'Social', value: personalityScores.social, category: 'introvert', definition: 'Prefers solitude or small groups over large social events' },
    { trait: 'Anxious Introvert', shortName: 'Anxious', value: personalityScores.anxious, category: 'introvert', definition: 'Avoids social settings due to self-consciousness or worry' },
    { trait: 'Thinking Introvert', shortName: 'Thinking ', value: personalityScores.thinking, category: 'introvert', definition: 'Introspective, reflective, often lost in thought' },
    { trait: 'Restrained Introvert', shortName: 'Restrained ', value: personalityScores.restrained, category: 'introvert', definition: 'Reserved, slow to warm up, deliberate in actions' },
    // Extrovert subtypes (right side)
    { trait: 'Active Extrovert', shortName: 'Active ', value: personalityScores.active, category: 'extrovert', definition: 'Craves stimulation and high-energy settings' },
    { trait: 'Affiliative Extrovert', shortName: 'Affiliative ', value: personalityScores.affiliative, category: 'extrovert', definition: 'Values connection, warmth, and close social ties' },
    { trait: 'Social Extrovert', shortName: 'Social', value: personalityScores.social, category: 'extrovert', definition: 'Enjoys crowds and group events' },
    { trait: 'Experimental Extrovert', shortName: 'Experimental ', value: personalityScores.experimental, category: 'extrovert', definition: 'Seeks novelty and thrives on new experiences' }
  ];

  const subtypeDefinitions = {
    'Introvert Subtypes': [
      { name: 'Social Introvert', description: 'Prefers solitude or small groups over large social events' },
      { name: 'Anxious Introvert', description: 'Avoids social settings due to self-consciousness or worry' },
      { name: 'Thinking Introvert', description: 'Introspective, reflective, often lost in thought' },
      { name: 'Restrained Introvert', description: 'Reserved, slow to warm up, deliberate in actions' }
    ],
    'Extrovert Subtypes': [
      { name: 'Active Extrovert', description: 'Craves stimulation and high-energy settings' },
      { name: 'Affiliative Extrovert', description: 'Values connection, warmth, and close social ties' },
      { name: 'Social Extrovert', description: 'Enjoys crowds and group events' },
      { name: 'Experimental Extrovert', description: 'Seeks novelty and thrives on new experiences' }
    ]
  };

  // Enhanced SVG radar chart with visual separation
  const RadarChart = () => {
    const size = 160;
    const center = size / 2;
    const radius = 55;
    const angleStep = (2 * Math.PI) / radarData.length;

    const points = radarData.map((item, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const value = Math.max(item.value / 100, 0.1); // Minimum 10% to make all points visible
      const x = center + Math.cos(angle) * radius * value;
      const y = center + Math.sin(angle) * radius * value;
      return `${x},${y}`;
    }).join(' ');

    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

    return (
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background sections for intro/extro */}
          <path
            d={`M ${center} ${center} L ${center + Math.cos(-Math.PI/2) * radius} ${center + Math.sin(-Math.PI/2) * radius} A ${radius} ${radius} 0 0 1 ${center + Math.cos(Math.PI/2) * radius} ${center + Math.sin(Math.PI/2) * radius} Z`}
            fill="rgba(180, 134, 171, 0.1)"
            stroke="none"
          />
          <path
            d={`M ${center} ${center} L ${center + Math.cos(Math.PI/2) * radius} ${center + Math.sin(Math.PI/2) * radius} A ${radius} ${radius} 0 0 1 ${center + Math.cos(-Math.PI/2) * radius} ${center + Math.sin(-Math.PI/2) * radius} Z`}
            fill="rgba(135, 206, 235, 0.1)"
            stroke="none"
          />
          
          {/* Divider line between intro/extro */}
          <line
            x1={center}
            y1={center - radius}
            x2={center}
            y2={center + radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Grid circles */}
          {gridLevels.map((level, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius * level}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {radarData.map((item, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            const isIntrovert = item.category === 'introvert';
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={isIntrovert ? "rgba(180, 134, 171, 0.4)" : "rgba(135, 206, 235, 0.4)"}
                strokeWidth="1"
              />
            );
          })}
          
          {/* Data polygon */}
          <polygon
            points={points}
            fill="rgba(255, 255, 255, 0.15)"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {radarData.map((item, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const value = Math.max(item.value / 100, 0.1);
            const x = center + Math.cos(angle) * radius * value;
            const y = center + Math.sin(angle) * radius * value;
            const isIntrovert = item.category === 'introvert';
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={isIntrovert ? "rgba(180, 134, 171, 0.9)" : "rgba(135, 206, 235, 0.9)"}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-help"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/90 text-gray-800 border border-white/20">
                    <div className="text-center">
                      <p className="text-xs">{item.trait}</p>
                      <p className="text-xs text-gray-600">{Math.round(item.value)}% strength</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </svg>
        
        {/* Labels with color coding */}
        <div className="absolute inset-0 pointer-events-none">
          {radarData.map((item, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const labelRadius = radius + 25;
            const x = center + Math.cos(angle) * labelRadius;
            const y = center + Math.sin(angle) * labelRadius;
            const isIntrovert = item.category === 'introvert';
            return (
              <div
                key={index}
                className="absolute text-xs transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: x, 
                  top: y,
                  color: isIntrovert ? 'rgba(180, 134, 171, 0.9)' : 'rgba(135, 206, 235, 0.9)'
                }}
              >
                <div className="text-center">
                  {item.shortName}
                </div>
              </div>
            );
          })}
        </div>
        
        
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-white/80 mb-2">Your Personality Type</h2>
      </div>

      {/* Main Result */}
      <div className="flex-1 space-y-6">
        {/* Large Result Badge */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className={`px-8 py-4 rounded-3xl bg-gradient-to-r ${data.color} shadow-2xl border-4 border-white/30`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{data.emoji}</span>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-white/90 text-[#B486AB] mb-2">
                    {data.category}
                  </Badge>
                  <h1 className="text-xl text-white drop-shadow-sm">
                    {personalityType}
                  </h1>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-white/90 rounded-full p-2">
              <Star className="w-5 h-5 text-[#B486AB] fill-current" />
            </div>
          </div>
        </div>

        {/* Summary Sentence */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 shadow-lg">
          <p className="text-white/90 leading-relaxed text-center">
            {data.summary}
          </p>
        </Card>

        {/* Traits */}
        <div className="flex flex-wrap gap-2 justify-center">
          {data.traits.map((trait, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/20 text-white border-white/30 rounded-full px-4 py-2"
            >
              {trait}
            </Badge>
          ))}
        </div>

        {/* Enhanced 8-Axis Radar Chart */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-white/80" />
            <h3 className="text-white text-sm">8-Trait Personality Profile</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-white/60 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/90 text-gray-800 border border-white/20">
                  <p className="text-xs max-w-48">This chart shows how your personality is distributed across different introvert & extrovert subtypes. Each axis represents one of the eight subtypes. The shape of the chart reflects your unique blend of tendencies, helping you better understand your dominant & secondary social styles. The closer a point is to the edge, the more strongly you align with that trait. </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-center">
            <RadarChart />
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(180, 134, 171, 0.7)' }}></div>
              <span className="text-white/70">Introvert Traits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(135, 206, 235, 0.7)' }}></div>
              <span className="text-white/70">Extrovert Traits</span>
            </div>
          </div>
        </Card>

        {/* Expandable Description */}
        <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
          <Card className="bg-white/15 backdrop-blur-md border-white/20 shadow-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-6 text-left hover:bg-white/5 rounded-none border-0"
              >
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-white">Learn More About Your Type</h3>
                  {isDescriptionOpen ? (
                    <ChevronUp className="w-5 h-5 text-white/80" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/80" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 pt-0">
                <p className="text-white/80 leading-relaxed text-sm">
                  {data.description}
                </p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* All Subtypes Definitions */}
        <Collapsible open={isSubtypesOpen} onOpenChange={setIsSubtypesOpen}>
          <Card className="bg-white/15 backdrop-blur-md border-white/20 shadow-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-6 text-left hover:bg-white/5 rounded-none border-0"
              >
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-white">All Personality Subtypes</h3>
                  {isSubtypesOpen ? (
                    <ChevronUp className="w-5 h-5 text-white/80" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/80" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 pt-0 space-y-4">
                {Object.entries(subtypeDefinitions).map(([category, subtypes]) => (
                  <div key={category}>
                    <h4 className="text-white/90 text-sm mb-2">{category}</h4>
                    <div className="space-y-2">
                      {subtypes.map((subtype, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            category.includes('Introvert') 
                              ? 'bg-[#B486AB]' 
                              : 'bg-[#87CEEB]'
                          }`}></div>
                          <div>
                            <p className="text-white/80 text-sm">{subtype.name.replace(/Introvert|Extrovert/, '').trim()}</p>
                            <p className="text-white/60 text-xs leading-relaxed">{subtype.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-6">
        <Button
          onClick={() => setCurrentScreen('journal')}
          className="w-full bg-white/90 hover:bg-white text-[#B486AB] shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Start Journaling
          </span>
        </Button>
        
        <Button
          onClick={() => setCurrentScreen('advice')}
          variant="outline"
          className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-2xl py-6 transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Talk to a Chatbot
          </span>
        </Button>

        <Button
          onClick={() => setCurrentScreen('quiz')}
          variant="outline"
          className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-2xl py-4 transition-all duration-300"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </span>
        </Button>
      </div>
    </div>
  );
}