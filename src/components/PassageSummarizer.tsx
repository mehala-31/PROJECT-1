import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  Percent,
  CheckCircle2
} from 'lucide-react';
import { SummaryData, Flashcard } from '../types';
import { speech } from '../utils/speech';

interface PassageSummarizerProps {
  isSpeaking: boolean;
  onAudioStart: () => void;
  onAudioStop: () => void;
  onExportToFlashcards?: (cards: Flashcard[]) => void;
}

export const PassageSummarizer: React.FC<PassageSummarizerProps> = ({
  isSpeaking,
  onAudioStart,
  onAudioStop,
  onExportToFlashcards,
}) => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState<'bullet_points' | 'executive' | 'tldr' | 'study_guide'>('bullet_points');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryData | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToDeck, setSavedToDeck] = useState(false);

  const samplePassages = [
    {
      title: 'Ocean Circulation & Thermohaline Conveyor',
      content: `The global ocean conveyor belt is a constantly moving system of deep-ocean circulation driven by temperature and salinity. The ocean is not a still body of water; roughly 71 percent of Earth's surface is covered by water, and the Pacific Ocean represents the single largest reservoir, containing more than half of the planet's free water. Cold, salty water near Greenland and Iceland sinks into the deep ocean abyss, displacing deep waters southward across the Atlantic basin. This cold water traverses the Antarctic circumpolar current before resurfacing thousands of miles away in the Indian and Pacific Oceans. This vast planetary heat pump stabilizes global weather patterns and delivers vital dissolved oxygen to deep marine ecosystems. If rising temperatures melt Arctic ice sheets too rapidly, influxes of fresh water could lower salinity and potentially stall the conveyor belt, triggering drastic climate shifts.`
    },
    {
      title: 'Relational Database Integrity & ACID Principles',
      content: `In computer science and data management, relational database management systems (RDBMS) rely on the ACID paradigm to guarantee that database transactions are processed reliably. Atomicity ensures that an entire transaction occurs all at once or not at all, preventing incomplete updates. Consistency guarantees that a transaction can only bring the database from one valid state to another, maintaining all predefined constraints such as foreign keys and primary uniqueness. Isolation ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if the transactions were executed sequentially. Finally, Durability ensures that once a transaction has been committed, it will remain committed even in the event of a total system failure or power loss.`
    },
    {
      title: 'The Pythagorean Theorem in Geometry & Physics',
      content: `The Pythagorean theorem is one of the most celebrated mathematical relationships in classical geometry. Formulated for any flat Euclidean right-angled triangle, it states that the square on the hypotenuse is equal to the sum of the squares on the adjacent sides (a² + b² = c²). Far from being a mere high-school formula, the theorem forms the basis of the Cartesian distance metric in two and three dimensions: d = √((x₂ - x₁)² + (y₂ - y₁)²). In modern physics, Einstein extended this Euclidean metric into four-dimensional Minkowski spacetime to describe the invariant interval in special relativity: ds² = -c²dt² + dx² + dy² + dz², demonstrating how an ancient geometric truth underpins relativistic astrophysics.`
    }
  ];

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setSavedToDeck(false);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data: SummaryData = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to summarize passage. Please try again.');
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
      const textToRead = `${result.summary}. Key points: ${result.keyPoints.join('. ')}`;
      speech.speak(textToRead);
      onAudioStart();
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const formatted = `Summary:\n${result.summary}\n\nKey Takeaways:\n${result.keyPoints.map(k => `- ${k}`).join('\n')}\n\nDefinitions:\n${result.definitions.map(d => `${d.term}: ${d.definition}`).join('\n')}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCards = () => {
    if (!result || !onExportToFlashcards) return;
    const cards: Flashcard[] = result.definitions.map((d, idx) => ({
      id: `def-${idx}-${Date.now()}`,
      front: `What is ${d.term}?`,
      back: d.definition,
      category: 'Vocabulary & Definitions',
    }));

    result.potentialExamQuestions.forEach((q, idx) => {
      cards.push({
        id: `exam-q-${idx}-${Date.now()}`,
        front: q,
        back: `Check the summary: ${result.summary.slice(0, 180)}...`,
        category: 'Exam Review',
      });
    });

    onExportToFlashcards(cards);
    setSavedToDeck(true);
  };

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const reductionPercent = result?.originalWordCount && result?.summaryWordCount
    ? Math.max(0, Math.round(((result.originalWordCount - result.summaryWordCount) / result.originalWordCount) * 100))
    : 75;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Passage Summarizer</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Transform textbook excerpts, research abstracts, and lecture notes into concise study guides.
            </p>
          </div>
        </div>

        {/* Style Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          {(['bullet_points', 'executive', 'tldr', 'study_guide'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                style === s
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {s === 'bullet_points' ? 'Bullets' : s === 'executive' ? 'Abstract' : s === 'tldr' ? 'TL;DR' : 'Study Guide'}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Sample Passages */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 font-medium flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Load Sample Educational Passage:
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePassages.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setText(p.content)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/50 transition-all font-medium"
            >
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider">Educational Source Passage:</span>
          <span className="font-mono">{wordCount} Words</span>
        </div>

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste textbook excerpt, academic paper, historical overview, or notes here..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            EduGenie will extract high-yield concepts, definitions, and mock exam questions.
          </span>
          <button
            onClick={handleSummarize}
            disabled={loading || !text.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-cyan-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Condensing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Summarize Passage</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Summary Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Percent className="w-3 h-3 mr-0.5 inline" /> ~{reductionPercent}% Condensed
                </span>
                <span className="text-xs text-slate-400">
                  High-Yield Synthesis
                </span>
              </div>

              <div className="flex items-center space-x-2">
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
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
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

                {onExportToFlashcards && (
                  <button
                    onClick={handleCreateCards}
                    disabled={savedToDeck}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-60"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-300" />
                    <span>{savedToDeck ? 'In Deck!' : 'Save Flashcards'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Summary Text */}
            <div className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {result.summary}
            </div>

            {/* Core Bullet Points */}
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                  Core Key Points:
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {result.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Definitions & Terminology */}
            {result.definitions && result.definitions.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Essential Vocabulary & Concept Definitions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.definitions.map((def, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                      <span className="font-bold text-amber-300 block mb-0.5">{def.term}</span>
                      <p className="text-slate-300 leading-relaxed">{def.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Potential Exam Questions */}
            {result.potentialExamQuestions && result.potentialExamQuestions.length > 0 && (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1.5 text-indigo-400" />
                  Potential Exam Questions:
                </span>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  {result.potentialExamQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-indigo-400 font-bold">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
