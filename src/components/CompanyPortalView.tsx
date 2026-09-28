import React, { useState, useEffect } from 'react';
import { JobCardDTO, JobApplicantItem, ApplicationStatus, SkillItem } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Building2,
  Users,
  PlusCircle,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const CompanyPortalView: React.FC = () => {
  const { user, companyProfile } = useAuth();
  const [jobs, setJobs] = useState<JobCardDTO[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [applicants, setApplicants] = useState<JobApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // New Job Modal state
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [allSkills, setAllSkills] = useState<SkillItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newJobType, setNewJobType] = useState('FULL_TIME');
  const [newLocation, setNewLocation] = useState('Bengaluru, India (Hybrid)');
  const [newMinSalary, setNewMinSalary] = useState(1400000);
  const [newMaxSalary, setNewMaxSalary] = useState(1800000);
  const [newMinCgpa, setNewMinCgpa] = useState(8.0);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(['skl-java', 'skl-spring', 'skl-sql']);

  // Status transition state
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplicantItem | null>(null);
  const [transitionStatus, setTransitionStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [transitionComment, setTransitionComment] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs();
      setJobs(data);
      if (data.length > 0 && !selectedJobId) {
        setSelectedJobId(data[0].id);
      }
      const skills = await api.getSkills();
      setAllSkills(skills);
    } catch (err) {
      console.error('Failed to load company jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    const fetchApplicants = async () => {
      setLoadingApplicants(true);
      try {
        const data = await api.getJobApplicants(selectedJobId);
        setApplicants(data);
        if (data.length > 0) {
          setSelectedApplicant(data[0]);
        } else {
          setSelectedApplicant(null);
        }
      } catch (err) {
        console.error('Failed to load applicants:', err);
      } finally {
        setLoadingApplicants(false);
      }
    };
    fetchApplicants();
  }, [selectedJobId]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsPayload = selectedSkillIds.map((sId, index) => ({
        skillId: sId,
        required: index < 2, // First two are required
        importanceWeight: index < 2 ? 5 : 4,
      }));

      await api.createJob({
        title: newTitle,
        description: newDescription,
        jobType: newJobType,
        location: newLocation,
        salaryMin: Number(newMinSalary),
        salaryMax: Number(newMaxSalary),
        experienceRequired: 0,
        educationRequired: 'B.Tech / B.E in CS / IT / ECE',
        minCgpa: Number(newMinCgpa),
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        skills: skillsPayload,
      });

      setIsCreatingJob(false);
      setNewTitle('');
      setNewDescription('');
      fetchJobs();
    } catch (err) {
      console.error('Failed to create job:', err);
    }
  };

  const handleUpdateApplicantStatus = async () => {
    if (!selectedApplicant) return;
    setIsUpdatingStatus(true);
    try {
      await api.updateApplicationStatus(
        selectedApplicant.id,
        transitionStatus,
        transitionComment || `Candidate transitioned to ${transitionStatus} stage.`
      );
      // Refresh applicants list
      const updated = await api.getJobApplicants(selectedJobId);
      setApplicants(updated);
      setSelectedApplicant(updated.find((a) => a.id === selectedApplicant.id) || null);
      setTransitionComment('');
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const currentJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Talent Acquisition & Placement Management
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Recruiter Candidate Evaluation Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Managing openings for <span className="font-semibold text-slate-800">{companyProfile?.companyName || 'Campus Partner'}</span>. Review applicant match scores and progress candidates.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingJob(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Campus Job</span>
        </button>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Job Selector & Applicant Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Job Selector Dropdown */}
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Active Recruitment Opening:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} · {j.location} ({j.applicantCount} applicants)
                </option>
              ))}
            </select>
          </div>

          {/* Applicant Queue */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Candidate Pipeline ({applicants.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by explainable skill match and academic eligibility.
                </p>
              </div>
            </div>

            {loadingApplicants ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
                <p>Loading candidate submissions...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-1">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="font-semibold text-slate-800">No applicants yet for this drive</div>
                <p>Applicants will automatically appear here once students submit applications.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applicants.map((cand) => {
                  const isSelected = selectedApplicant?.id === cand.id;
                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedApplicant(cand)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{cand.studentName}</span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-600">{cand.studentBranch}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <span>CGPA: {cand.studentCgpa?.toFixed(2)}</span>
                          <span aria-hidden="true">·</span>
                          <span>Stage: {cand.status}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-3">
                        <div>
                          <div className="text-xs font-mono font-bold tabular-nums text-indigo-700">
                            {cand.matchScore}% Match
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {cand.timeline.length} stage log(s)
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Candidate Inspection & Stage Advancement (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedApplicant ? (
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5 shadow-2xs">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Applicant Dossier
                  </span>
                  <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                    Fit Score: {selectedApplicant.matchScore}%
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedApplicant.studentName}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedApplicant.studentEmail} · {selectedApplicant.studentCollege}
                </div>
              </div>

              {/* Academic & Application Matrix */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-xs border border-slate-100">
                <div>
                  <div className="text-slate-400 font-medium">Undergraduate CGPA</div>
                  <div className="font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                    {selectedApplicant.studentCgpa?.toFixed(2)} / 10.00
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Department</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedApplicant.studentBranch}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Application Date</div>
                  <div className="text-slate-700 font-mono mt-0.5">
                    {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Current Status</div>
                  <div className="font-bold text-indigo-700 mt-0.5">{selectedApplicant.status}</div>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplicant.coverLetter && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-700">Cover Letter:</div>
                  <p className="text-xs text-slate-600 p-3 bg-slate-50 rounded border border-slate-100 italic leading-relaxed">
                    "{selectedApplicant.coverLetter}"
                  </p>
                </div>
              )}

              {/* Advance Status Controls */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Update Candidate Stage & Audit Log
                </h4>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Advance Stage:</label>
                  <select
                    value={transitionStatus}
                    onChange={(e) => setTransitionStatus(e.target.value as ApplicationStatus)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none"
                  >
                    <option value="SHORTLISTED">SHORTLISTED · Cleared Automated Screening</option>
                    <option value="ASSESSMENT">ASSESSMENT · Send Technical Coding Challenge</option>
                    <option value="INTERVIEW">INTERVIEW · Schedule Architectural Discussion</option>
                    <option value="SELECTED">SELECTED · Extend Official Offer Letter</option>
                    <option value="REJECTED">REJECTED · Not Selected</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Recruiter Audit Comment:
                  </label>
                  <input
                    type="text"
                    value={transitionComment}
                    onChange={(e) => setTransitionComment(e.target.value)}
                    placeholder="e.g. Cleared Round 1 DSA assessment with high marks..."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded outline-none"
                  />
                </div>

                <button
                  onClick={handleUpdateApplicantStatus}
                  disabled={isUpdatingStatus}
                  className="w-full py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded transition-colors"
                >
                  {isUpdatingStatus ? 'Updating Pipeline...' : 'Record Decision in Timeline'}
                </button>
              </div>

              {/* Timeline Audit */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Historical Audit Timeline
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedApplicant.timeline.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-100">
                      <div className="flex items-center justify-between text-slate-500 font-mono">
                        <span className="font-bold text-slate-900">{t.status}</span>
                        <span>{new Date(t.changedAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 mt-1">{t.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-xs">
              Select an applicant from the queue to view their profile, explainable fit score, and advance their stage.
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {isCreatingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Post New Placement Drive</h2>
            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Backend Engineer (Java / Distributed)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe core engineering responsibilities, team structure, and technologies..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Type</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Salary (INR)</label>
                  <input
                    type="number"
                    value={newMinSalary}
                    onChange={(e) => setNewMinSalary(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Salary (INR)</label>
                  <input
                    type="number"
                    value={newMaxSalary}
                    onChange={(e) => setNewMaxSalary(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Technical Competencies (for Matching Engine):
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded max-h-36 overflow-y-auto">
                  {allSkills.map((sk) => {
                    const isSelected = selectedSkillIds.includes(sk.id);
                    return (
                      <button
                        type="button"
                        key={sk.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSkillIds(selectedSkillIds.filter((id) => id !== sk.id));
                          } else {
                            setSelectedSkillIds([...selectedSkillIds, sk.id]);
                          }
                        }}
                        className={`text-left p-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                          isSelected ? 'bg-indigo-600 text-white font-semibold' : 'bg-white text-slate-700'
                        }`}
                      >
                        <span>{sk.name}</span>
                        {isSelected && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingJob(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
