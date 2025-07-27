import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Star, BookOpen, MessageSquare, RotateCcw, ChevronDown, ChevronUp, TrendingUp, Info, Share2, Brain, Users, Heart, Calendar, Activity } from 'lucide-react';
import { PersonalityType, MBTIScores, TypeAffinityScores } from '../App';

interface ResultsScreenProps {
  setCurrentScreen: (screen: string) => void;
  personalityType: PersonalityType;
  mbtiScores: MBTIScores;
  typeAffinityScores: TypeAffinityScores;
}

export function ResultsScreen({ setCurrentScreen, personalityType, mbtiScores, typeAffinityScores }: ResultsScreenProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');
  const [showSpiderGraph, setShowSpiderGraph] = useState(false);

  const mbtiData = {
    // Extroverted Types
    'ESTP': {
      title: 'The Dynamo',
      emoji: '⚡',
      keywords: ['Bold', 'Pragmatic', 'Energetic'],
      summary: 'Bold and pragmatic problem-solvers who love to take action and solve real-world challenges quickly. Energetic, social, and hands-on learners.',
      description: "ESTP's are outgoing \"straight shooters\" who like to take a practical approach to problem solving that will produce immediate results. They are skilled at picking up on little clues about others' personalities and feelings, which contributes to their strong social skills. They tend to be bored by abstract theories and prefer taking energetic action towards solving problems. ESTP's are spontaneous, focused on the present moment, and tend to learn best through doing.",
      color: 'from-[#FF6B6B] to-[#FF5252]'
    },
    'ESFP': {
      title: 'The Entertainer',
      emoji: '🎭',
      keywords: ['Friendly', 'Spontaneous', 'Enthusiastic'],
      summary: 'Friendly and spontaneous, ESFPs love excitement, people, and creating joyful experiences. They thrive on fun and connection.',
      description: "ESFP's live in a world of possibilities, loving people and new experiences. They tend to be outgoing, accepting, and friendly, frequently finding themselves in the role of peacemaker. ESFP's are spontaneous, optimistic, and view the world as a stage. They love working together with other people to make things happen. They tend to struggle with negative possibilities, and may become overwhelmed by negative thoughts when under stress. They love life and their bonds with other people.",
      color: 'from-[#FFA726] to-[#FF9800]'
    },
    'ENFP': {
      title: 'The Campaigner',
      emoji: '🌟',
      keywords: ['Imaginative', 'Expressive', 'Curious'],
      summary: 'Enthusiastic, imaginative, and deeply idealistic. ENFPs are connectors who see potential in people and ideas, and inspire others to dream big.',
      description: "ENFP's are warm enthusiastic people, who are typically bright and full of potential. They are imaginative and see life as being full of possibilities. They tend to have a broad range of interests and do well at the things that interest them. ENFP's quickly see connections between events and information, and are able to move forward with confidence based on what they see. When maladaptive, an ENFP has the capacity to be manipulative and use their \"gift of gab\" in negative ways.",
      color: 'from-[#66BB6A] to-[#4CAF50]'
    },
    'ENTP': {
      title: 'The Debater',
      emoji: '🧠',
      keywords: ['Quick-witted', 'Innovative', 'Clever'],
      summary: 'Quick-witted innovators who love to explore ideas and challenge assumptions. ENTPs enjoy playful argument and thinking on their feet.',
      description: "ENTP's are \"idea people\" who are able to intuitively understand people and situations with ease. They tend to be quick, alert, and outspoken. They are more interested in generating ideas and possibilities than specific plans of actions. ENTP's are fluent conversationalists who tend to enjoy lively \"sparring\" with others. They are good at reading people and tend to be bored by routine. ENTP's tend to be upbeat visionaries who value knowledge, understanding, and possibilities.",
      color: 'from-[#AB47BC] to-[#9C27B0]'
    },
    'ESTJ': {
      title: 'The Executive',
      emoji: '💼',
      keywords: ['Organized', 'Practical', 'Assertive'],
      summary: 'Organized and practical leaders who value tradition, structure, and results. They\'re dependable, action-oriented, and assertive.',
      description: "ESTJ's live in the present, honor traditions and laws, and have a clear set of standards and beliefs. They are realistic, matter-of-fact, and practical in nature. They are \"take-charge\" people who tend have a clear vision of how things should be; they easily step into leadership roles. ESTJ's excel at organizing projects and people to get things done and take care of routine details. They put a lot of effort into all that they do, valuing security and social order. When stressed, they may feel isolated from others.",
      color: 'from-[#5C6BC0] to-[#3F51B5]'
    },
    'ESFJ': {
      title: 'The Caregiver',
      emoji: '🤗',
      keywords: ['Loyal', 'Supportive', 'Caring'],
      summary: 'Loyal, supportive, and relationship-driven. ESFJs prioritize harmony and strive to make others feel valued and cared for.',
      description: "ESFJ's love people and take a warm interest in others. They have a strong desire to be liked and for things to be pleasant, which lends them to being supportive of others. ESFJ's tend to be gifted at making others feel good about themselves. They are conscientious, warm-hearted, and cooperative. They define their values externally (i.e., based on the people around them and their community, as opposed to internally), with a clear set of what those values are. They enjoy being appreciated and making contributions.",
      color: 'from-[#26A69A] to-[#009688]'
    },
    'ENFJ': {
      title: 'The Protagonist',
      emoji: '🌈',
      keywords: ['Empathetic', 'Charismatic', 'Inspiring'],
      summary: 'Empathetic, charismatic, and socially intelligent. ENFJs motivate others to grow and often take on mentorship roles.',
      description: "ENFJ's live in the world of \"people possibilities\" and have excellent people skills. They are empathetic, warm, and responsible. They tend to be quite externally focused and often neglect to spend time alone (when they have a tendency to turn to dark thoughts). They are able to see the potential in everyone, and are interested in helping others reach their potential. They may feel lonely when around people, because they tend to now show all of themselves. They are loyal, responsive to praise and criticism.",
      color: 'from-[#8BC34A] to-[#689F38]'
    },
    'ENTJ': {
      title: 'The Commander',
      emoji: '⚔️',
      keywords: ['Strategic', 'Decisive', 'Ambitious'],
      summary: 'Strategic leaders who thrive on planning, challenge, and control. ENTJs are natural organizers and strong decision-makers.',
      description: "ENTJ's are straightforward, decisive, and readily step into leadership roles. They live in a world of possibilities and view difficulties as challenges to be overcome. They are career-focused and look for ways to turn problems into solutions. ENTJ's enjoy long-term planning and goal-setting. They tend to be knowledgeable, well-informed and may be forceful in the style that the present their ideas. Although not naturally tuned into others' feelings, they often have strong sentimental streaks.",
      color: 'from-[#7E57C2] to-[#673AB7]'
    },
    // Introverted Types
    'ISTJ': {
      title: 'The Inspector',
      emoji: '🏛️',
      keywords: ['Reliable', 'Practical', 'Detail-Oriented'],
      summary: 'Responsible, orderly, and dependable. ISTJs value tradition and logic, and are often the quiet backbone of any team or system.',
      description: "ISTJ's are quiet and serious, generally interested in a peaceful and secure way of life. They are known for their responsible, dependable, and thorough natures. They are logical, practical, and work steadily towards goals without much distractibility. They are often interested in supporting traditions and establishments. ISTJ's usually take great enjoyment out of order and organization in both their home and work lives.",
      color: 'from-[#78909C] to-[#607D8B]'
    },
    'ISFJ': {
      title: 'The Defender',
      emoji: '🛡️',
      keywords: ['Nurturing', 'Protective', 'Supportive'],
      summary: 'Quiet nurturers with a deep sense of duty. ISFJs care for others selflessly and prefer stability and familiarity.',
      description: "ISFJ's are quiet, conscientious, and kind. They are responsible in nature and are committed to meeting their obligations. They have a tendency to put the needs of others above their own. Stable and practical in nature, they value security and traditions. ISFJ's tend to have a rich inner world and are highly attuned to the feelings of others. They usually are very interested in ways of serving others.",
      color: 'from-[#81C784] to-[#66BB6A]'
    },
    'INFJ': {
      title: 'The Advocate',
      emoji: '🔮',
      keywords: ['Insightful', 'Idealistic', 'Principled'],
      summary: 'Insightful, idealistic, and deeply introspective. INFJs are driven by meaning and want to help others grow authentically.',
      description: "INFJ's are quietly forceful, sensitive, and original. They seek out meaning in the connections between people, ideas, and possessions. They are curious to understand the motives of others and generally have great insight into other people. They are conscientious in nature and committed to their firm values. They tend to develop a clear vision about how to best serve the common good and then are organized and decisive in the ways in which they choose to implement this vision.",
      color: 'from-[#9575CD] to-[#7E57C2]'
    },
    'INTJ': {
      title: 'The Architect',
      emoji: '🏗️',
      keywords: ['Independent', 'Strategic', 'Analytical'],
      summary: 'Independent, strategic, and analytical. INTJs love mastering concepts and executing long-term visions.',
      description: "INTJ's are independent, original, determined, and analytical. They have a great ability to turn theories into solid plans of action. They easily see patterns in external events and are able to explain these patterns thoroughly. When they are committed, they are capable of organizing a job and carrying it through to fruition. They tend to have high standards for their own performance as well as the performance of others. They are natural leaders, but they are willing to follow if they trust existing leaders.",
      color: 'from-[#5E35B1] to-[#512DA8]'
    },
    'ISTP': {
      title: 'The Virtuoso',
      emoji: '🔧',
      keywords: ['Practical', 'Adaptable', 'Skilled'],
      summary: 'Quiet observers with a knack for mechanics, systems, and practical problem-solving. ISTPs learn by doing and exploring.',
      description: "ISTP's are quiet and reserved, interested in the way that things work. They are highly skilled with mechanical work and may be interested in/talented in extreme sports. They are flexible and tolerant, and tend to quietly observe until a solution becomes clear. They are interested in cause and effect and tend to organize facts using principles. They can be perceived as somewhat detached or analytical, and they excel at finding solutions to practical problems.",
      color: 'from-[#8D6E63] to-[#795548]'
    },
    'ISFP': {
      title: 'The Adventurer',
      emoji: '🎨',
      keywords: ['Gentle', 'Artistic', 'Spontaneous'],
      summary: 'Gentle, aesthetic-minded, and spontaneous. ISFPs seek harmony and prefer quiet creative expression over conflict.',
      description: "ISFP's are quiet, serious, sensitive, and kind. They dislike conflict and are unlikely to engage in activities where conflict is likely to occur. They are loyal and faithful, with a particular appreciation for the aesthetic. They tend to be flexible and open-minded, and are likely to be creative and original. They prefer to have their own space and work within their own time frame. They appreciate the present moment and enjoy what is going on around them in that moment.",
      color: 'from-[#A1887F] to-[#8D6E63]'
    },
    'INFP': {
      title: 'The Mediator',
      emoji: '🌸',
      keywords: ['Idealistic', 'Empathetic', 'Creative'],
      summary: 'Thoughtful, passionate idealists. INFPs care deeply about staying true to their values and understanding others.',
      description: "INFP's are reflective, quiet, and idealistic. They are loyal to their values and to the people who are important to them. They tend to have a well-developed value system, which they strive to live in accordance with. INFP's are loyal, adaptable, and laid-back (until one of their values are threatened). They have an interest in understanding and helping others.",
      color: 'from-[#CE93D8] to-[#BA68C8]'
    },
    'INTP': {
      title: 'The Thinker',
      emoji: '🤔',
      keywords: ['Logical', 'Curious', 'Original'],
      summary: 'Abstract, curious, and logical. INTPs are fascinated by how things work and love playing with complex ideas and systems.',
      description: "INTP's are original, logical, and creative thinkers. They tend to get very excited about ideas and theories. INTP's usually value logic, knowledge, and competence. They are quiet and reserved, and may be difficult to get to know well. They are usually individualistic and are uninterested in either leading or following others.",
      color: 'from-[#90A4AE] to-[#78909C]'
    }
  };

  const data = mbtiData[personalityType];

  // Helper function to get top scoring traits for both views
  const getTopTraits = (includeOpposites = false) => {
    const traits = [
      { name: 'Extraversion', value: mbtiScores.extraversion, category: 'Energy' },
      { name: 'Introversion', value: 100 - mbtiScores.extraversion, category: 'Energy' },
      { name: 'Intuition', value: mbtiScores.intuition, category: 'Information' },
      { name: 'Sensing', value: 100 - mbtiScores.intuition, category: 'Information' },
      { name: 'Feeling', value: mbtiScores.feeling, category: 'Decision' },
      { name: 'Thinking', value: 100 - mbtiScores.feeling, category: 'Decision' },
      { name: 'Perceiving', value: mbtiScores.perceiving, category: 'Lifestyle' },
      { name: 'Judging', value: 100 - mbtiScores.perceiving, category: 'Lifestyle' }
    ];

    if (!includeOpposites) {
      // For 4-axis view, only take the higher scoring trait from each pair
      const filteredTraits = [
        mbtiScores.extraversion >= 50 ? traits[0] : traits[1],
        mbtiScores.intuition >= 50 ? traits[2] : traits[3],
        mbtiScores.feeling >= 50 ? traits[4] : traits[5],
        mbtiScores.perceiving >= 50 ? traits[6] : traits[7]
      ];
      return filteredTraits
        .filter(trait => trait.value > 55) // Only show if clearly leaning
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
    }

    // For 8-axis view, show all traits above 50%
    return traits
      .filter(trait => trait.value > 50)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  };

  // Enhanced 4-Axis Bar Chart with fixes - now animates from left
  const EnhancedCognitivePreferencesChart = () => {
    const dimensions = [
      {
        name: 'Energy Source',
        leftLabel: 'Introversion',
        rightLabel: 'Extraversion',
        value: mbtiScores.extraversion,
        icon: Users,
        color: '#B486AB',
        tooltip: 'Extraversion: Draws energy from social interaction and external stimuli. Introversion: Draws energy from solitude and internal reflection.',
        leftTooltip: 'Introversion: Preference for quiet reflection, deep focus, and processing internally before speaking.',
        rightTooltip: 'Extraversion: Preference for social interaction, thinking out loud, and drawing energy from people and activities.'
      },
      {
        name: 'Information Processing',
        leftLabel: 'Sensing',
        rightLabel: 'Intuition',
        value: mbtiScores.intuition,
        icon: Brain,
        color: '#DD9AC2',
        tooltip: 'Sensing: Focuses on concrete facts and present realities. Intuition: Focuses on patterns, possibilities, and abstract concepts.',
        leftTooltip: 'Sensing: Preference for concrete facts, step-by-step processes, and practical applications.',
        rightTooltip: 'Intuition: Preference for big picture thinking, patterns, possibilities, and theoretical concepts.'
      },
      {
        name: 'Decision Making',
        leftLabel: 'Thinking',
        rightLabel: 'Feeling',
        value: mbtiScores.feeling,
        icon: Heart,
        color: '#DFAEB4',
        tooltip: 'Thinking: Makes decisions based on logic and objective analysis. Feeling: Makes decisions based on values and personal considerations.',
        leftTooltip: 'Thinking: Preference for logical analysis, objective criteria, and impersonal decision-making.',
        rightTooltip: 'Feeling: Preference for value-based decisions, considering people\'s needs, and personal impact.'
      },
      {
        name: 'Lifestyle Approach',
        leftLabel: 'Judging',
        rightLabel: 'Perceiving',
        value: mbtiScores.perceiving,
        icon: Calendar,
        color: '#EACBD2',
        tooltip: 'Judging: Prefers structure, planning, and closure. Perceiving: Prefers flexibility, spontaneity, and keeping options open.',
        leftTooltip: 'Judging: Preference for structure, planning ahead, and having things decided and organized.',
        rightTooltip: 'Perceiving: Preference for flexibility, spontaneity, and keeping options open until the last moment.'
      }
    ];

    const topTraits = getTopTraits(false);

    return (
      <div className="space-y-6">
        {dimensions.map((dim, index) => {
          const IconComponent = dim.icon;
          const leftValue = 100 - dim.value;
          const rightValue = dim.value;
          const strongerSide = rightValue > leftValue ? 'right' : 'left';
          const percentage = Math.max(leftValue, rightValue);
          const isBalanced = Math.abs(leftValue - rightValue) < 10;
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4 text-[#82667F]" />
                <h4 className="text-[#82667F] text-sm font-medium">{dim.name}</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-[#82667F]/60 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#EACBD2] text-[#82667F] border border-[#DFAEB4]/40 max-w-64">
                      <p className="text-xs">{dim.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="relative">
                {/* Enhanced background bar */}
                <div className="w-full h-10 bg-[#EACBD2]/30 rounded-lg relative overflow-hidden border border-[#DFAEB4]/20">
                  {/* Center line with tick marks */}
                  <div className="absolute left-1/2 top-0 w-px h-full bg-[#82667F]/40 transform -translate-x-1/2"></div>
                  <div className="absolute left-1/2 top-0 w-2 h-2 bg-[#82667F]/40 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
                  <div className="absolute left-1/2 bottom-0 w-2 h-2 bg-[#82667F]/40 rounded-full transform -translate-x-1/2 translate-y-1"></div>
                  
                  {/* 25% and 75% tick marks */}
                  <div className="absolute left-1/4 top-1 bottom-1 w-px bg-[#82667F]/20"></div>
                  <div className="absolute left-3/4 top-1 bottom-1 w-px bg-[#82667F]/20"></div>
                  
                  {/* Progress fill - now always animates from left */}
                  <div 
                    className="h-full rounded-lg transition-all duration-500 relative"
                    style={{
                      backgroundColor: dim.color,
                      width: `${percentage}%`,
                      marginLeft: '0', // Always start from left
                      opacity: isBalanced ? 0.6 : 1
                    }}
                  />
                  
                  {/* Enhanced labels with tooltips */}
                  <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`cursor-help transition-colors ${
                            leftValue > rightValue ? 'text-white drop-shadow-sm' : 'text-[#82667F]'
                          }`}>
                            {dim.leftLabel}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#EACBD2] text-[#82667F] border border-[#DFAEB4]/40 max-w-48">
                          <p className="text-xs">{dim.leftTooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`cursor-help transition-colors ${
                            rightValue > leftValue ? 'text-white drop-shadow-sm' : 'text-[#82667F]'
                          }`}>
                            {dim.rightLabel}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#EACBD2] text-[#82667F] border border-[#DFAEB4]/40 max-w-48">
                          <p className="text-xs">{dim.rightTooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                {/* Enhanced percentage indicator */}
                <div className="mt-2 text-center">
                  <span className="text-xs text-[#82667F]/70 font-medium">
                    {isBalanced ? (
                      'Balanced preferences'
                    ) : (
                      <>
                        <strong>{Math.round(percentage)}%</strong> {strongerSide === 'left' ? dim.leftLabel : dim.rightLabel}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Strengths Summary for 4-Axis */}
        <Card className="bg-[#EACBD2]/40 backdrop-blur-md border-[#DFAEB4]/40 p-4 shadow-sm">
          <h4 className="text-[#82667F] text-sm font-medium mb-2">Your Cognitive Strengths</h4>
          <p className="text-[#82667F]/80 text-sm">
            {topTraits.length > 0 ? (
              <>You show strongest preferences for <strong>{topTraits.map(t => t.name).join(', ')}</strong>. 
              {topTraits.length > 1 && ` Your most pronounced preference is ${topTraits[0].name} at ${Math.round(topTraits[0].value)}%.`}</>
            ) : (
              'You show balanced cognitive preferences across all MBTI dimensions, suggesting adaptability in different situations.'
            )}
          </p>
        </Card>
      </div>
    );
  };

  // Enhanced 8-Axis Spider Graph
  const EnhancedEightAxisSpiderGraph = () => {
    const size = 260;
    const center = size / 2;
    const radius = 90;
    
    // 8 traits arranged at 45° increments
    const traits = [
      {
        name: 'Extraversion',
        value: mbtiScores.extraversion,
        angle: 0, // 0°
        color: '#B486AB',
        tooltip: 'Draws energy from social interaction and external stimuli'
      },
      {
        name: 'Intuition',
        value: mbtiScores.intuition,
        angle: Math.PI / 4, // 45°
        color: '#DD9AC2',
        tooltip: 'Focuses on patterns, possibilities, and abstract concepts'
      },
      {
        name: 'Feeling',
        value: mbtiScores.feeling,
        angle: Math.PI / 2, // 90°
        color: '#DFAEB4',
        tooltip: 'Makes decisions based on values and personal considerations'
      },
      {
        name: 'Perceiving',
        value: mbtiScores.perceiving,
        angle: 3 * Math.PI / 4, // 135°
        color: '#EACBD2',
        tooltip: 'Prefers flexibility, spontaneity, and keeping options open'
      },
      {
        name: 'Introversion',
        value: 100 - mbtiScores.extraversion,
        angle: Math.PI, // 180°
        color: '#B486AB',
        tooltip: 'Draws energy from solitude and internal reflection'
      },
      {
        name: 'Sensing',
        value: 100 - mbtiScores.intuition,
        angle: 5 * Math.PI / 4, // 225°
        color: '#DD9AC2',
        tooltip: 'Focuses on concrete facts and present realities'
      },
      {
        name: 'Thinking',
        value: 100 - mbtiScores.feeling,
        angle: 3 * Math.PI / 2, // 270°
        color: '#DFAEB4',
        tooltip: 'Makes decisions based on logic and objective analysis'
      },
      {
        name: 'Judging',
        value: 100 - mbtiScores.perceiving,
        angle: 7 * Math.PI / 4, // 315°
        color: '#EACBD2',
        tooltip: 'Prefers structure, planning, and closure'
      }
    ];

    // Calculate polygon points for the filled area
    const polygonPoints = traits.map(trait => {
      const value = trait.value / 100;
      const x = center + Math.cos(trait.angle) * radius * value;
      const y = center + Math.sin(trait.angle) * radius * value;
      return `${x},${y}`;
    }).join(' ');

    // Get top 3 strongest traits
    const topTraits = getTopTraits(true);

    return (
      <div className="space-y-6">
        {/* Enhanced Spider Graph */}
        <div className="flex justify-center">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              {/* Enhanced background grid circles with labels */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, i) => (
                <g key={i}>
                  <circle
                    cx={center}
                    cy={center}
                    r={radius * level}
                    fill="none"
                    stroke="rgba(130, 102, 127, 0.08)"
                    strokeWidth="1"
                    strokeDasharray={i === 2 ? "4,4" : "none"} // Dotted 60% line
                  />
                  {/* Grid percentage labels */}
                  {i > 0 && (
                    <text
                      x={center + 5}
                      y={center - radius * level + 3}
                      className="text-xs fill-[#82667F]/40"
                      fontSize="10"
                    >
                      {Math.round(level * 100)}%
                    </text>
                  )}
                </g>
              ))}
              
              {/* Axis lines */}
              {traits.map((trait, index) => {
                const x = center + Math.cos(trait.angle) * radius;
                const y = center + Math.sin(trait.angle) * radius;
                return (
                  <line
                    key={index}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(130, 102, 127, 0.15)"
                    strokeWidth="1"
                  />
                );
              })}
              
              {/* Enhanced filled area with gradient */}
              <defs>
                <radialGradient id="spiderGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(180, 134, 171, 0.25)" />
                  <stop offset="100%" stopColor="rgba(180, 134, 171, 0.1)" />
                </radialGradient>
              </defs>
              <polygon
                points={polygonPoints}
                fill="url(#spiderGradient)"
                stroke="rgba(180, 134, 171, 0.7)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              
              {/* Enhanced data points */}
              {traits.map((trait, index) => {
                const value = trait.value / 100;
                const x = center + Math.cos(trait.angle) * radius * value;
                const y = center + Math.sin(trait.angle) * radius * value;
                const isStrong = trait.value > 60;
                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <circle
                          cx={x}
                          cy={y}
                          r={isStrong ? "5" : "4"}
                          fill={trait.color}
                          stroke="white"
                          strokeWidth={isStrong ? "3" : "2"}
                          className="cursor-help transition-all hover:scale-110"
                          style={{
                            filter: isStrong ? 'drop-shadow(0 2px 4px rgba(130, 102, 127, 0.3))' : 'none'
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#EACBD2] text-[#82667F] border border-[#DFAEB4]/40">
                        <div className="text-center">
                          <p className="text-xs font-medium">{trait.name}</p>
                          <p className="text-xs text-[#82667F]/70 font-bold">{Math.round(trait.value)}%</p>
                          <p className="text-xs text-[#82667F]/60 mt-1 max-w-40">{trait.tooltip}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </svg>
            
            {/* Enhanced trait labels */}
            <div className="absolute inset-0 pointer-events-none">
              {traits.map((trait, index) => {
                const labelRadius = radius + 30;
                const x = center + Math.cos(trait.angle) * labelRadius;
                const y = center + Math.sin(trait.angle) * labelRadius;
                const isStrong = trait.value > 60;
                return (
                  <div
                    key={index}
                    className={`absolute text-xs font-medium transform -translate-x-1/2 -translate-y-1/2 text-center transition-all ${
                      isStrong ? 'text-[#82667F] font-bold scale-105' : 'text-[#82667F]/70'
                    }`}
                    style={{ left: x, top: y }}
                  >
                    {trait.name}
                  </div>
                );
              })}
            </div>
            
            {/* Enhanced center type badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-gradient-to-r from-[#EACBD2] to-[#DFAEB4] rounded-full w-20 h-20 flex items-center justify-center shadow-lg border-3 border-white">
                <div className="text-center">
                  <div className="text-xl mb-1">{data.emoji}</div>
                  <div className="text-xs font-bold text-[#82667F]">{personalityType}</div>
                  <div className="text-xs text-[#82667F]/70 font-medium">{data.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Strengths Summary for 8-Axis */}
        <Card className="bg-[#EACBD2]/40 backdrop-blur-md border-[#DFAEB4]/40 p-4 shadow-sm">
          <h4 className="text-[#82667F] text-sm font-medium mb-2">Your Strongest Traits</h4>
          <p className="text-[#82667F]/80 text-sm mb-3">
            {topTraits.length > 0 ? (
              <>You scored highest in <strong>{topTraits.map(t => t.name).join(', ')}</strong>. 
              {topTraits.length > 1 && ` Your strongest trait is ${topTraits[0].name} at ${Math.round(topTraits[0].value)}%.`}</>
            ) : (
              'Your cognitive preferences show a balanced approach across all MBTI dimensions.'
            )}
          </p>
          {/* Trait breakdown */}
          <div className="space-y-1">
            {topTraits.slice(0, 3).map((trait, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-[#82667F]/70">#{index + 1} {trait.name}</span>
                <Badge className="bg-[#DD9AC2]/30 text-[#82667F] border-[#B486AB]/30 text-xs px-2 py-0">
                  {Math.round(trait.value)}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // 16-Type Personality Map (unchanged)
  const PersonalityMapChart = () => {
    const size = 200;
    const center = size / 2;
    const radius = 75;
    const angleStep = (2 * Math.PI) / 16;

    // Organize types by category
    const extrovertTypes = ['ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'];
    const introvertTypes = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP'];
    
    // Arrange types in a logical pattern
    const typeOrder = [
      'ENFP', 'ENTP', 'ENTJ', 'ENFJ',  // Top quadrant (extrovert intuitive)
      'ESFJ', 'ESTJ', 'ESTP', 'ESFP',  // Right quadrant (extrovert sensing)
      'ISFP', 'ISTP', 'ISTJ', 'ISFJ',  // Bottom quadrant (introvert sensing)
      'INFJ', 'INTJ', 'INTP', 'INFP'   // Left quadrant (introvert intuitive)
    ];

    const getTopTypes = () => {
      return Object.entries(typeAffinityScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type, score]) => ({ type, score }));
    };

    const topTypes = getTopTypes();

    return (
      <div className="space-y-6">
        {/* Radar Chart */}
        <div className="flex justify-center">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              {/* Background grid */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius * level}
                  fill="none"
                  stroke="rgba(130, 102, 127, 0.15)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Divider lines for categories */}
              <line
                x1={center}
                y1={center - radius}
                x2={center}
                y2={center + radius}
                stroke="rgba(130, 102, 127, 0.2)"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <line
                x1={center - radius}
                y1={center}
                x2={center + radius}
                y2={center}
                stroke="rgba(130, 102, 127, 0.2)"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              
              {/* Type points */}
              {typeOrder.map((type, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const score = typeAffinityScores[type] || 0;
                const value = Math.max(score / 100, 0.1);
                const x = center + Math.cos(angle) * radius * value;
                const y = center + Math.sin(angle) * radius * value;
                const isExtrovert = extrovertTypes.includes(type);
                const isUserType = type === personalityType;
                
                return (
                  <TooltipProvider key={type}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <circle
                          cx={x}
                          cy={y}
                          r={isUserType ? "6" : "4"}
                          fill={isExtrovert ? "#DD9AC2" : "#B486AB"}
                          stroke={isUserType ? "#82667F" : "white"}
                          strokeWidth={isUserType ? "3" : "2"}
                          className="cursor-help"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#EACBD2] text-[#82667F] border border-[#DFAEB4]/40">
                        <div className="text-center">
                          <p className="text-xs font-medium">{type} - {mbtiData[type as PersonalityType]?.title}</p>
                          <p className="text-xs text-[#82667F]/70">{score}% affinity</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
              
              {/* Connection lines for primary type */}
              {typeOrder.map((type, index) => {
                if (type !== personalityType) return null;
                const angle = angleStep * index - Math.PI / 2;
                const score = typeAffinityScores[type] || 0;
                const value = Math.max(score / 100, 0.1);
                const x = center + Math.cos(angle) * radius * value;
                const y = center + Math.sin(angle) * radius * value;
                
                return (
                  <line
                    key={`line-${type}`}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#82667F"
                    strokeWidth="2"
                    strokeOpacity="0.6"
                  />
                );
              })}
            </svg>
            
            {/* Type labels */}
            <div className="absolute inset-0 pointer-events-none">
              {typeOrder.map((type, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const labelRadius = radius + 20;
                const x = center + Math.cos(angle) * labelRadius;
                const y = center + Math.sin(angle) * labelRadius;
                const isExtrovert = extrovertTypes.includes(type);
                const isUserType = type === personalityType;
                
                return (
                  <div
                    key={`label-${type}`}
                    className={`absolute text-xs font-medium transform -translate-x-1/2 -translate-y-1/2 ${
                      isUserType ? 'text-[#82667F] font-bold' : 'text-[#82667F]/70'
                    }`}
                    style={{ left: x, top: y }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
            
            {/* Category labels */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-between text-xs text-[#82667F]/60 font-medium">
              <div className="transform -rotate-90 origin-center -ml-8">Introverts</div>
              <div className="transform rotate-90 origin-center -mr-8">Extroverts</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#B486AB]"></div>
            <span className="text-[#82667F]/80 font-medium">Introvert Types</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#DD9AC2]"></div>
            <span className="text-[#82667F]/80 font-medium">Extrovert Types</span>
          </div>
        </div>
        
        {/* Top Type Affinities */}
        <Card className="bg-[#EACBD2]/40 backdrop-blur-md border-[#DFAEB4]/40 p-4">
          <h4 className="text-[#82667F] text-sm font-medium mb-3">Your Strongest Type Affinities</h4>
          <div className="space-y-2">
            {topTypes.map(({ type, score }, index) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#82667F]/70">#{index + 1}</span>
                  <span className="text-sm font-medium text-[#82667F]">{type}</span>
                  <span className="text-xs text-[#82667F]/60">{mbtiData[type as PersonalityType]?.title}</span>
                </div>
                <Badge className="bg-[#DD9AC2]/30 text-[#82667F] border-[#B486AB]/30 text-xs">
                  {score}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-[#82667F]/90 mb-2 font-medium">Your MBTI Type</h2>
      </div>

      {/* Main Result */}
      <div className="flex-1 space-y-6">
        {/* Large Result Badge */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className={`px-8 py-6 rounded-3xl bg-gradient-to-r ${data.color} shadow-2xl border-4 border-[#EACBD2]/60`}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-4xl">{data.emoji}</span>
                  <div>
                    <h1 className="text-3xl text-white drop-shadow-sm font-bold tracking-wider">
                      {personalityType}
                    </h1>
                    <p className="text-white/90 text-sm">{data.title}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-[#EACBD2] rounded-full p-2">
              <Star className="w-5 h-5 text-[#B486AB] fill-current" />
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 justify-center">
          {data.keywords.map((keyword, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#DD9AC2]/30 text-[#82667F] border-[#B486AB]/30 rounded-full px-4 py-2 font-medium"
            >
              {keyword}
            </Badge>
          ))}
        </div>

        {/* Summary */}
        <Card className="bg-[#EACBD2]/60 backdrop-blur-md border-[#DFAEB4]/40 p-6 shadow-lg">
          <p className="text-[#82667F] leading-relaxed text-center">
            {data.summary}
          </p>
        </Card>

        {/* Enhanced Dual Visualization Tabs */}
        <Card className="bg-[#EACBD2]/60 backdrop-blur-md border-[#DFAEB4]/40 shadow-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#DFAEB4]/30 rounded-none border-b border-[#DFAEB4]/40">
              <TabsTrigger 
                value="preferences" 
                className="text-[#82667F] data-[state=active]:bg-[#DD9AC2]/30 data-[state=active]:text-[#82667F] font-medium"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Cognitive Preferences
              </TabsTrigger>
              <TabsTrigger 
                value="personality-map" 
                className="text-[#82667F] data-[state=active]:bg-[#DD9AC2]/30 data-[state=active]:text-[#82667F] font-medium"
              >
                <Brain className="w-4 h-4 mr-2" />
                Personality Map
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[#82667F] text-sm font-medium">MBTI Cognitive Preferences</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-[#82667F]/60 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#EACBD2] text-[#82667F] border border-[#DFAEB4]/40">
                        <p className="text-xs max-w-48">{!showSpiderGraph ? 'Shows your preferences across the four MBTI dimensions with enhanced visual feedback.' : 'Shows all 8 MBTI traits in a detailed spider graph with comprehensive analysis.'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Enhanced Toggle between 4-axis and 8-axis */}
                <div className="flex items-center gap-3 bg-[#EACBD2]/30 rounded-full p-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full transition-all ${
                    !showSpiderGraph ? 'text-[#82667F] bg-white/60' : 'text-[#82667F]/70'
                  }`}>4-Axis</span>
                  <Switch
                    checked={showSpiderGraph}
                    onCheckedChange={setShowSpiderGraph}
                    className="data-[state=checked]:bg-[#B486AB] data-[state=unchecked]:bg-[#DFAEB4]/50"
                  />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full transition-all ${
                    showSpiderGraph ? 'text-[#82667F] bg-white/60' : 'text-[#82667F]/70'
                  }`}>8-Axis</span>
                  <Activity className="w-4 h-4 text-[#82667F]/60" />
                </div>
              </div>
              
              {showSpiderGraph ? <EnhancedEightAxisSpiderGraph /> : <EnhancedCognitivePreferencesChart />}
            </TabsContent>
            
            <TabsContent value="personality-map" className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[#82667F] text-sm font-medium">16-Type Personality Profile</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-[#82667F]/60 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#EACBD2] text-[#82667F] border border-[#DFAEB4]/40">
                      <p className="text-xs max-w-48">Shows your affinity to all 16 MBTI types. You may share traits with multiple types beyond your primary result.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <PersonalityMapChart />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Expandable Description */}
        <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
          <Card className="bg-[#EACBD2]/60 backdrop-blur-md border-[#DFAEB4]/40 shadow-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-6 text-left hover:bg-[#DFAEB4]/20 rounded-none border-0"
              >
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-[#82667F] font-medium">Learn More About Your Type</h3>
                  {isDescriptionOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#82667F]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#82667F]" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 pt-0">
                <p className="text-[#82667F]/90 leading-relaxed text-sm">
                  {data.description}
                </p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-6">
        <Button
          onClick={() => setCurrentScreen('journal')}
          className="w-full bg-[#B486AB] hover:bg-[#82667F] text-white shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105 font-medium"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Start Journaling
          </span>
        </Button>
        
        <Button
          onClick={() => setCurrentScreen('advice')}
          variant="outline"
          className="w-full bg-[#DD9AC2]/20 hover:bg-[#DD9AC2]/40 text-[#82667F] border-[#B486AB]/30 hover:border-[#82667F]/40 rounded-2xl py-6 transition-all duration-300 font-medium"
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Talk to a Chatbot
          </span>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setCurrentScreen('quiz')}
            variant="outline"
            className="w-full bg-[#EACBD2]/40 hover:bg-[#EACBD2]/60 text-[#82667F] border-[#DFAEB4]/40 hover:border-[#B486AB]/40 rounded-2xl py-4 transition-all duration-300 font-medium"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full bg-[#EACBD2]/40 hover:bg-[#EACBD2]/60 text-[#82667F] border-[#DFAEB4]/40 hover:border-[#B486AB]/40 rounded-2xl py-4 transition-all duration-300 font-medium"
          >
            <span className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Type
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}