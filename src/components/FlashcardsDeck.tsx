import React, { useState } from 'react';
import { 
  Layers, 
  RotateCw, 
  Check, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Award, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsDeckProps {
  customCards?: Flashcard[];
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({
  customCards = [],
}) => {
  const defaultCards: Flashcard[] = [
    {
      id: 'default-1',
      category: 'Oceans & Hydrology (Scenario 1)',
      front: 'Which is the largest ocean on Earth and how much surface area does it cover?',
      back: 'The Pacific Ocean is the largest, spanning over 60 million square miles (155 million sq km) and covering more than 30% of Earth’s surface—greater than all dry landmasses combined!',
    },
    {
      id: 'default-2',
      category: 'Oceans & Hydrology (Scenario 1)',
      front: 'What is the deepest known location in Earth’s oceans?',
      back: 'Challenger Deep in the Mariana Trench (western Pacific Ocean), plunging approximately 36,000 feet (nearly 11,000 meters) deep.',
    },
    {
      id: 'default-3',
      category: 'The Pythagoras Theorem (Scenario 2)',
      front: 'What is the exact algebraic statement of the Pythagoras Theorem?',
      back: 'In any Euclidean right-angled triangle, a² + b² = c², where c is the hypotenuse opposite the right angle, and a and b are the perpendicular legs.',
    },
    {
      id: 'default-4',
      category: 'The Pythagoras Theorem (Scenario 2)',
      front: 'If a right triangle has legs a = 5 and b = 12, what is the length of hypotenuse c?',
      back: 'c = 13. Since 5² + 12² = 25 + 144 = 169, and √169 = 13 (a classic Pythagorean integer triple).',
    },
    {
      id: 'default-5',
      category: 'SQL & Relational Databases (Scenario 3)',
      front: 'What is the difference between WHERE and HAVING in SQL?',
      back: 'WHERE filters individual raw rows BEFORE any aggregation occurs. HAVING filters groups AFTER GROUP BY calculations (e.g. HAVING COUNT(*) > 5).',
    },
    {
      id: 'default-6',
      category: 'SQL & Relational Databases (Scenario 3)',
      front: 'What does a LEFT OUTER JOIN return if no matching rows exist in the right table?',
      back: 'It returns all rows from the left table, with NULL values filled in for all columns from the unmatched right table.',
    },
  ];

  const [cards, setCards] = useState<Flashcard[]>([...defaultCards, ...customCards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Record<string, boolean>>({});

  // Sync if new customCards arrive
  React.useEffect(() => {
    if (customCards.length > 0) {
      setCards((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newOnes = customCards.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newOnes];
      });
    }
  }, [customCards]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleToggleMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => ({
      ...prev,
      [currentCard.id]: !prev[currentCard.id],
    }));
  };

  const masteredCount = Object.values(masteredIds).filter(Boolean).length;
  const retentionPercent = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Active Recall Flashcards</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Reinforce long-term retention with spaced repetition and interactive self-testing.
            </p>
          </div>
        </div>

        {/* Retention Meter */}
        <div className="flex items-center space-x-3 bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Retention:</span>
            <span className="font-mono text-white font-bold">
              {masteredCount} / {cards.length} Mastered ({retentionPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Flashcard Container */}
      {cards.length > 0 && currentCard ? (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Category & Index */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 border border-slate-700 font-medium">
              {currentCard.category}
            </span>
            <span className="font-mono">
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative min-h-[260px] sm:min-h-[300px] rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between border shadow-2xl ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-indigo-500/60 shadow-indigo-500/10'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isFlipped
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {isFlipped ? 'Answer & Explanation' : 'Question / Prompt'}
              </span>

              {masteredIds[currentCard.id] && (
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5 mr-1" /> Mastered
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="my-auto py-4 text-center">
              <p
                className={`text-lg sm:text-xl font-bold leading-relaxed ${
                  isFlipped ? 'text-indigo-100' : 'text-white'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Bottom Flip Hint */}
            <div className="flex items-center justify-center space-x-1 text-xs text-slate-500 font-medium">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Click anywhere on card to flip</span>
            </div>
          </div>

          {/* Navigation & Mastery Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleMastered}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 border transition-all ${
                masteredIds[currentCard.id]
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                {masteredIds[currentCard.id] ? 'Marked as Mastered' : 'Mark as Mastered'}
              </span>
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-sm">
          No flashcards yet. Generate a quiz or summarize a passage to automatically build your deck!
        </div>
      )}
    </div>
  );
};
