import React, { useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { X, Send, FileText, CheckCircle2 } from 'lucide-react';

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  jobId,
  jobTitle,
  companyName,
  onClose,
  onSuccess,
}) => {
  const { studentProfile } = useAuth();
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${companyName},\n\nI am writing to express my eager interest in the ${jobTitle} position. With my background in ${
      studentProfile?.branch || 'Computer Science'
    } and practical project experience in building resilient applications, I look forward to contributing to your engineering initiatives.\n\nThank you for considering my application.`
  );
  const [resumeUrl, setResumeUrl] = useState(studentProfile?.resumeUrl || '/resumes/aarav_sharma_resume.pdf');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.applyForJob(jobId, coverLetter, resumeUrl);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Application submission failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">Submit Application</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {jobTitle} · <span className="font-medium text-slate-700">{companyName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your profile, resume, and skills have been shared with {companyName}. Status tracking is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-800 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Resume Document
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate font-mono">{resumeUrl || 'default_resume.pdf'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cover Note / Pitch to Recruiter
              </label>
              <textarea
                rows={5}
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Highlight your standout achievements and enthusiasm..."
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Placement Policy Note:</div>
              <p>
                Applications submitted through CampusConnect update your real-time placement pipeline. Recruiter evaluations will appear in your timeline.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-md transition-colors flex items-center gap-1.5"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Apply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
