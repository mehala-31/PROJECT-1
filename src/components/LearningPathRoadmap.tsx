import React, { useState } from 'react';
import { 
  Map, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Briefcase, 
  BookOpen, 
  Code, 
  ExternalLink, 
  Download, 
  RefreshCw,
  Clock,
  Target,
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LearningPathData } from '../types';

interface LearningPathRoadmapProps {
  initialSubject?: string;
}

export const LearningPathRoadmap: React.FC<LearningPathRoadmapProps> = ({
  initialSubject = 'Structured SQL Mastery',
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [targetGoal, setTargetGoal] = useState('Career Ready & Real-World Projects');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<LearningPathData | null>(null);

  // Track completed objectives across all phases
  const [completedObjectives, setCompletedObjectives] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const presets = [
    { name: '💾 Structured SQL Mastery', query: 'Structured Query Language (SQL)', tag: 'Scenario 3' },
    { name: '🐍 Python for Data Science', query: 'Python for Data Analysis and Science', tag: 'Hot' },
    { name: '🤖 AI & Machine Learning Foundations', query: 'Machine Learning and Neural Networks', tag: 'Trending' },
    { name: '⚛️ Modern Fullstack React & Node', query: 'Fullstack Web Development with React and Node', tag: 'Web Dev' },
    { name: '📐 Calculus & Linear Algebra', query: 'Calculus and Linear Algebra for Computing', tag: 'STEM' },
  ];

  const handleGenerateRoadmap = async (customSubject?: string) => {
    const s = (customSubject || subject).trim();
    if (!s) return;

    if (customSubject) setSubject(customSubject);

    setLoading(true);
    setError(null);
    setCompletedObjectives({});

    try {
      const res = await fetch('/api/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: s,
          currentLevel,
          targetGoal,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate learning path (${res.status})`);
      }

      const data: LearningPathData = await res.json();
      setRoadmap(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to generate roadmap right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleObjective = (key: string) => {
    setCompletedObjectives((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePhase = (phaseNum: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNum]: !prev[phaseNum],
    }));
  };

  // Calculate overall roadmap progress
  const totalObjectives = roadmap
    ? roadmap.phases.reduce((acc, phase) => acc + phase.objectives.length, 0)
    : 0;
  const completedCount = Object.values(completedObjectives).filter(Boolean).length;
  const progressPercent = totalObjectives > 0 ? Math.round((completedCount / totalObjectives) * 100) : 0;

  const handleExportMarkdown = () => {
    if (!roadmap) return;
    let md = `# ${roadmap.title}\n\n`;
    md += `**Subject:** ${roadmap.subject}\n`;
    md += `**Duration:** ${roadmap.totalWeeks} Weeks\n`;
    md += `**Career Targets:** ${roadmap.careerOutcomes.join(', ')}\n\n`;
    md += `## Prerequisites\n${roadmap.prerequisites.map((p) => `- [ ] ${p}`).join('\n')}\n\n`;

    roadmap.phases.forEach((phase) => {
      md += `### Phase ${phase.phaseNumber}: ${phase.title} (${phase.duration} • ${phase.level})\n`;
      md += `**Objectives:**\n${phase.objectives.map((o) => `- [ ] ${o}`).join('\n')}\n`;
      md += `**Key Topics:**\n${phase.keyTopics.map((t) => `- ${t}`).join('\n')}\n`;
      md += `**Practice Project:** ${phase.practiceProject}\n`;
      md += `**Exercises:**\n${phase.exercises.map((e) => `- ${e}`).join('\n')}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.subject.replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Personalized Learning Paths</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Structured multi-week curriculums with timelines, practice projects, and curated milestones.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Paths Bar */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 font-medium flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" /> Featured Curriculums:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerateRoadmap(item.query)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-500/50 transition-all font-medium"
            >
              <span>{item.name}</span>
              {item.tag && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {item.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Target Subject or Skill Domain
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Structured SQL, Machine Learning, Organic Chemistry..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Starting Point:</span>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value as any)}
                className="bg-slate-950 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="Beginner">Beginner (Zero Experience)</option>
                <option value="Intermediate">Intermediate (Basic Foundation)</option>
                <option value="Advanced">Advanced (Deep Dive)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Target Goal:</span>
              <select
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className="bg-slate-950 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="Career Ready & Real-World Projects">Career Ready & Real-World</option>
                <option value="Academic Excellence & Exams">Academic Exams / Course Top-Score</option>
                <option value="Practical Hobby / Prototype Building">Hands-on Prototype Builder</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleGenerateRoadmap()}
            disabled={loading || !subject.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Designing Curriculum...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Learning Plan</span>
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

      {/* Generated Roadmap Display */}
      {roadmap && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overview Hero Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Calendar className="w-3 h-3 mr-1 inline" /> {roadmap.totalWeeks} Weeks Timeline
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {roadmap.phases.length} Progressive Phases
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {roadmap.title}
                </h3>
              </div>

              {/* Progress and Export */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between space-x-4 text-xs text-slate-400 font-mono mb-1">
                    <span>Curriculum Progress:</span>
                    <span className="text-amber-400 font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleExportMarkdown}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all shadow-sm"
                  title="Export Markdown syllabus"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Export Syllabus</span>
                </button>
              </div>
            </div>

            {/* Prerequisites & Career Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Recommended Prerequisites:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.prerequisites.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Career / Academic Outcomes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.careerOutcomes.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sequential Phases List */}
          <div className="space-y-4">
            {roadmap.phases.map((phase) => {
              const isExpanded = expandedPhases[phase.phaseNumber] !== false;
              return (
                <div
                  key={phase.phaseNumber}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg transition-all"
                >
                  {/* Phase Header */}
                  <div
                    onClick={() => togglePhase(phase.phaseNumber)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            {phase.duration} • {phase.level}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {phase.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                        {phase.objectives.length} Milestones
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Phase Content */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-5 pt-1 space-y-4 border-t border-slate-800/60 bg-slate-950/40">
                      {/* Objectives Checklist */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                          Milestones & Objectives (Click to check off):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {phase.objectives.map((obj, oIdx) => {
                            const key = `p${phase.phaseNumber}-o${oIdx}`;
                            const isDone = completedObjectives[key];
                            return (
                              <button
                                key={oIdx}
                                onClick={() => toggleObjective(key)}
                                className={`p-2.5 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-start space-x-2.5 transition-all ${
                                  isDone
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 line-through'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                )}
                                <span className="flex-1">{obj}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Key Topics Covered */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                          Core Topics Covered:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.keyTopics.map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700/80 font-mono"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Practice Project Card */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-amber-500/10 border border-indigo-500/30 flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 flex-shrink-0">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                            Hands-On Practice Project:
                          </span>
                          <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                            {phase.practiceProject}
                          </p>
                        </div>
                      </div>

                      {/* Exercises & Resources */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="font-bold text-slate-400 uppercase tracking-wider block">
                            Practice Exercises:
                          </span>
                          <ul className="space-y-1 text-slate-300">
                            {phase.exercises.map((ex, exIdx) => (
                              <li key={exIdx} className="flex items-start space-x-1.5">
                                <span className="text-amber-400 font-bold">›</span>
                                <span>{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="font-bold text-slate-400 uppercase tracking-wider block">
                            Curated Resources:
                          </span>
                          <ul className="space-y-1 text-slate-300">
                            {phase.resourceSuggestions.map((res, resIdx) => (
                              <li key={resIdx} className="flex items-start space-x-1.5">
                                <BookOpen className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                                <span>{res}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Success Tips Banner */}
          {roadmap.tipsForSuccess && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
                <Target className="w-4 h-4 mr-1.5 text-amber-400" />
                EduGenie Habits for High Retention:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                {roadmap.tipsForSuccess.map((tip, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-0.5">Tip #{idx + 1}</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
