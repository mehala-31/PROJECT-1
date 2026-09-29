import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Eye,
  EyeOff,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SimplifiedConcept } from '../types';
import { speech } from '../utils/speech';

interface ConceptSimplifierProps {
  initialConcept?: string;
  isSpeaking: boolean;
  onAudioStart: () => void;
  onAudioStop: () => void;
}

export const ConceptSimplifier: React.FC<ConceptSimplifierProps> = ({
  initialConcept = '',
  isSpeaking,
  onAudioStart,
  onAudioStop,
}) => {
  const [concept, setConcept] = useState(initialConcept);
  const [targetLevel, setTargetLevel] = useState<'ELI5' | 'High School' | 'University Undergrad' | 'Analogy-First'>('ELI5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplifiedConcept | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const presets = [
    { name: 'Pythagoras Theorem', level: 'High School' as const },
    { name: 'Photosynthesis', level: 'ELI5' as const },
    { name: 'Schrödinger’s Cat & Superposition', level: 'Analogy-First' as const },
    { name: 'Recursion in Programming', level: 'ELI5' as const },
    { name: 'CRISPR Gene Editing', level: 'University Undergrad' as const },
    { name: 'Blockchain Proof of Work', level: 'High School' as const },
  ];

  const handleSimplify = async (conceptToRun?: string, levelToRun?: any) => {
    const c = (conceptToRun || concept).trim();
    const lvl = levelToRun || targetLevel;
    if (!c) return;

    if (conceptToRun) setConcept(conceptToRun);
    if (levelToRun) setTargetLevel(levelToRun);

    setLoading(true);
    setError(null);
    setShowAnswer(false);

    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: c, targetLevel: lvl }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data: SimplifiedConcept = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to simplify concept right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = () => {
    if (!result) return;
    if (isSpeaking) {
      speech.stop();
      onAudioStop();
    } else {
      const fullText = `Core analogy: ${result.coreAnalogy}. Explanation: ${result.explanation}. Common misconceptions: ${result.commonMisconceptions.join('. ')}`;
      speech.speak(fullText);
      onAudioStart();
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Concept Simplifier</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Demystify difficult concepts using creative metaphors, tailored explanations, and mental models.
            </p>
          </div>
        </div>

        {/* Level Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          {(['ELI5', 'High School', 'University Undergrad', 'Analogy-First'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setTargetLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                targetLevel === lvl
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Topics */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 font-medium flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" /> Explore Complex Concepts:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSimplify(item.name, item.level)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-500/50 transition-all font-medium"
            >
              <span>{item.name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-900 text-slate-400">
                {item.level}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSimplify();
        }}
        className="relative"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Enter any complex concept (e.g. Entropy, The Pythagoras Theorem, Fourier Transform)..."
            className="w-full pl-4 pr-32 py-3.5 sm:py-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !concept.trim()}
            className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Simplifying...</span>
              </>
            ) : (
              <>
                <span>Explain Simply</span>
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          {/* Main Simplified Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 space-y-5 shadow-xl">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Target Level: {result.targetLevel}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {result.title}
                </h3>
              </div>

              <button
                onClick={handleReadAloud}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSpeaking
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* Core Analogy Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-slate-800 border border-amber-500/30 space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                The Core Intuitive Analogy
              </span>
              <p className="text-sm sm:text-base text-slate-200 font-medium italic leading-relaxed">
                "{result.coreAnalogy}"
              </p>
            </div>

            {/* Step-by-Step Simplified Explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                How It Works Step-by-Step
              </h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                {result.explanation}
              </p>
            </div>

            {/* Visual Formula or Diagram */}
            {result.visualFormulaOrExample && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
                  Structural Model / Formula Breakdown:
                </span>
                <pre className="whitespace-pre-wrap">{result.visualFormulaOrExample}</pre>
              </div>
            )}

            {/* Common Misconceptions */}
            {result.commonMisconceptions && result.commonMisconceptions.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-400" />
                  Common Misconceptions to Avoid
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  {result.commonMisconceptions.map((misconception, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{misconception}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Check Question Card */}
            {result.quickCheckQuestion && (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-indigo-400" />
                    Quick Comprehension Check
                  </span>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center space-x-1 font-medium underline"
                  >
                    {showAnswer ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Answer</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Check Answer</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-white">
                  {result.quickCheckQuestion.question}
                </p>

                {showAnswer && (
                  <div className="pt-2 border-t border-slate-700 text-xs sm:text-sm text-emerald-300 animate-fadeIn">
                    <span className="font-bold text-emerald-400">Answer: </span>
                    {result.quickCheckQuestion.answer}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
