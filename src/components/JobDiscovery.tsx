import React, { useState, useEffect } from 'react';
import { JobCardDTO } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

interface JobDiscoveryProps {
  onOpenMatchModal: (jobId: string) => void;
  onOpenApplyModal: (job: { id: string; title: string; companyName: string }) => void;
  onOpenSkillGapRoadmap: (jobId: string) => void;
}

export const JobDiscovery: React.FC<JobDiscoveryProps> = ({
  onOpenMatchModal,
  onOpenApplyModal,
  onOpenSkillGapRoadmap,
}) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobCardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<JobCardDTO | null>(null);

  const isStudent = user?.role === 'STUDENT';

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        search: search || undefined,
        jobType: selectedType !== 'ALL' ? selectedType : undefined,
        minSalary: minSalary > 0 ? minSalary : undefined,
      });
      setJobs(data);
      if (data.length > 0 && !selectedJob) {
        setSelectedJob(data[0]);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedType, minSalary]);

  const formatSalary = (min: number, max: number, type: string) => {
    if (type === 'INTERNSHIP') {
      return `₹${(min / 1000).toFixed(0)}k – ₹${(max / 1000).toFixed(0)}k / month`;
    }
    const minLpa = (min / 100000).toFixed(1);
    const maxLpa = (max / 100000).toFixed(1);
    return `₹${minLpa}L – ₹${maxLpa}L CTC`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Campus Architectural Imagery */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 text-white border border-slate-800">
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
          <img
            src="/src/assets/images/campus_connect_hero_1790591926401.jpg"
            alt="CampusConnect Placement Center"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative p-6 sm:p-8 max-w-3xl space-y-2">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Placement Season 2026 · Verified Corporate Openings
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Discover Verified Campus Placements & Internships
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Every job posting includes explainable skill match calculations, automated prerequisite verification, and personalized career roadmaps tailored to your degree coursework.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role title, technical skill (Java, Docker, React), or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Type Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md shrink-0">
            {['ALL', 'FULL_TIME', 'INTERNSHIP'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedType === t
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'ALL' ? 'All Roles' : t === 'FULL_TIME' ? 'Full Time' : 'Internship'}
              </button>
            ))}
          </div>

          {/* CTC Filter */}
          <select
            value={minSalary}
            onChange={(e) => setMinSalary(Number(e.target.value))}
            className="px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 shrink-0"
          >
            <option value={0}>All Packages</option>
            <option value={1000000}>Min ₹10+ LPA</option>
            <option value={1500000}>Min ₹15+ LPA</option>
            <option value={1800000}>Min ₹18+ LPA</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Listings + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Job Listings Column (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <span className="font-semibold text-slate-800">{jobs.length}</span> active placement openings
            </span>
            <span>Sorted by relevance</span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-sm space-y-2">
              <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
              <p>Loading campus opportunities...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg border border-slate-200 space-y-2">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">No jobs match your criteria</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your search terms or resetting the package filters.
              </p>
            </div>
          ) : (
            jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 rounded-lg border transition-all cursor-pointer bg-white text-left ${
                    isSelected
                      ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium text-slate-500">{job.companyName}</div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{job.title}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono tabular-nums text-slate-900">
                        {formatSalary(job.salaryMin, job.salaryMax, job.jobType)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono">
                        Min CGPA {job.minCgpa.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Metadata Row with typographic dots (Zero pill rule) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2.5">
                    <span>{job.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.jobType === 'FULL_TIME' ? 'Full Time Placement' : 'Internship'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{job.applicantCount} applicants</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills List */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {job.skills.map((s) => (
                      <span
                        key={s.id}
                        className={`text-xs px-2 py-0.5 rounded ${
                          s.required
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s.name} {s.required ? '(Core)' : ''}
                      </span>
                    ))}
                  </div>

                  {/* Card Actions */}
                  {isStudent && (
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMatchModal(job.id);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Explain Match & Fit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenApplyModal({
                            id: job.id,
                            title: job.title,
                            companyName: job.companyName,
                          });
                        }}
                        className="px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Job Detail Column (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedJob ? (
            <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-5">
              <div className="border-b border-slate-200 pb-4">
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {selectedJob.companyName}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedJob.title}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedJob.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Compensation & Criteria Matrix */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-xs border border-slate-100">
                <div>
                  <div className="text-slate-400 font-medium">Package / Stipend</div>
                  <div className="font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                    {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.jobType)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Eligibility Threshold</div>
                  <div className="font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                    {selectedJob.minCgpa.toFixed(2)} CGPA
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Target Degree</div>
                  <div className="text-slate-700 mt-0.5">{selectedJob.educationRequired}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Experience Level</div>
                  <div className="text-slate-700 mt-0.5">
                    {selectedJob.experienceRequired === 0
                      ? 'Freshers Eligible (2026 Batch)'
                      : `${selectedJob.experienceRequired} Year(s)`}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Role Overview
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              {/* Required & Elective Skills Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Competency Requirements
                </h4>
                <div className="space-y-1.5">
                  {selectedJob.skills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{s.name}</span>
                        <span className="text-slate-400">({s.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">
                          Weight: {s.importanceWeight}/5
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                            s.required
                              ? 'bg-rose-50 text-rose-700 font-bold'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {s.required ? 'Mandatory' : 'Preferred'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col gap-2">
                {isStudent && (
                  <>
                    <button
                      onClick={() =>
                        onOpenApplyModal({
                          id: selectedJob.id,
                          title: selectedJob.title,
                          companyName: selectedJob.companyName,
                        })
                      }
                      className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-2xs"
                    >
                      Submit Campus Application
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenMatchModal(selectedJob.id)}
                        className="py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Explain Match</span>
                      </button>

                      <button
                        onClick={() => onOpenSkillGapRoadmap(selectedJob.id)}
                        className="py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        Analyze Skill Gaps
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-xs">
              Select a job listing to inspect requirements and match analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
