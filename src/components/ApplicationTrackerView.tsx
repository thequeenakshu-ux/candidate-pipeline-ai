import React, { useState, useEffect } from 'react';
import { StudentApplicationItem, ApplicationStatus } from '../types/index.js';
import { api } from '../services/api.js';
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Building,
} from 'lucide-react';

export const ApplicationTrackerView: React.FC = () => {
  const [applications, setApplications] = useState<StudentApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getMyApplications();
      setApplications(data);
      if (data.length > 0 && !expandedAppId) {
        setExpandedAppId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SELECTED':
        return <span className="text-emerald-700 font-bold">Selected / Offer Extended</span>;
      case 'INTERVIEW':
        return <span className="text-indigo-700 font-semibold">Interview Scheduled</span>;
      case 'ASSESSMENT':
        return <span className="text-blue-700 font-semibold">Online Assessment</span>;
      case 'SHORTLISTED':
        return <span className="text-cyan-700 font-semibold">Shortlisted by Recruiter</span>;
      case 'APPLIED':
        return <span className="text-slate-600 font-medium">Under Initial Review</span>;
      case 'REJECTED':
        return <span className="text-rose-700 font-medium">Not Selected</span>;
      default:
        return <span className="text-slate-600">{status}</span>;
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['APPLIED', 'SHORTLISTED', 'ASSESSMENT', 'INTERVIEW'].includes(app.status);
    if (filter === 'OFFERS') return app.status === 'SELECTED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Candidate Placement Dashboard
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">My Application Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stage tracking with recruiter audit notes and interview round updates.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md shrink-0">
          {[
            { id: 'ALL', label: 'All Applications' },
            { id: 'ACTIVE', label: 'In Progress' },
            { id: 'OFFERS', label: 'Offers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-sm space-y-2">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          <p>Syncing application timeline logs...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-semibold text-slate-800">No Applications in this View</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse the Jobs & Internships tab and submit your profile to active recruiters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isExpanded = expandedAppId === app.id;
            return (
              <div
                key={app.id}
                className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* Main Row */}
                <div
                  onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-900">{app.companyName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{app.location || 'Bengaluru'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{app.jobTitle}</h3>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-xs">{getStatusBadge(app.status)}</div>
                    <button className="p-1 text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Timeline & Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                    <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Audit Timeline History ({app.timeline.length} Events)
                    </div>

                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {app.timeline.map((event, idx) => (
                        <div key={event.id || idx} className="relative text-xs space-y-1">
                          {/* Dot */}
                          <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{event.status}</span>
                            <span className="text-slate-400 font-mono tabular-nums">
                              {new Date(event.changedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 max-w-xl leading-relaxed">
                            {event.comment}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Candidate Pitch */}
                    {app.coverLetter && (
                      <div className="pt-2">
                        <div className="text-xs font-semibold text-slate-500 mb-1">
                          Cover Letter Excerpt:
                        </div>
                        <p className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200 leading-relaxed italic">
                          "{app.coverLetter}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
