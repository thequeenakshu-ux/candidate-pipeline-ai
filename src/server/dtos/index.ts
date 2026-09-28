import {
  UserRole,
  JobType,
  JobStatus,
  ApplicationStatus,
  SkillProficiency,
  PriorityLevel,
  SkillGapStatus,
} from '../entities/types.js';

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // Student specific optional fields
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  cgpa?: number;
  phone?: string;
  // Company specific optional fields
  companyName?: string;
  industry?: string;
  website?: string;
  location?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  studentProfile?: {
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
  };
  companyProfile?: {
    id: string;
    companyName: string;
    industry: string;
    website: string;
    location: string;
    logoUrl: string;
    verified: boolean;
  };
}

export interface JobFilterDTO {
  search?: string;
  jobType?: JobType;
  location?: string;
  minSalary?: number;
  minCgpa?: number;
  companyId?: string;
}

export interface CreateJobRequestDTO {
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
  skills: Array<{
    skillId: string;
    required: boolean;
    importanceWeight: number;
  }>;
}

export interface JobResponseDTO {
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

export interface ApplyJobRequestDTO {
  jobId: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface UpdateApplicationStatusDTO {
  status: ApplicationStatus;
  comment?: string;
}

export interface ExplainableMatchDTO {
  jobId: string;
  jobTitle: string;
  companyName: string;
  overallMatchScore: number; // 0 to 100
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

export interface SkillGapAnalysisDTO {
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

export interface PlacementReadinessDTO {
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

export interface ResumeAnalysisRequestDTO {
  jobId: string;
  resumeText: string;
}

export interface ResumeAnalysisResponseDTO {
  id: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  atsScore: number;
  formattingFeedback: string[];
  keywordRecommendations: string[];
  actionableNextSteps: string[];
}

export interface PlacementAnalyticsDTO {
  totalStudents: number;
  placedStudents: number;
  placementRate: number; // percentage
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
