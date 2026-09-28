import React, { useState, useEffect } from 'react';
import { JobCardDTO, ResumeAnalysisResult } from '../types/index.js';
import { api } from '../services/api.js';
import {
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Zap,
} from 'lucide-react';

const SAMPLE_STUDENT_RESUME = `AARAV SHARMA
Bengaluru, India | aarav.sharma@campus.edu | +91 98765 43210
github.com/aaravsharma-dev | linkedin.com/in/aarav-sharma-tech

EDUCATION
National Institute of Technology — B.Tech Computer Science and Engineering (2022–2026)
CGPA: 8.85 / 10.00

TECHNICAL SKILLS
Languages: Java (Java 17/21), SQL, JavaScript, TypeScript, Python
Frameworks & Libraries: Spring Boot 3, Spring Data JPA, Hibernate, React.js, Tailwind CSS, Express
Databases & Distributed Systems: PostgreSQL, MySQL, Redis, Apache Kafka
Developer Tools & DevOps: Git, GitHub, Docker, Kubernetes, Linux, Postman, JUnit, Mockito
Architecture & Concepts: Microservices, RESTful APIs, OOP, ACID Transactions, System Design

PROJECTS
High-Throughput Banking Settlement Gateway | Spring Boot, PostgreSQL, Kafka, React
- Architected an event-driven payment ledger processing 10,000+ daily simulated settlement events.
- Utilized Spring Data JPA with indexing to reduce SQL query latency by 45%.
- Implemented robust JWT authentication and role-based access control (RBAC).

Distributed Distributed Cache & Inventory Engine | Java, Redis, Docker
- Built a write-through caching layer decreasing database read contention by 65%.
- Packaged services into lightweight multi-stage Docker containers for Kubernetes deployment.

ACHIEVEMENTS & LEADERSHIP
- Solved 450+ Data Structures & Algorithm problems on LeetCode (Knight rank).
- Lead Developer, University Open Source Club: Mentored 40+ junior developers.`;

export const ResumeAnalyzerView: React.FC = () => {
  const [jobs, setJobs] = useState<JobCardDTO[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>(SAMPLE_STUDENT_RESUME);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const list = await api.getJobs();
        setJobs(list);
        if (list.length > 0) {
          setSelectedJobId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedJobId || !resumeText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeResume(selectedJobId, resumeText);
      setAnalysis(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-lg border border-slate-200">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          ATS Optimization & Keyword Engine
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-1">
          Resume vs Job Description Analyzer
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Screen your resume against live campus job descriptions. Detect missing technical requirements, evaluate ATS parse compatibility, and receive tailored formatting suggestions.
        </p>
      </div>

      {/* Target Job Selection */}
      <div className="p-4 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Job Description to Compare Against:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} · {j.companyName} ({j.location})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setResumeText(SAMPLE_STUDENT_RESUME)}
          className="self-end sm:self-center px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors shrink-0"
        >
          Load Candidate Resume Preset
        </button>
      </div>

      {/* Two Column Layout: Editor + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Column (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Resume Plain Text / Markdown</span>
            <span className="font-mono">{resumeText.split(/\s+/).filter(Boolean).length} Words</span>
          </div>

          <textarea
            rows={18}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full text-xs p-3 font-mono border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed bg-slate-50/50"
            placeholder="Paste your plain text resume or project summary here..."
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Running ATS Token Matcher...</span>
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute JD Keyword Comparison</span>
              </>
            )}
          </button>
        </div>

        {/* Results Column (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
              {error}
            </div>
          )}

          {analysis ? (
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-2xs">
              {/* Score Header */}
              <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-lg">
                <div>
                  <div className="text-xs text-slate-400 font-medium">JD Keyword Match</div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-white mt-0.5">
                    {analysis.matchPercentage}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">ATS Formatting Score</div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                    {analysis.atsScore}/100
                  </div>
                </div>
              </div>

              {/* Matched Skills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 uppercase tracking-wider">
                    Matched Prerequisite Keywords ({analysis.matchedSkills.length})
                  </span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Found in Text
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matchedSkills.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {analysis.missingSkills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 uppercase tracking-wider">
                      Missing High-Value Keywords ({analysis.missingSkills.length})
                    </span>
                    <span className="text-rose-700 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Add to Resume
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingSkills.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded text-xs font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatting & Content Feedback */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Formatting & Parsing Audit
                </h4>
                <div className="space-y-1.5">
                  {analysis.formattingFeedback.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-100 rounded-md text-xs text-slate-700 flex items-start gap-2"
                    >
                      <FileCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Next Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Recommended Refinements
                </h4>
                <div className="space-y-1.5">
                  {analysis.actionableNextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-md text-xs text-indigo-950 flex items-start gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-lg border border-slate-200 space-y-2 text-slate-500 text-xs">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-semibold text-slate-800">No JD Analysis Generated Yet</div>
              <p className="max-w-xs mx-auto">
                Paste your resume on the left and click "Execute JD Keyword Comparison" to receive instant ATS metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
