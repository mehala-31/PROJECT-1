/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScenarioHero } from './components/ScenarioHero';
import { AskAssistant } from './components/AskAssistant';
import { ConceptSimplifier } from './components/ConceptSimplifier';
import { QuizGenerator } from './components/QuizGenerator';
import { LearningPathRoadmap } from './components/LearningPathRoadmap';
import { PassageSummarizer } from './components/PassageSummarizer';
import { FlashcardsDeck } from './components/FlashcardsDeck';
import { SystemRequirements } from './components/SystemRequirements';
import { ActiveTab, Flashcard } from './types';
import { speech } from './utils/speech';
import { 
  Sparkles, 
  Cpu, 
  HelpCircle, 
  GraduationCap, 
  Map, 
  FileText, 
  Layers, 
  Heart,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ask');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States to pre-fill tools when launched from Scenario 1, 2, 3
  const [askInitialQuestion, setAskInitialQuestion] = useState('Which is the largest ocean?');
  const [quizInitialTopic, setQuizInitialTopic] = useState('The Pythagoras Theorem');
  const [roadmapInitialSubject, setRoadmapInitialSubject] = useState('Structured SQL Mastery');
  const [customFlashcards, setCustomFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const unsubscribe = speech.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLaunchScenario = (scenarioNum: 1 | 2 | 3) => {
    speech.stop();
    if (scenarioNum === 1) {
      setAskInitialQuestion('Which is the largest ocean?');
      setActiveTab('ask');
      showToast('Scenario 1 loaded: Asking about oceans and rivers!');
    } else if (scenarioNum === 2) {
      setQuizInitialTopic('The Pythagoras Theorem');
      setActiveTab('quiz');
      showToast('Scenario 2 loaded: Assessing understanding of The Pythagoras Theorem!');
    } else if (scenarioNum === 3) {
      setRoadmapInitialSubject('Structured SQL Mastery');
      setActiveTab('roadmap');
      showToast('Scenario 3 loaded: Structured SQL Learning Path from beginner to advanced!');
    }
  };

  const handleExportFlashcards = (newCards: Flashcard[]) => {
    setCustomFlashcards((prev) => [...prev, ...newCards]);
    showToast(`Added ${newCards.length} cards to your Flashcards Deck!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSpeaking={isSpeaking}
        onStopSpeaking={() => speech.stop()}
        onLaunchScenario={handleLaunchScenario}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium text-xs sm:text-sm shadow-2xl flex items-center space-x-2 animate-bounce border border-indigo-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hero Banner with the 3 Core Scenarios */}
        <ScenarioHero
          onSelectScenario={handleLaunchScenario}
          onNavigateTab={setActiveTab}
        />

        {/* Tab Panels */}
        <div className="mt-4">
          {activeTab === 'ask' && (
            <AskAssistant
              initialQuestion={askInitialQuestion}
              isSpeaking={isSpeaking}
              onAudioStart={() => setIsSpeaking(true)}
              onAudioStop={() => setIsSpeaking(false)}
            />
          )}

          {activeTab === 'simplify' && (
            <ConceptSimplifier
              initialConcept="The Pythagoras Theorem"
              isSpeaking={isSpeaking}
              onAudioStart={() => setIsSpeaking(true)}
              onAudioStop={() => setIsSpeaking(false)}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizGenerator
              initialTopic={quizInitialTopic}
              onExportToFlashcards={handleExportFlashcards}
            />
          )}

          {activeTab === 'roadmap' && (
            <LearningPathRoadmap
              initialSubject={roadmapInitialSubject}
            />
          )}

          {activeTab === 'summarize' && (
            <PassageSummarizer
              isSpeaking={isSpeaking}
              onAudioStart={() => setIsSpeaking(true)}
              onAudioStop={() => setIsSpeaking(false)}
              onExportToFlashcards={handleExportFlashcards}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsDeck customCards={customFlashcards} />
          )}

          {activeTab === 'architecture' && (
            <SystemRequirements />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              EG
            </div>
            <div>
              <span className="font-bold text-white">EduGenie</span>
              <span className="mx-2">•</span>
              <span>Google Gemini Powered Learning Assistant</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <span className="flex items-center">
              <Cpu className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Lightweight M1 / i5 Architecture
            </span>
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              FastAPI & Express Compatible
            </span>
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-amber-400 hover:text-amber-300 font-medium underline"
            >
              System Requirements Specs
            </button>
          </div>

          <div className="text-slate-500">
            Built for learners of all academic levels
          </div>
        </div>
      </footer>
    </div>
  );
}
