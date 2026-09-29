import React from 'react';
import { 
  Compass, 
  HelpCircle, 
  GraduationCap, 
  Map, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  CheckCircle, 
  BookOpen,
  Waves,
  Triangle,
  Database
} from 'lucide-react';
import { ActiveTab } from '../types';

interface ScenarioHeroProps {
  onSelectScenario: (scenarioNumber: 1 | 2 | 3) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const ScenarioHero: React.FC<ScenarioHeroProps> = ({
  onSelectScenario,
  onNavigateTab,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 mb-8 shadow-2xl">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Headline & Intro */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Next-Gen Education Assistant • Powered by Google Gemini 3.8 Flash</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Simplifying Learning with <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-violet-400">
            Intelligent Generative AI
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          EduGenie is a lightweight educational powerhouse designed for learners of all academic levels. 
          Ask questions, simplify intricate theorems, generate instant quizzes, craft personalized career roadmaps, and summarize textbook passages in seconds.
        </p>
      </div>

      {/* Three Highlighted Real-World Scenarios */}
      <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1 */}
        <div 
          onClick={() => onSelectScenario(1)}
          className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-500/10 transform hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Waves className="w-3 h-3 mr-1 text-cyan-400" /> Scenario 1
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Q&A Engine</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Oceans & Rivers Inquiry
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A student curious about Earth's hydrology asks <span className="text-cyan-300 font-medium">“Which is the largest ocean?”</span> and explores depth, volume, and oceanic ecology.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Launch Scenario 1</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Scenario 2 */}
        <div 
          onClick={() => onSelectScenario(2)}
          className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-violet-500/60 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-violet-500/10 transform hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Triangle className="w-3 h-3 mr-1 text-violet-400" /> Scenario 2
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Quiz Generator</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
              The Pythagoras Theorem
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A student tests her mathematical mastery of <span className="text-violet-300 font-medium">“The Pythagoras Theorem”</span> by generating an interactive diagnostic quiz with instant feedback.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-violet-400">
            <span>Launch Scenario 2</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Scenario 3 */}
        <div 
          onClick={() => onSelectScenario(3)}
          className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-amber-500/10 transform hover:-translate-y-1"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Database className="w-3 h-3 mr-1 text-amber-400" /> Scenario 3
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Learning Path</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              SQL Roadmap from Zero to Hero
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A learner exploring databases requests a <span className="text-amber-300 font-medium">structured SQL learning plan</span> with beginner to advanced modules, timelines, exercises & project goals.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>Launch Scenario 3</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Lightweight Edge Architecture Callout */}
      <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>
            Lightweight architecture: optimized for local efficiency on devices like <span className="text-emerald-300 font-medium">Apple Mac M1</span> and standard PCs (Intel i5, 4GB RAM).
          </span>
        </div>
        <button
          onClick={() => onNavigateTab('architecture')}
          className="text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center space-x-1"
        >
          <span>View System Requirements & Technical Architecture</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
