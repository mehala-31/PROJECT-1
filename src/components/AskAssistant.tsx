import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Share2, 
  ArrowRight,
  Waves,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { AskResponse, AcademicLevel } from '../types';
import { speech } from '../utils/speech';

interface AskAssistantProps {
  initialQuestion?: string;
  isSpeaking: boolean;
  onAudioStart: () => void;
  onAudioStop: () => void;
}

export const AskAssistant: React.FC<AskAssistantProps> = ({
  initialQuestion = '',
  isSpeaking,
  onAudioStart,
  onAudioStop,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('High School');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick preset questions, with Scenario 1 featured first!
  const presets = [
    { label: '🌊 Which is the largest ocean?', q: 'Which is the largest ocean?', tag: 'Scenario 1' },
    { label: '🏞️ Longest river system in the world?', q: 'What is the longest river system in the world and why is there debate between the Nile and Amazon?' },
    { label: '🌿 How does photosynthesis work?', q: 'How does photosynthesis convert light energy into chemical energy?' },
    { label: '⚛️ Explain Quantum Entanglement simply', q: 'Can you explain quantum entanglement with an everyday analogy?' },
    { label: '🍎 Newton’s Laws of Motion', q: 'What are Newton’s three laws of motion with real world examples?' },
  ];

  const handleAsk = async (queryToAsk?: string) => {
    const q = (queryToAsk || question).trim();
    if (!q) return;

    if (queryToAsk) {
      setQuestion(queryToAsk);
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, academicLevel }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data: AskResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to fetch answer from EduGenie. Please verify your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = () => {
    if (!response) return;
    if (isSpeaking) {
      speech.stop();
      onAudioStop();
    } else {
      const fullText = `${response.answer}. Key takeaways: ${response.keyTakeaways.join('. ')}. Fun fact: ${response.funFact}`;
      speech.speak(fullText);
      onAudioStart();
    }
  };

  const handleCopy = () => {
    if (!response) return;
    const textToCopy = `Question: ${question}\n\nAnswer: ${response.answer}\n\nKey Takeaways:\n${response.keyTakeaways.map(t => `- ${t}`).join('\n')}\n\nFun Fact: ${response.funFact}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Ask & Learn</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Ask any academic or scientific question and get smart, concise answers.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Level Picker */}
        <div className="flex items-center space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-400 px-2 font-medium">Level:</span>
          <select
            value={academicLevel}
            onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
            className="bg-slate-900 text-white rounded-lg px-2.5 py-1 font-medium border border-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="Elementary (ELI5)">Elementary (ELI5)</option>
            <option value="Middle School">Middle School</option>
            <option value="High School">High School</option>
            <option value="College / University">College / University</option>
            <option value="Expert / Researcher">Expert / Researcher</option>
          </select>
        </div>
      </div>

      {/* Preset Topics Pill Bar */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 font-medium flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" /> Quick Inquiries (Click to run):
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(item.q)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500/50 transition-all font-medium"
            >
              <span>{item.label}</span>
              {item.tag && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {item.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="relative"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Which is the largest ocean and how deep is the Mariana Trench?"
            className="w-full pl-4 pr-32 py-3.5 sm:py-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Ask Genie</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Result Display */}
      {response && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          {/* Main Answer Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 space-y-4 shadow-xl">
            {/* Answer Header with Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                  EduGenie Synthesis
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {response.academicLevel}
                </span>
              </div>

              {/* Action Buttons: Read Aloud & Copy */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReadAloud}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSpeaking
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                  title="Listen with Text-to-Speech"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                  title="Copy formatted answer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Answer Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {response.answer}
            </div>

            {/* Key Takeaways */}
            {response.keyTakeaways && response.keyTakeaways.length > 0 && (
              <div className="mt-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center">
                  <Check className="w-4 h-4 mr-1.5 text-indigo-400" />
                  Key Takeaways
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {response.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fun Fact Card */}
            {response.funFact && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 flex-shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Did You Know?
                  </span>
                  <p className="text-xs sm:text-sm text-amber-100/90 mt-0.5">
                    {response.funFact}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Follow-Ups */}
          {response.suggestedFollowUps && response.suggestedFollowUps.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                Suggested Next Inquiries:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {response.suggestedFollowUps.map((followUp, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(followUp)}
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 text-left text-xs sm:text-sm text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>{followUp}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
