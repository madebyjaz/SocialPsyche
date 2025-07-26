import { useState } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { JournalScreen } from './components/JournalScreen';
import { AdviceScreen } from './components/AdviceScreen';
import { ProgressScreen } from './components/ProgressScreen';

export type Screen = 'landing' | 'quiz' | 'results' | 'journal' | 'advice' | 'progress';

// MBTI 16 Personality Types
export type MBTIType = 
  // Extroverted Types
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP' 
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ'
  // Introverted Types
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP';

export type PersonalityType = MBTIType;

export interface QuizAnswers {
  // E/I Questions
  energySource: number;
  socialSettings: number;
  recharge: number;
  groupSize: number;
  
  // S/N Questions
  information: number;
  future: number;
  details: number;
  possibilities: number;
  
  // T/F Questions
  decisions: number;
  criticism: number;
  values: number;
  conflict: number;
  
  // J/P Questions
  planning: number;
  deadlines: number;
  structure: number;
  flexibility: number;
}

export interface MBTIScores {
  // E/I dimension (0-100, higher = more Extroverted)
  extraversion: number;
  
  // S/N dimension (0-100, higher = more iNtuitive)
  intuition: number;
  
  // T/F dimension (0-100, higher = more Feeling)
  feeling: number;
  
  // J/P dimension (0-100, higher = more Perceiving)
  perceiving: number;
}

export interface TypeAffinityScores {
  [key: string]: number; // All 16 MBTI types with their affinity scores (0-100)
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
    // E/I Questions
    energySource: 50,
    socialSettings: 50,
    recharge: 50,
    groupSize: 50,
    
    // S/N Questions
    information: 50,
    future: 50,
    details: 50,
    possibilities: 50,
    
    // T/F Questions
    decisions: 50,
    criticism: 50,
    values: 50,
    conflict: 50,
    
    // J/P Questions
    planning: 50,
    deadlines: 50,
    structure: 50,
    flexibility: 50
  });
  
  const [personalityType, setPersonalityType] = useState<PersonalityType>('ENFP');
  const [mbtiScores, setMBTIScores] = useState<MBTIScores>({
    extraversion: 50,
    intuition: 50,
    feeling: 50,
    perceiving: 50
  });
  
  const [typeAffinityScores, setTypeAffinityScores] = useState<TypeAffinityScores>({});
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const calculateMBTIType = (answers: QuizAnswers): { type: PersonalityType; scores: MBTIScores } => {
    // Calculate E/I dimension (Extraversion vs Introversion)
    const extraversionScore = (
      answers.energySource + 
      answers.socialSettings + 
      answers.recharge + 
      answers.groupSize
    ) / 4;
    
    // Calculate S/N dimension (Sensing vs iNtuition)
    const intuitionScore = (
      answers.information + 
      answers.future + 
      (100 - answers.details) + // Reverse scored
      answers.possibilities
    ) / 4;
    
    // Calculate T/F dimension (Thinking vs Feeling)
    const feelingScore = (
      (100 - answers.decisions) + // Reverse scored
      (100 - answers.criticism) + // Reverse scored
      answers.values + 
      answers.conflict
    ) / 4;
    
    // Calculate J/P dimension (Judging vs Perceiving)
    const perceivingScore = (
      (100 - answers.planning) + // Reverse scored
      (100 - answers.deadlines) + // Reverse scored
      (100 - answers.structure) + // Reverse scored
      answers.flexibility
    ) / 4;

    const scores: MBTIScores = {
      extraversion: extraversionScore,
      intuition: intuitionScore,
      feeling: feelingScore,
      perceiving: perceivingScore
    };

    // Determining the 4-letter type
    const e_i = extraversionScore >= 50 ? 'E' : 'I';
    const s_n = intuitionScore >= 50 ? 'N' : 'S';
    const t_f = feelingScore >= 50 ? 'F' : 'T';
    const j_p = perceivingScore >= 50 ? 'P' : 'J';
    
    const personalityType = `${e_i}${s_n}${t_f}${j_p}` as PersonalityType;

    return { type: personalityType, scores };
  };

  const calculateTypeAffinityScores = (scores: MBTIScores): TypeAffinityScores => {
    const allTypes: MBTIType[] = [
      'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
      'ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP'
    ];

    const affinityScores: TypeAffinityScores = {};

    allTypes.forEach(type => {
      // Calculate affinity based on how close the user's scores are to each type's "ideal" scores
      const typeE = type[0] === 'E' ? 75 : 25; // E types lean toward 75, I types toward 25
      const typeN = type[1] === 'N' ? 75 : 25; // N types lean toward 75, S types toward 25
      const typeF = type[2] === 'F' ? 75 : 25; // F types lean toward 75, T types toward 25
      const typeP = type[3] === 'P' ? 75 : 25; // P types lean toward 75, J types toward 25

      // Calculate distance from ideal (lower distance = higher affinity)
      const eDistance = Math.abs(scores.extraversion - typeE);
      const nDistance = Math.abs(scores.intuition - typeN);
      const fDistance = Math.abs(scores.feeling - typeF);
      const pDistance = Math.abs(scores.perceiving - typeP);

      // Average distance, then convert to affinity score (0-100)
      const avgDistance = (eDistance + nDistance + fDistance + pDistance) / 4;
      const affinity = Math.max(0, 100 - (avgDistance * 2)); // Scale and invert

      affinityScores[type] = Math.round(affinity);
    });

    return affinityScores;
  };

  // Adapter to match expected prop type (screen: string) => void
  const handleSetCurrentScreen = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const navigationProps = {
    currentScreen,
    setCurrentScreen: handleSetCurrentScreen,
    quizAnswers,
    setQuizAnswers,
    personalityType,
    setPersonalityType,
    mbtiScores,
    setMBTIScores,
    typeAffinityScores,
    setTypeAffinityScores,
    journalEntries,
    addJournalEntry,
    calculateMBTIType,
    calculateTypeAffinityScores,
    setPersonalityScores: setMBTIScores,
    calculatePersonalityType: calculateMBTIType
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EACBD2] via-[#DFAEB4] to-[#DD9AC2] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        {currentScreen === 'landing' && <LandingScreen {...navigationProps} />}
        {currentScreen === 'quiz' && <QuizScreen {...navigationProps} />}
        {currentScreen === 'results' && (
          <ResultsScreen
            setCurrentScreen={navigationProps.setCurrentScreen}
            personalityType={personalityType}
            personalityScores={mbtiScores}
          />
        )}
        {currentScreen === 'journal' && <JournalScreen {...navigationProps} />}
        {currentScreen === 'advice' && <AdviceScreen {...navigationProps} />}
        {currentScreen === 'progress' && <ProgressScreen {...navigationProps} />}
        {currentScreen === 'quiz' && <QuizScreen {...navigationProps} />}
        {currentScreen === 'results' && (
          <ResultsScreen
            {...navigationProps}
            personalityScores={mbtiScores}
          />
        )}
        {currentScreen === 'journal' && <JournalScreen {...navigationProps} />}
        {currentScreen === 'advice' && <AdviceScreen {...navigationProps} />}
        {currentScreen === 'progress' && <ProgressScreen {...navigationProps} />}
      </div>
    </div>
  );
}