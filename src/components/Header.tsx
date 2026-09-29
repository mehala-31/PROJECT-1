import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  GraduationCap, 
  Map, 
  FileText, 
  Layers, 
  Cpu, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Zap,
  BookOpen
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onLaunchScenario: (scenarioNumber: 1 | 2 | 3) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSpeaking,
  onStopSpeaking,
  onLaunchScenario,
}) => {
  const tabs = [
    { id: 'ask' as ActiveTab, label: 'Ask & Learn', icon: HelpCircle, badge: 'Q&A' },
    { id: 'simplify' as ActiveTab, label: 'Concept Simplifier', icon: Lightbulb, badge: 'ELI5' },
    { id: 'quiz' as ActiveTab, label: 'Quiz Generator', icon: GraduationCap, badge: 'Assess' },
    { id: 'roadmap' as ActiveTab, label: 'Learning Paths', icon: Map, badge: 'Structured' },
    { id: 'summarize' as ActiveTab, label: 'Passage Summarizer', icon: FileText, badge: 'TL;DR' },
    { id: 'flashcards' as ActiveTab, label: 'Flashcards Deck', icon: Layers, badge: 'Recall' },
    { id: 'architecture' as ActiveTab, label: 'System & Specs', icon: Cpu, badge: 'FastAPI/M1' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner with branding & quick actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('ask')}>
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                  Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">Genie</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                  <Zap className="w-3 h-3 mr-1 text-amber-400" /> Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Google Gemini Powered Lightweight Learning Assistant
              </p>
            </div>
          </div>

          {/* Quick Scenario Shortcuts & Audio Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Voice Control Pill */}
            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                className="flex items-center space-x-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-medium hover:bg-rose-500/30 transition-all animate-pulse"
                title="Stop reading aloud"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stop Audio</span>
              </button>
            )}

            {/* Quick Scenario Dropdown / Buttons */}
            <div className="hidden lg:flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/70 text-xs">
              <span className="px-2 text-slate-400 font-medium flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-400" /> Quick Scenarios:
              </span>
              <button
                onClick={() => onLaunchScenario(1)}
                className="px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-indigo-600 hover:text-white text-slate-300 transition-all font-medium"
                title="Scenario 1: Oceans & Rivers Q&A"
              >
                1. Oceans Q&A
              </button>
              <button
                onClick={() => onLaunchScenario(2)}
                className="px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-violet-600 hover:text-white text-slate-300 transition-all font-medium"
                title="Scenario 2: Pythagoras Theorem Quiz"
              >
                2. Pythagoras Quiz
              </button>
              <button
                onClick={() => onLaunchScenario(3)}
                className="px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-amber-600 hover:text-white text-slate-300 transition-all font-medium"
                title="Scenario 3: Structured SQL Learning Path"
              >
                3. SQL Roadmap
              </button>
            </div>

            {/* Specs / Architecture shortcut */}
            <button
              onClick={() => setActiveTab('architecture')}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center space-x-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="System Requirements & Architecture"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-medium">Specs</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
