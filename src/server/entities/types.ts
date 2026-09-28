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
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface StudentProfile {
  id: string;
  userId: string;
  phone: string;
  college: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  location: string;
  bio: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  proficiencyLevel: SkillProficiency;
  yearsOfExperience: number;
}

export interface Company {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  website: string;
  industry: string;
  location: string;
  logoUrl: string;
  verified: boolean;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  jobType: JobType;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceRequired: number; // in years (0 for freshers)
  educationRequired: string;
  minCgpa: number;
  deadline: string;
  status: JobStatus;
  createdAt: string;
}

export interface JobSkill {
  id: string;
  jobId: string;
  skillId: string;
  required: boolean;
  importanceWeight: number; // 1 to 5
}

export interface Application {
  id: string;
  studentId: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
  resumeUrl: string;
  coverLetter: string;
  updatedAt: string;
}

export interface ApplicationTimeline {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  changedAt: string;
  comment: string;
}

export interface CareerGoal {
  id: string;
  studentId: string;
  targetRole: string;
  targetIndustry: string;
  targetLocation: string;
  targetDate: string;
}

export interface PlacementReadiness {
  id: string;
  studentId: string;
  technicalScore: number;
  projectScore: number;
  resumeScore: number;
  interviewScore: number;
  overallScore: number;
  calculatedAt: string;
}

export interface SkillGap {
  id: string;
  studentId: string;
  jobId: string;
  skillId: string;
  status: SkillGapStatus;
  priority: PriorityLevel;
}

export interface LearningRecommendation {
  id: string;
  studentId: string;
  skillId: string;
  recommendation: string;
  priority: PriorityLevel;
  completed: boolean;
}

export interface ResumeAnalysis {
  id: string;
  studentId: string;
  jobId: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  analyzedAt: string;
}
