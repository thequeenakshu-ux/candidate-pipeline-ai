export type UserRole = 'STUDENT' | 'COMPANY' | 'ADMIN';
export type JobType = 'FULL_TIME' | 'INTERNSHIP' | 'CONTRACT';
export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT';
export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'ASSESSMENT'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED'
  | 'WITHDRAWN';
export type SkillProficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type SkillGapStatus = 'HAVE' | 'MISSING' | 'NEEDS_IMPROVEMENT';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface StudentProfile {
  id: string;
  college: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  phone: string;
  location: string;
  bio: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  location: string;
  logoUrl: string;
  verified: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
}

export interface StudentSkillItem {
  id: string;
  studentId: string;
  skillId: string;
  proficiencyLevel: SkillProficiency;
  yearsOfExperience: number;
  skill: SkillItem;
}

export interface JobCardDTO {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyLocation: string;
  title: string;
  description: string;
  jobType: JobType;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceRequired: number;
  educationRequired: string;
  minCgpa: number;
  deadline: string;
  status: JobStatus;
  createdAt: string;
  applicantCount: number;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    required: boolean;
    importanceWeight: number;
  }>;
  matchingScore?: number;
}

export interface ExplainableMatch {
  jobId: string;
  jobTitle: string;
  companyName: string;
  overallMatchScore: number;
  isEligible: boolean;
  eligibilityReasons: string[];
  breakdown: {
    skillsMatchPercentage: number;
    requiredSkillsMetRatio: string;
    cgpaEligibility: boolean;
    experienceScore: number;
  };
  matchedSkills: Array<{
    skillName: string;
    required: boolean;
    weight: number;
    studentProficiency: SkillProficiency;
    yearsOfExperience: number;
  }>;
  missingSkills: Array<{
    skillName: string;
    required: boolean;
    weight: number;
    suggestedAction: string;
  }>;
  explainableSummary: string;
}

export interface SkillGapAnalysis {
  jobId: string;
  jobTitle: string;
  gaps: Array<{
    skillId: string;
    skillName: string;
    category: string;
    status: SkillGapStatus;
    priority: PriorityLevel;
    recommendation: string;
  }>;
  roadmapMilestones: Array<{
    phase: string;
    timeframe: string;
    actionItems: string[];
  }>;
}

export interface LearningRecommendation {
  id: string;
  studentId: string;
  skillId: string;
  recommendation: string;
  priority: PriorityLevel;
  completed: boolean;
}

export interface PlacementReadiness {
  studentId: string;
  technicalScore: number;
  projectScore: number;
  resumeScore: number;
  interviewScore: number;
  overallScore: number;
  calculatedAt: string;
  benchmarkPercentile: number;
  strengths: string[];
  growthAreas: string[];
  actionPlan: Array<{
    area: string;
    task: string;
    estimatedDays: number;
  }>;
}

export interface ApplicationTimelineItem {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  changedAt: string;
  comment: string;
}

export interface StudentApplicationItem {
  id: string;
  studentId: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
  resumeUrl: string;
  coverLetter: string;
  jobTitle: string;
  jobType?: JobType;
  location?: string;
  companyName: string;
  salaryMax?: number;
  timeline: ApplicationTimelineItem[];
}

export interface JobApplicantItem {
  id: string;
  studentId: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
  resumeUrl: string;
  coverLetter: string;
  studentName: string;
  studentEmail?: string;
  studentCgpa?: number;
  studentBranch?: string;
  studentCollege?: string;
  matchScore: number;
  timeline: ApplicationTimelineItem[];
}

export interface PlacementAnalytics {
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  activeCompanies: number;
  totalOpenings: number;
  averageCtcLpa: number;
  highestCtcLpa: number;
  medianCtcLpa: number;
  branchStatistics: Array<{
    branch: string;
    total: number;
    placed: number;
    placementPercentage: number;
    avgCtcLpa: number;
  }>;
  topRecruitingCompanies: Array<{
    companyName: string;
    hires: number;
    avgPackage: number;
  }>;
  topDemandedSkills: Array<{
    skillName: string;
    jobCount: number;
    growthTrend: string;
  }>;
  applicationFunnel: {
    applied: number;
    shortlisted: number;
    assessment: number;
    interview: number;
    selected: number;
  };
}

export interface ResumeAnalysisResult {
  id: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  atsScore: number;
  formattingFeedback: string[];
  keywordRecommendations: string[];
  actionableNextSteps: string[];
}
