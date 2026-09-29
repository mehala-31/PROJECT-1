import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  Layers, 
  RefreshCw,
  Lightbulb,
  FileText,
  Triangle
} from 'lucide-react';
import { QuizData, QuizQuestion, Flashcard } from '../types';

interface QuizGeneratorProps {
  initialTopic?: string;
  onExportToFlashcards?: (cards: Flashcard[]) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  initialTopic = 'The Pythagoras Theorem',
  onExportToFlashcards,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [mode, setMode] = useState<'topic' | 'text'>('topic');
  const [sourceText, setSourceText] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz state
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [flashcardsSaved, setFlashcardsSaved] = useState(false);

  const presets = [
    { label: '📐 The Pythagoras Theorem', val: 'The Pythagoras Theorem', tag: 'Scenario 2' },
    { label: '🌊 Oceanography & Deep Trenches', val: 'Oceanography and Marine Geology', tag: 'Scenario 1+' },
    { label: '💾 SQL Joins & Relational Logic', val: 'SQL Relational Queries & Joins', tag: 'Scenario 3+' },
    { label: '🧬 DNA Transcription & Translation', val: 'DNA Transcription and Translation', tag: 'Biology' },
    { label: '⚙️ Newton’s Laws of Gravitation', val: 'Newtonian Mechanics & Universal Gravitation', tag: 'Physics' },
  ];

  const handleGenerateQuiz = async (customTopic?: string) => {
    const t = (customTopic || topic).trim();
    if (mode === 'topic' && !t) return;
    if (mode === 'text' && !sourceText.trim()) return;

    if (customTopic) setTopic(customTopic);

    setLoading(true);
    setError(null);
    setQuiz(null);
    setUserAnswers({});
    setShowHints({});
    setQuizSubmitted(false);
    setFlashcardsSaved(false);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: mode === 'topic' ? t : 'Custom Study Material',
          difficulty,
          questionCount,
          sourceText: mode === 'text' ? sourceText : '',
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate quiz (${res.status})`);
      }

      const data: QuizData = await res.json();
      setQuiz(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to generate quiz. Please check parameters and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleHint = (questionId: number) => {
    setShowHints((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const total = quiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const handleSaveAsFlashcards = () => {
    if (!quiz || !onExportToFlashcards) return;
    const cards: Flashcard[] = quiz.questions.map((q) => ({
      id: `quiz-${quiz.topic}-${q.id}-${Date.now()}`,
      front: q.question,
      back: `${q.options[q.correctIndex]}\n\nExplanation: ${q.explanation}`,
      category: quiz.topic,
    }));
    onExportToFlashcards(cards);
    setFlashcardsSaved(true);
  };

  const scoreData = quizSubmitted ? calculateScore() : null;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Interactive Quiz Generator</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Assess your mastery of any topic or textbook passage with instant AI grading and explanations.
            </p>
          </div>
        </div>

        {/* Mode Switcher: Topic vs Text */}
        <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setMode('topic')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              mode === 'topic'
                ? 'bg-violet-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            By Topic
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              mode === 'text'
                ? 'bg-violet-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            From Study Text
          </button>
        </div>
      </div>

      {/* Preset Topics Bar */}
      {mode === 'topic' && (
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-medium flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-violet-400" /> Quick Quizzes:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleGenerateQuiz(item.val)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-violet-600/20 text-slate-300 hover:text-violet-200 border border-slate-700 hover:border-violet-500/50 transition-all font-medium"
              >
                <span>{item.label}</span>
                {item.tag && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/40">
                    {item.tag}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Configuration Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        {mode === 'topic' ? (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quiz Topic or Concept
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The Pythagoras Theorem, Cellular Respiration, World War I Alliances..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Paste Educational Passage or Notes
            </label>
            <textarea
              rows={4}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste a paragraph from your textbook, lecture notes, or study guide..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}

        {/* Secondary options: Difficulty & Question Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="bg-slate-950 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-violet-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Questions:</span>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="bg-slate-950 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-violet-500"
              >
                <option value={3}>3 Questions</option>
                <option value={4}>4 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={8}>8 Questions</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleGenerateQuiz()}
            disabled={loading || (mode === 'topic' ? !topic.trim() : !sourceText.trim())}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Quiz</span>
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

      {/* Active Quiz View */}
      {quiz && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quiz Header with progress & metadata */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {quiz.difficulty} Level
                </span>
                <span className="text-xs text-slate-400">
                  {quiz.questions.length} Questions
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                {quiz.title}
              </h3>
            </div>

            {/* Answered Counter */}
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">
                Answered: {Object.keys(userAnswers).length} / {quiz.questions.length}
              </span>
              <div className="w-32 bg-slate-800 rounded-full h-2 mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(Object.keys(userAnswers).length / quiz.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {quiz.questions.map((q, idx) => {
              const selectedOption = userAnswers[q.id];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = isAnswered && selectedOption === q.correctIndex;
              const showHint = showHints[q.id];

              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-slate-900 border transition-all ${
                    quizSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/40 shadow-emerald-500/5'
                        : 'border-rose-500/40 shadow-rose-500/5'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Question Prompt */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                        {idx + 1}
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    {!quizSubmitted && (
                      <button
                        onClick={() => toggleHint(q.id)}
                        className="text-xs text-slate-400 hover:text-amber-400 flex items-center space-x-1 flex-shrink-0 p-1"
                        title="Toggle hint"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Hint</span>
                      </button>
                    )}
                  </div>

                  {/* Hint Card */}
                  {showHint && !quizSubmitted && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Hint: </span>
                        <span>{q.hint}</span>
                      </div>
                    </div>
                  )}

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOption === optIdx;
                      let optionClasses =
                        'p-3 rounded-xl text-xs sm:text-sm text-left font-medium border transition-all flex items-center justify-between ';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionClasses +=
                            'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold';
                        } else if (isOptionSelected && optIdx !== q.correctIndex) {
                          optionClasses +=
                            'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold';
                        } else {
                          optionClasses +=
                            'bg-slate-950/60 border-slate-800 text-slate-400 opacity-60';
                        }
                      } else {
                        if (isOptionSelected) {
                          optionClasses +=
                            'bg-violet-600/30 border-violet-500 text-white font-bold ring-1 ring-violet-500';
                        } else {
                          optionClasses +=
                            'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white cursor-pointer';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={optionClasses}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                          {quizSubmitted && isOptionSelected && optIdx !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Post-Submit Explanation */}
                  {quizSubmitted && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-violet-400 uppercase tracking-wider block">
                        Explanation:
                      </span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Bar: Submit or Score Result */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            {!quizSubmitted ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Select your answers above, then submit for instant scoring and explanations.
                </span>
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Answers & View Grade
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-amber-500/10 border border-violet-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                      <Award className="w-7 h-7 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xl font-black text-white">
                          Score: {scoreData?.correct} / {scoreData?.total} ({scoreData?.percentage}%)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {scoreData?.percentage === 100
                          ? 'Outstanding! Perfect score and complete concept mastery.'
                          : (scoreData?.percentage || 0) >= 70
                          ? 'Great job! You have a solid grasp of this topic.'
                          : 'Good start. Review the explanations above to reinforce weaker points.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Retake & Flashcards */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setUserAnswers({});
                        setShowHints({});
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>

                    {onExportToFlashcards && (
                      <button
                        onClick={handleSaveAsFlashcards}
                        disabled={flashcardsSaved}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-60"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-300" />
                        <span>{flashcardsSaved ? 'Saved to Decks!' : 'Export as Flashcards'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
