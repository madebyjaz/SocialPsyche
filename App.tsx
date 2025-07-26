import React from 'react';
import { useState } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { JournalScreen } from './components/JournalScreen';
import { AdviceScreen } from './components/AdviceScreen';
import { ProgressScreen } from './components/ProgressScreen';

export type Screen = 'landing' | 'quiz' | 'results' | 'journal' | 'advice' | 'progress';

export type IntrovertSubtype = 'Social Introvert' | 'Anxious Introvert' | 'Thinking Introvert' | 'Restrained Introvert';
export type ExtrovertSubtype = 'Active Extrovert' | 'Affiliative Extrovert' | 'Social Extrovert' | 'Experimental Extrovert';
export type PersonalityType = IntrovertSubtype | ExtrovertSubtype;

export interface QuizAnswers {
  energy: number;
  socialSettings: number;
  decisions: number;
  stress: number;
  communication: number;
  gatherings: number;
  weekend: number;
  newEnvironments: number;
  thoughtMotion: number;
  recharge: number;
  meeting: number;
  reflection: number;
  activities: number;
  avoidance: number;
  actions: number;
}

export interface PersonalityScores {
  introversion: number;
  extroversion: number;
  social: number;
  anxious: number;
  thinking: number;
  restrained: number;
  active: number;
  affiliative: number;
  experimental: number;
}

export interface JournalEntry {
  id: string;
  prompt: string;
  content: string;
  mood: string;
  date: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    energy: 50,
    socialSettings: 50,
    decisions: 50,
    stress: 50,
    communication: 50,
    gatherings: 50,
    weekend: 50,
    newEnvironments: 50,
    thoughtMotion: 50,
    recharge: 50,
    meeting: 50,
    reflection: 50,
    activities: 50,
    avoidance: 50,
    actions: 50
  });
  const [personalityType, setPersonalityType] = useState<PersonalityType>('Social Introvert');
  const [personalityScores, setPersonalityScores] = useState<PersonalityScores>({
    introversion: 0,
    extroversion: 0,
    social: 0,
    anxious: 0,
    thinking: 0,
    restrained: 0,
    active: 0,
    affiliative: 0,
    experimental: 0
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const calculatePersonalityType = (answers: QuizAnswers): { type: PersonalityType; scores: PersonalityScores } => {
    const scores: PersonalityScores = {
      introversion: 0,
      extroversion: 0,
      social: 0,
      anxious: 0,
      thinking: 0,
      restrained: 0,
      active: 0,
      affiliative: 0,
      experimental: 0
    };

    // Calculate introversion vs extroversion
    const introQuestions = [answers.energy, answers.stress, answers.recharge, answers.reflection];
    const extroQuestions = [answers.socialSettings, answers.gatherings, answers.weekend, answers.meeting];
    
    scores.introversion = introQuestions.reduce((sum, val) => sum + (100 - val), 0) / introQuestions.length;
    scores.extroversion = extroQuestions.reduce((sum, val) => sum + val, 0) / extroQuestions.length;

    // Calculate subtype scores
    scores.social = (100 - answers.gatherings + 100 - answers.socialSettings) / 2;
    scores.anxious = (100 - answers.avoidance + answers.newEnvironments) / 2;
    scores.thinking = (100 - answers.thoughtMotion + 100 - answers.reflection) / 2;
    scores.restrained = (100 - answers.actions + 100 - answers.meeting) / 2;
    
    scores.active = (answers.activities + answers.thoughtMotion) / 2;
    scores.affiliative = (answers.socialSettings + answers.recharge) / 2;
    scores.experimental = (answers.weekend + answers.activities) / 2;

    // Determine primary orientation
    const isIntrovert = scores.introversion > scores.extroversion;
    
    let personalityType: PersonalityType;
    
    if (isIntrovert) {
      const introvertScores = {
        'Social Introvert': scores.social,
        'Anxious Introvert': scores.anxious,
        'Thinking Introvert': scores.thinking,
        'Restrained Introvert': scores.restrained
      };
      personalityType = Object.entries(introvertScores).reduce((a, b) => 
        introvertScores[a[0] as IntrovertSubtype] > introvertScores[b[0] as IntrovertSubtype] ? a : b
      )[0] as IntrovertSubtype;
    } else {
      const extrovertScores = {
        'Active Extrovert': scores.active,
        'Affiliative Extrovert': scores.affiliative,
        'Social Extrovert': scores.social,
        'Experimental Extrovert': scores.experimental
      };
      personalityType = Object.entries(extrovertScores).reduce((a, b) => 
        extrovertScores[a[0] as ExtrovertSubtype] > extrovertScores[b[0] as ExtrovertSubtype] ? a : b
      )[0] as ExtrovertSubtype;
    }

    return { type: personalityType, scores };
  };

  const navigationProps = {
    currentScreen,
    setCurrentScreen,
    quizAnswers,
    setQuizAnswers,
    personalityType,
    setPersonalityType,
    personalityScores,
    setPersonalityScores,
    journalEntries,
    addJournalEntry,
    calculatePersonalityType
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EACBD2] via-[#DFAEB4] to-[#DD9AC2] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        {currentScreen === 'landing' && <LandingScreen {...navigationProps} />}
        {currentScreen === 'quiz' && <QuizScreen {...navigationProps} />}
        {currentScreen === 'results' && <ResultsScreen {...navigationProps} />}
        {currentScreen === 'journal' && <JournalScreen {...navigationProps} />}
        {currentScreen === 'advice' && <AdviceScreen {...navigationProps} />}
        {currentScreen === 'progress' && <ProgressScreen {...navigationProps} />}
      </div>
    </div>
  );
}