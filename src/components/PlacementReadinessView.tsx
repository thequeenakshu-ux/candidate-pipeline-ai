import React, { useState, useEffect } from 'react';
import { PlacementReadiness } from '../types/index.js';
import { api } from '../services/api.js';
import {
  Gauge,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
  Award,
} from 'lucide-react';

export const PlacementReadinessView: React.FC = () => {
  const [readiness, setReadiness] = useState<PlacementReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchReadiness = async () => {
    try {
      const data = await api.getReadiness();
      setReadiness(data);
    } catch (err) {
      console.error('Failed to load readiness:', err);
    } finally {
      setLoading(false);
      setRecalculating(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  const handleRecalculate = () => {
    setRecalculating(true);
    fetchReadiness();
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200 space-y-2 text-slate-500 text-sm">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        <p>Calculating placement readiness metrics across all evaluation rubrics...</p>
      </div>
    );
  }

  if (!readiness) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-600 text-sm">
        No readiness assessment available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Overall Score */}
      <div className="p-6 bg-slate-900 text-white rounded-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Automated Placement Readiness Index
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Placement Readiness</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Multi-factor predictive score computed from your validated core skills, project portfolio depth, resume keyword coverage, and assessment pass rates.
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Composite Readiness</div>
            <div className="text-4xl font-bold font-mono tabular-nums text-white mt-0.5">
              {readiness.overallScore}
              <span className="text-lg text-slate-400 font-normal">/100</span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">
              Top {100 - readiness.benchmarkPercentile}% of 2026 Cohort
            </div>
          </div>

          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
            title="Recalculate Readiness"
          >
            <RefreshCw className={`w-5 h-5 ${recalculating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Technical */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Technical Score</span>
            <span className="font-mono">Weight: 35%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {readiness.technicalScore}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Tier 1</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${readiness.technicalScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Evaluates data structures, backend algorithms, and language proficiency.
          </p>
        </div>

        {/* Pillar 2: Project */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Project Depth</span>
            <span className="font-mono">Weight: 25%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {readiness.projectScore}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Verified</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${readiness.projectScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            GitHub repository cadence, system architecture, and deployed prototypes.
          </p>
        </div>

        {/* Pillar 3: Resume */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Resume ATS</span>
            <span className="font-mono">Weight: 20%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {readiness.resumeScore}%
            </span>
            <span className="text-xs text-indigo-600 font-semibold">High Match</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${readiness.resumeScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Scans document for action verbs, quantitative metric density, and role terms.
          </p>
        </div>

        {/* Pillar 4: Interview */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Interview Ratio</span>
            <span className="font-mono">Weight: 20%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {readiness.interviewScore}%
            </span>
            <span className="text-xs text-slate-700 font-semibold">Active</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-slate-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${readiness.interviewScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Shortlist conversion rate across mock screenings and active recruiters.
          </p>
        </div>
      </div>

      {/* Qualitative Insights: Strengths vs Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 bg-white rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstrated Candidate Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {readiness.strengths.map((s, idx) => (
              <li
                key={idx}
                className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-md text-emerald-950"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas */}
        <div className="p-6 bg-white rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>High-Impact Growth Levers</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {readiness.growthAreas.map((g, idx) => (
              <li
                key={idx}
                className="p-2.5 bg-amber-50/60 border border-amber-100 rounded-md text-amber-950"
              >
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Prioritized Score-Booster Action Plan */}
      <div className="p-6 bg-white rounded-lg border border-slate-200 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Prioritized Placement Sprint Plan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Recommended tasks to raise your overall readiness score above the 90th percentile.
          </p>
        </div>

        <div className="space-y-2">
          {readiness.actionPlan.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-indigo-700">{item.area}</span>
                <p className="text-slate-800">{item.task}</p>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.estimatedDays} Days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
