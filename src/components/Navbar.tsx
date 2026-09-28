import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Compass,
  Briefcase,
  GitCompare,
  Gauge,
  FileSearch,
  Layers,
  Building2,
  BarChart3,
  Code2,
  UserCircle2,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenProfile }) => {
  const { user, switchPersona, logout } = useAuth();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const isStudent = user?.role === 'STUDENT';
  const isCompany = user?.role === 'COMPANY';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab('jobs')}
              className="text-xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap"
            >
              CampusConnect
            </button>

            {/* Zone 2: Primary navigation links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => onSelectTab('jobs')}
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  currentTab === 'jobs'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Jobs & Internships
              </button>

              {isStudent && (
                <>
                  <button
                    onClick={() => onSelectTab('skill-gap')}
                    className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      currentTab === 'skill-gap'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Skill Gaps & Roadmap
                  </button>

                  <button
                    onClick={() => onSelectTab('readiness')}
                    className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      currentTab === 'readiness'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Readiness Scorecard
                  </button>

                  <button
                    onClick={() => onSelectTab('resume')}
                    className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      currentTab === 'resume'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Resume Matcher
                  </button>

                  <button
                    onClick={() => onSelectTab('applications')}
                    className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      currentTab === 'applications'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Applications
                  </button>
                </>
              )}

              {(isCompany || isAdmin) && (
                <button
                  onClick={() => onSelectTab('recruitment')}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    currentTab === 'recruitment'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Recruitment Portal
                </button>
              )}

              <button
                onClick={() => onSelectTab('analytics')}
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  currentTab === 'analytics'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Analytics
              </button>

              <button
                onClick={() => onSelectTab('spring-boot')}
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  currentTab === 'spring-boot'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Spring Boot Hub
              </button>
            </nav>
          </div>

          {/* Zone 3: 1-2 primary actions & persona switcher */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                title="Switch role to inspect recruiter or student perspective"
              >
                <span className="font-semibold text-indigo-700">Role:</span>
                <span>{user ? user.role : 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchPersona('STUDENT');
                      setIsPersonaMenuOpen(false);
                      onSelectTab('jobs');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Aarav Sharma</div>
                      <div className="text-slate-500">Student (CS '26, 8.85 CGPA)</div>
                    </div>
                    {user?.role === 'STUDENT' && <span className="text-xs text-indigo-600 font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('COMPANY');
                      setIsPersonaMenuOpen(false);
                      onSelectTab('recruitment');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Neha Verma</div>
                      <div className="text-slate-500">Nexus Fintech Recruiter</div>
                    </div>
                    {user?.role === 'COMPANY' && <span className="text-xs text-indigo-600 font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('ADMIN');
                      setIsPersonaMenuOpen(false);
                      onSelectTab('analytics');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Dr. K. Raman</div>
                      <div className="text-slate-500">Placement Officer / Admin</div>
                    </div>
                    {user?.role === 'ADMIN' && <span className="text-xs text-indigo-600 font-bold">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Profile or Action */}
            {isStudent && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <UserCircle2 className="w-4 h-4 text-slate-600" />
                <span>My Profile & Skills</span>
              </button>
            )}

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => onSelectTab('jobs')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'jobs' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Jobs
          </button>
          {isStudent && (
            <>
              <button
                onClick={() => onSelectTab('skill-gap')}
                className={`px-2.5 py-1 rounded whitespace-nowrap ${
                  currentTab === 'skill-gap' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Skill Gaps
              </button>
              <button
                onClick={() => onSelectTab('readiness')}
                className={`px-2.5 py-1 rounded whitespace-nowrap ${
                  currentTab === 'readiness' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Readiness
              </button>
              <button
                onClick={() => onSelectTab('resume')}
                className={`px-2.5 py-1 rounded whitespace-nowrap ${
                  currentTab === 'resume' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Resume ATS
              </button>
              <button
                onClick={() => onSelectTab('applications')}
                className={`px-2.5 py-1 rounded whitespace-nowrap ${
                  currentTab === 'applications' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Applications
              </button>
            </>
          )}
          {(isCompany || isAdmin) && (
            <button
              onClick={() => onSelectTab('recruitment')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                currentTab === 'recruitment' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
              }`}
            >
              Recruitment
            </button>
          )}
          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onSelectTab('spring-boot')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentTab === 'spring-boot' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Spring Boot
          </button>
        </div>
      </div>
    </header>
  );
};
