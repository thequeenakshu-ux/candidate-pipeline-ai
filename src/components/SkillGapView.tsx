import React, { useState, useEffect } from 'react';
import { SkillGapAnalysis, LearningRecommendation, JobCardDTO } from '../types/index.js';
import { api } from '../services/api.js';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  CheckSquare,
  Square,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface SkillGapViewProps {
  initialJobId?: string | null;
  onNavigateToJobs: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ initialJobId, onNavigateToJobs }) => {
  const [jobs, setJobs] = useState<JobCardDTO[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || '');
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const jobList = await api.getJobs();
        setJobs(jobList);
        const targetId = initialJobId || (jobList.length > 0 ? jobList[0].id : '');
        setSelectedJobId(targetId);

        const recs = await api.getLearningRecommendations();
        setRecommendations(recs);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    init();
  }, [initialJobId]);

  useEffect(() => {
    if (!selectedJobId) return;
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const data = await api.getSkillGaps(selectedJobId);
        setAnalysis(data);
      } catch (err) {
        console.error('Skill gap calculation error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [selectedJobId]);

  const handleToggleRec = async (id: string) => {
    try {
      const updated = await api.toggleRecommendation(id);
      setRecommendations((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error('Failed to toggle recommendation:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-lg border border-slate-200">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Placement Intelligence Engine
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Skill-Gap Analysis & Personalized Career Roadmap
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit your technical capability against campus job descriptions to generate prioritized learning milestones.
          </p>
        </div>

        {/* Target Job Selector */}
        <div className="shrink-0 w-full sm:w-72">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Benchmark Against Target Role:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.companyName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200 space-y-2 text-slate-500 text-sm">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          <p>Analyzing skill dependencies and prerequisites...</p>
        </div>
      ) : analysis ? (
        <>
          {/* Diagnostic Competency Matrix */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Target Competency Matrix · {analysis.jobTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between your registered profile skills and job prerequisite weights.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-700 font-semibold">
                  {analysis.gaps.filter((g) => g.status === 'HAVE').length} Verified
                </span>
                <span className="text-amber-700 font-semibold">
                  {analysis.gaps.filter((g) => g.status === 'NEEDS_IMPROVEMENT').length} In-Progress
                </span>
                <span className="text-rose-700 font-semibold">
                  {analysis.gaps.filter((g) => g.status === 'MISSING').length} Missing
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Technical Skill</th>
                    <th className="py-3 px-4">Domain Category</th>
                    <th className="py-3 px-4">Student Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Actionable Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysis.gaps.map((gap) => (
                    <tr key={gap.skillId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {gap.skillName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{gap.category}</td>
                      <td className="py-3 px-4">
                        {gap.status === 'HAVE' && (
                          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Satisfied</span>
                          </span>
                        )}
                        {gap.status === 'NEEDS_IMPROVEMENT' && (
                          <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Needs Depth</span>
                          </span>
                        )}
                        {gap.status === 'MISSING' && (
                          <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Missing</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            gap.priority === 'HIGH'
                              ? 'text-rose-600'
                              : gap.priority === 'MEDIUM'
                              ? 'text-amber-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {gap.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 leading-relaxed max-w-md">
                        {gap.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phased Roadmap Timeline */}
          <div className="p-6 bg-white rounded-lg border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Personalized 6-Week Placement Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted sprint milestones to bridge identified gaps before the on-campus assessment window.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.roadmapMilestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-indigo-600 font-bold">{ms.timeframe}</span>
                      <span className="text-slate-400 font-mono">Stage 0{idx + 1}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{ms.phase}</h4>
                    <ul className="space-y-1 text-xs text-slate-600 pt-1">
                      {ms.actionItems.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Learning Recommendations Checklist */}
          <div className="p-6 bg-white rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Targeted Learning Tasks & Implementation Checklist
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check off items as you build portfolio features or complete coding modules.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Completed:{' '}
                {recommendations.filter((r) => r.completed).length} / {recommendations.length}
              </span>
            </div>

            <div className="space-y-2">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => handleToggleRec(rec.id)}
                  className={`p-3 rounded-md border flex items-start gap-3 cursor-pointer transition-colors text-xs ${
                    rec.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <button className="mt-0.5 shrink-0">
                    {rec.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={rec.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                      {rec.recommendation}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-xs shrink-0 ${
                      rec.priority === 'HIGH' ? 'text-rose-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
