import React, { useState, useEffect } from 'react';
import { PlacementAnalytics } from '../types/index.js';
import { api } from '../services/api.js';
import {
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Award,
  Layers,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const [analytics, setAnalytics] = useState<PlacementAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-sm space-y-2">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        <p>Aggregating institutional placement analytics and company data...</p>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-lg border border-slate-200">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          University Placement Cell Intelligence
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-1">
          Campus Recruitment & Compensation Analytics (2026 Batch)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Verified cohort placement rates, department-wise CTC distributions, and corporate hiring trends.
        </p>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Placement Rate</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {analytics.placementRate}%
          </div>
          <div className="text-xs text-emerald-600 font-medium">
            {analytics.placedStudents} / {analytics.totalStudents} Students
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Average Package</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
            ₹{analytics.averageCtcLpa}L
          </div>
          <div className="text-xs text-slate-500 font-mono">Median: ₹{analytics.medianCtcLpa}L</div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Highest Offered CTC</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            ₹{analytics.highestCtcLpa}L
          </div>
          <div className="text-xs text-emerald-600 font-medium">+18% YoY Increase</div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Recruiting Partners</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {analytics.activeCompanies}
          </div>
          <div className="text-xs text-slate-500">Fintech, Cloud & AI</div>
        </div>

        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Total Campus Openings</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {analytics.totalOpenings}
          </div>
          <div className="text-xs text-slate-500 font-mono">3.4:1 Offer Ratio</div>
        </div>
      </div>

      {/* Department-wise Placement Performance Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Branch-wise Placement Performance & CTC Benchmark
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized cohort statistics across engineering departments.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Academic Branch</th>
                <th className="py-3 px-4 text-right">Cohort Size</th>
                <th className="py-3 px-4 text-right">Students Placed</th>
                <th className="py-3 px-4 text-right">Placement %</th>
                <th className="py-3 px-4 text-right">Average CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {analytics.branchStatistics.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{b.branch}</td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-600">{b.total}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-semibold text-slate-900">
                    {b.placed}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className="text-emerald-700 font-bold">{b.placementPercentage}%</span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-bold text-indigo-700">
                    ₹{b.avgCtcLpa} LPA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column: Top Recruiters + In-Demand Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Recruiters */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900">Top Recruiting Partners</h3>
          <p className="text-xs text-slate-500">Corporate partners leading campus intake volume.</p>
          <div className="divide-y divide-slate-100 text-xs">
            {analytics.topRecruitingCompanies.map((c, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{c.companyName}</div>
                  <div className="text-slate-400 font-mono mt-0.5">Average: ₹{c.avgPackage} LPA</div>
                </div>
                <div className="font-mono text-slate-700 font-bold tabular-nums">
                  {c.hires} Hires
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills Demand */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900">High-Growth Skill Index</h3>
          <p className="text-xs text-slate-500">Top required competencies demanded across company job postings.</p>
          <div className="divide-y divide-slate-100 text-xs">
            {analytics.topDemandedSkills.map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{s.skillName}</div>
                  <div className="text-slate-400 font-mono mt-0.5">{s.jobCount} Active Openings</div>
                </div>
                <div className="text-xs text-emerald-700 font-mono font-bold">
                  {s.growthTrend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recruitment Funnel */}
      <div className="p-6 bg-white rounded-lg border border-slate-200 space-y-4 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Placement Screening Funnel</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversion stages across application submissions, coding rounds, technical interviews, and selections.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <div className="text-xs text-slate-500">Submitted</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {analytics.applicationFunnel.applied}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">100%</div>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <div className="text-xs text-slate-500">Shortlisted</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {analytics.applicationFunnel.shortlisted}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              {Math.round((analytics.applicationFunnel.shortlisted / analytics.applicationFunnel.applied) * 100)}%
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <div className="text-xs text-slate-500">Assessments</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {analytics.applicationFunnel.assessment}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              {Math.round((analytics.applicationFunnel.assessment / analytics.applicationFunnel.applied) * 100)}%
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <div className="text-xs text-slate-500">Interviews</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {analytics.applicationFunnel.interview}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              {Math.round((analytics.applicationFunnel.interview / analytics.applicationFunnel.applied) * 100)}%
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded border border-emerald-200 col-span-2 sm:col-span-1">
            <div className="text-xs text-emerald-800 font-semibold">Offers Extended</div>
            <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
              {analytics.applicationFunnel.selected}
            </div>
            <div className="text-xs text-emerald-700 font-mono mt-0.5">
              {Math.round((analytics.applicationFunnel.selected / analytics.applicationFunnel.applied) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
