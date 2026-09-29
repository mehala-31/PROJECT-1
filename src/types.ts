export type AcademicLevel = 'Elementary (ELI5)' | 'Middle School' | 'High School' | 'College / University' | 'Expert / Researcher';

export interface AskResponse {
  answer: string;
  keyTakeaways: string[];
  funFact: string;
  suggestedFollowUps: string[];
  academicLevel: string;
}

export interface SimplifiedConcept {
  title: string;
  targetLevel: string;
  coreAnalogy: string;
  explanation: string;
  visualFormulaOrExample?: string;
  commonMisconceptions: string[];
  quickCheckQuestion: {
    question: string;
    answer: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface QuizData {
  title: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface LearningPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  level: string;
  objectives: string[];
  keyTopics: string[];
  practiceProject: string;
  exercises: string[];
  resourceSuggestions: string[];
}

export interface LearningPathData {
  title: string;
  subject: string;
  totalWeeks: number;
  prerequisites: string[];
  careerOutcomes: string[];
  phases: LearningPhase[];
  tipsForSuccess: string[];
}

export interface SummaryData {
  summary: string;
  keyPoints: string[];
  definitions: Array<{ term: string; definition: string }>;
  potentialExamQuestions: string[];
  originalWordCount?: number;
  summaryWordCount?: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

export type ActiveTab = 'ask' | 'simplify' | 'quiz' | 'roadmap' | 'summarize' | 'flashcards' | 'architecture';
