import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { JobDiscovery } from './components/JobDiscovery.js';
import { ExplainableMatchModal } from './components/ExplainableMatchModal.js';
import { ApplyJobModal } from './components/ApplyJobModal.js';
import { SkillGapView } from './components/SkillGapView.js';
import { PlacementReadinessView } from './components/PlacementReadinessView.js';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView.js';
import { ApplicationTrackerView } from './components/ApplicationTrackerView.js';
import { CompanyPortalView } from './components/CompanyPortalView.js';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView.js';
import { SpringBootHubView } from './components/SpringBootHubView.js';
import { StudentProfileModal } from './components/StudentProfileModal.js';

function MainApp() {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('jobs');

  // Modals state
  const [matchModalJobId, setMatchModalJobId] = useState<string | null>(null);
  const [applyModalJob, setApplyModalJob] = useState<{ id: string; title: string; companyName: string } | null>(null);
  const [skillGapInitialJobId, setSkillGapInitialJobId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleOpenMatchModal = (jobId: string) => {
    setMatchModalJobId(jobId);
  };

  const handleOpenApplyModal = (job: { id: string; title: string; companyName: string }) => {
    setApplyModalJob(job);
  };

  const handleOpenSkillGapRoadmap = (jobId: string) => {
    setSkillGapInitialJobId(jobId);
    setCurrentTab('skill-gap');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          <span>Bootstrapping CampusConnect Intelligence Platform...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'jobs' && (
          <JobDiscovery
            onOpenMatchModal={handleOpenMatchModal}
            onOpenApplyModal={handleOpenApplyModal}
            onOpenSkillGapRoadmap={handleOpenSkillGapRoadmap}
          />
        )}

        {currentTab === 'skill-gap' && (
          <SkillGapView
            initialJobId={skillGapInitialJobId}
            onNavigateToJobs={() => setCurrentTab('jobs')}
          />
        )}

        {currentTab === 'readiness' && <PlacementReadinessView />}

        {currentTab === 'resume' && <ResumeAnalyzerView />}

        {currentTab === 'applications' && <ApplicationTrackerView />}

        {currentTab === 'recruitment' && <CompanyPortalView />}

        {currentTab === 'analytics' && <AnalyticsDashboardView />}

        {currentTab === 'spring-boot' && <SpringBootHubView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CampusConnect</span>
            <span>· College Placement & Internship Management + Placement Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono">
            <span>Spring Boot 3 + JPA / Express TS</span>
            <span>·</span>
            <span>MySQL Schema v1.0</span>
          </div>
        </div>
      </footer>

      {/* Explainable Match Modal */}
      {matchModalJobId && (
        <ExplainableMatchModal
          jobId={matchModalJobId}
          onClose={() => setMatchModalJobId(null)}
          onApply={(jId) => {
            // Find job info or open generic
            setApplyModalJob({
              id: jId,
              title: 'Position Opening',
              companyName: 'Campus Partner',
            });
          }}
          onViewRoadmap={(jId) => {
            handleOpenSkillGapRoadmap(jId);
          }}
        />
      )}

      {/* Apply Job Modal */}
      {applyModalJob && (
        <ApplyJobModal
          jobId={applyModalJob.id}
          jobTitle={applyModalJob.title}
          companyName={applyModalJob.companyName}
          onClose={() => setApplyModalJob(null)}
          onSuccess={() => {
            setCurrentTab('applications');
          }}
        />
      )}

      {/* Student Profile & Skills Modal */}
      {isProfileModalOpen && (
        <StudentProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
