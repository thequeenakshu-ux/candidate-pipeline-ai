import React, { useEffect, useState } from 'react';
import { ExplainableMatch } from '../types/index.js';
import { api } from '../services/api.js';
import { X, CheckCircle2, AlertCircle, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface ExplainableMatchModalProps {
  jobId: string;
  onClose: () => void;
  onApply: (jobId: string) => void;
  onViewRoadmap: (jobId: string) => void;
}

export const ExplainableMatchModal: React.FC<ExplainableMatchModalProps> = ({
  jobId,
  onClose,
  onApply,
  onViewRoadmap,
}) => {
  const [data, setData] = useState<ExplainableMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getExplainableMatch(jobId);
        if (isMounted) setData(res);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to calculate matching score');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Explainable Job Matching Engine
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {data ? data.jobTitle : 'Calculating Alignment...'}
            </h2>
            {data && <p className="text-xs text-slate-500">{data.companyName}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm">Evaluating skills graph and eligibility criteria...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
              {error}
            </div>
          )}

          {data && !loading && (
            <>
              {/* Score Hero Card */}
              <div className="p-5 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                    Overall Fit Score
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-bold font-mono tabular-nums text-white">
                      {data.overallMatchScore}%
                    </span>
                    <span className="text-xs text-slate-300">
                      {data.overallMatchScore >= 80
                        ? 'High Alignment'
                        : data.overallMatchScore >= 60
                        ? 'Moderate Alignment'
                        : 'Growth Opportunity'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
                    {data.explainableSummary}
                  </p>
                </div>

                <div className="w-full sm:w-auto p-3 bg-slate-800 rounded-md border border-slate-700 text-xs space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Eligibility:</span>
                    <span
                      className={`font-semibold ${
                        data.isEligible ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {data.isEligible ? 'Eligible' : 'Requires Review'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Required Skills:</span>
                    <span className="text-slate-200 font-mono tabular-nums">
                      {data.breakdown.requiredSkillsMetRatio}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">CGPA Requirement:</span>
                    <span
                      className={
                        data.breakdown.cgpaEligibility ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {data.breakdown.cgpaEligibility ? 'Passed' : 'Under Threshold'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Eligibility Reasons */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Academic & Benchmark Validation
                </div>
                <div className="space-y-1.5">
                  {data.eligibilityReasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-100"
                    >
                      {data.isEligible ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Skills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Verified Matched Skills ({data.matchedSkills.length})
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Factor Contribution: {data.breakdown.skillsMatchPercentage}%
                  </span>
                </div>
                {data.matchedSkills.length === 0 ? (
                  <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-md">
                    No direct skill matches registered. Add your technical stack in your profile.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.matchedSkills.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{s.skillName}</div>
                          <div className="text-slate-500 mt-0.5">
                            Level: <span className="text-slate-800 font-medium">{s.studentProficiency}</span>
                            {' · '}
                            <span>{s.yearsOfExperience}y exp</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-mono ${
                              s.required
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {s.required ? 'Mandatory' : 'Elective'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Skills & Recommendations */}
              {data.missingSkills.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Identified Gaps to Strengthen ({data.missingSkills.length})
                  </div>
                  <div className="space-y-2">
                    {data.missingSkills.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-amber-950">{s.skillName}</span>
                          <span className="text-xs text-amber-800 font-mono">
                            {s.required ? 'High Priority · Core Requirement' : 'Recommended Addition'}
                          </span>
                        </div>
                        <p className="text-amber-900">{s.suggestedAction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {data && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onViewRoadmap(data.jobId);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Skill Gap Roadmap</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onApply(data.jobId);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-1.5"
              >
                <span>Apply for Role</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
