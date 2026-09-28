import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  StudentProfile,
  Skill,
  StudentSkill,
  Company,
  Job,
  JobSkill,
  Application,
  ApplicationTimeline,
  CareerGoal,
  PlacementReadiness,
  SkillGap,
  LearningRecommendation,
  ResumeAnalysis,
} from '../entities/types.js';

export interface DatabaseSchema {
  users: User[];
  studentProfiles: StudentProfile[];
  skills: Skill[];
  studentSkills: StudentSkill[];
  companies: Company[];
  jobs: Job[];
  jobSkills: JobSkill[];
  applications: Application[];
  applicationTimelines: ApplicationTimeline[];
  careerGoals: CareerGoal[];
  placementReadiness: PlacementReadiness[];
  skillGaps: SkillGap[];
  learningRecommendations: LearningRecommendation[];
  resumeAnalyses: ResumeAnalysis[];
}

export function hashPassword(password: string): string {
  // Simple PBKDF2 hash for realistic secure auth
  const salt = 'campusconnect_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

class DatabaseManager {
  private dbPath: string;
  public data: DatabaseSchema;

  constructor() {
    this.dbPath = path.resolve(process.cwd(), 'data', 'campusconnect.json');
    this.data = this.initializeDatabase();
  }

  private initializeDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch {
      // Fallback to seeding if file read fails
    }

    const seeded = this.generateSeedData();
    this.saveToDisk(seeded);
    return seeded;
  }

  public saveToDisk(dataToSave?: DatabaseSchema) {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  private generateSeedData(): DatabaseSchema {
    const now = new Date().toISOString();

    // 1. Users
    const uStudent1: User = {
      id: 'usr-student-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      passwordHash: hashPassword('student123'),
      role: 'STUDENT',
      createdAt: '2026-08-01T09:00:00.000Z',
      updatedAt: now,
      active: true,
    };

    const uStudent2: User = {
      id: 'usr-student-2',
      name: 'Priya Patel',
      email: 'priya.patel@campus.edu',
      passwordHash: hashPassword('student123'),
      role: 'STUDENT',
      createdAt: '2026-08-05T10:00:00.000Z',
      updatedAt: now,
      active: true,
    };

    const uCompany1: User = {
      id: 'usr-comp-1',
      name: 'Neha Verma',
      email: 'neha@nexusfintech.io',
      passwordHash: hashPassword('company123'),
      role: 'COMPANY',
      createdAt: '2026-07-15T08:30:00.000Z',
      updatedAt: now,
      active: true,
    };

    const uCompany2: User = {
      id: 'usr-comp-2',
      name: 'Vikram Malhotra',
      email: 'vikram@cloudscale.ai',
      passwordHash: hashPassword('company123'),
      role: 'COMPANY',
      createdAt: '2026-07-20T11:00:00.000Z',
      updatedAt: now,
      active: true,
    };

    const uAdmin: User = {
      id: 'usr-admin-1',
      name: 'Dr. K. Raman',
      email: 'raman.tpo@campus.edu',
      passwordHash: hashPassword('admin123'),
      role: 'ADMIN',
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: now,
      active: true,
    };

    const users = [uStudent1, uStudent2, uCompany1, uCompany2, uAdmin];

    // 2. Student Profiles
    const sp1: StudentProfile = {
      id: 'sp-1',
      userId: uStudent1.id,
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science and Engineering',
      graduationYear: 2026,
      cgpa: 8.85,
      location: 'Bengaluru / Pune',
      bio: 'Final-year CS undergrad passionate about distributed backend architecture, Spring Boot microservices, high-throughput database systems, and clean React frontends.',
      resumeUrl: '/resumes/aarav_sharma_resume.pdf',
      githubUrl: 'https://github.com/aaravsharma-dev',
      linkedinUrl: 'https://linkedin.com/in/aarav-sharma-tech',
    };

    const sp2: StudentProfile = {
      id: 'sp-2',
      userId: uStudent2.id,
      phone: '+91 98111 22334',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Information Technology',
      graduationYear: 2026,
      cgpa: 9.20,
      location: 'Hyderabad / Bengaluru',
      bio: 'Aspiring Cloud Platform Engineer with hands-on experience in Kubernetes, Docker, Python FastAPI, and enterprise SQL performance tuning.',
      resumeUrl: '/resumes/priya_patel_resume.pdf',
      githubUrl: 'https://github.com/priyapatel-code',
      linkedinUrl: 'https://linkedin.com/in/priya-patel-cloud',
    };

    const studentProfiles = [sp1, sp2];

    // 3. Skills Repository
    const skills: Skill[] = [
      { id: 'skl-java', name: 'Java', category: 'Programming Language' },
      { id: 'skl-spring', name: 'Spring Boot', category: 'Backend Framework' },
      { id: 'skl-react', name: 'React.js', category: 'Frontend Framework' },
      { id: 'skl-sql', name: 'SQL & Relational DBs', category: 'Database' },
      { id: 'skl-docker', name: 'Docker', category: 'DevOps & Cloud' },
      { id: 'skl-k8s', name: 'Kubernetes', category: 'DevOps & Cloud' },
      { id: 'skl-aws', name: 'AWS Cloud', category: 'DevOps & Cloud' },
      { id: 'skl-git', name: 'Git & GitHub', category: 'Developer Tools' },
      { id: 'skl-dsa', name: 'Data Structures & Algorithms', category: 'Fundamentals' },
      { id: 'skl-python', name: 'Python', category: 'Programming Language' },
      { id: 'skl-kafka', name: 'Apache Kafka', category: 'Distributed Systems' },
      { id: 'skl-micro', name: 'Microservices Architecture', category: 'System Design' },
      { id: 'skl-redis', name: 'Redis', category: 'Database & Caching' },
      { id: 'skl-node', name: 'Node.js & Express', category: 'Backend Framework' },
      { id: 'skl-ts', name: 'TypeScript', category: 'Programming Language' },
      { id: 'skl-rest', name: 'RESTful API Design', category: 'Backend Framework' },
    ];

    // 4. Student Skills
    const studentSkills: StudentSkill[] = [
      // Aarav skills
      { id: 'ssk-1', studentId: sp1.id, skillId: 'skl-java', proficiencyLevel: 'ADVANCED', yearsOfExperience: 3 },
      { id: 'ssk-2', studentId: sp1.id, skillId: 'skl-spring', proficiencyLevel: 'ADVANCED', yearsOfExperience: 2 },
      { id: 'ssk-3', studentId: sp1.id, skillId: 'skl-react', proficiencyLevel: 'INTERMEDIATE', yearsOfExperience: 2 },
      { id: 'ssk-4', studentId: sp1.id, skillId: 'skl-sql', proficiencyLevel: 'ADVANCED', yearsOfExperience: 2 },
      { id: 'ssk-5', studentId: sp1.id, skillId: 'skl-git', proficiencyLevel: 'EXPERT', yearsOfExperience: 3 },
      { id: 'ssk-6', studentId: sp1.id, skillId: 'skl-dsa', proficiencyLevel: 'ADVANCED', yearsOfExperience: 3 },
      { id: 'ssk-7', studentId: sp1.id, skillId: 'skl-rest', proficiencyLevel: 'ADVANCED', yearsOfExperience: 2 },
      { id: 'ssk-8', studentId: sp1.id, skillId: 'skl-micro', proficiencyLevel: 'INTERMEDIATE', yearsOfExperience: 1 },
      // Priya skills
      { id: 'ssk-9', studentId: sp2.id, skillId: 'skl-python', proficiencyLevel: 'EXPERT', yearsOfExperience: 3 },
      { id: 'ssk-10', studentId: sp2.id, skillId: 'skl-docker', proficiencyLevel: 'ADVANCED', yearsOfExperience: 2 },
      { id: 'ssk-11', studentId: sp2.id, skillId: 'skl-k8s', proficiencyLevel: 'INTERMEDIATE', yearsOfExperience: 1 },
      { id: 'ssk-12', studentId: sp2.id, skillId: 'skl-aws', proficiencyLevel: 'INTERMEDIATE', yearsOfExperience: 2 },
      { id: 'ssk-13', studentId: sp2.id, skillId: 'skl-sql', proficiencyLevel: 'ADVANCED', yearsOfExperience: 3 },
    ];

    // 5. Companies
    const c1: Company = {
      id: 'cmp-1',
      userId: uCompany1.id,
      companyName: 'Nexus Financial Technologies',
      description: 'Global fintech leader building high-speed payment clearing, distributed transaction engines, and banking infrastructure.',
      website: 'https://nexusfintech.io',
      industry: 'Fintech & Banking',
      location: 'Bengaluru / Hybrid',
      logoUrl: '',
      verified: true,
    };

    const c2: Company = {
      id: 'cmp-2',
      userId: uCompany2.id,
      companyName: 'CloudScale Systems',
      description: 'Next-generation cloud infrastructure company powering enterprise Kubernetes automation and edge telemetry.',
      website: 'https://cloudscale.ai',
      industry: 'Enterprise Cloud & DevOps',
      location: 'Hyderabad / Pune',
      logoUrl: '',
      verified: true,
    };

    const companies = [c1, c2];

    // 6. Jobs
    const j1: Job = {
      id: 'job-1',
      companyId: c1.id,
      title: 'Graduate Software Engineer (Java Fullstack)',
      description: 'Join the Core Banking Platform team. You will build and scale resilient microservices handling millions of daily settlement transactions, write clean Spring Boot services, and integrate modern responsive web portals.',
      jobType: 'FULL_TIME',
      location: 'Bengaluru, India',
      salaryMin: 1400000, // 14 LPA
      salaryMax: 1800000, // 18 LPA
      experienceRequired: 0,
      educationRequired: 'B.Tech / B.E in CS / IT / ECE',
      minCgpa: 8.0,
      deadline: '2026-11-15T23:59:59.000Z',
      status: 'ACTIVE',
      createdAt: '2026-09-01T10:00:00.000Z',
    };

    const j2: Job = {
      id: 'job-2',
      companyId: c2.id,
      title: 'Cloud Infrastructure & DevOps Intern',
      description: 'Seeking proactive engineering interns to assist in orchestrating containerized microservices, writing Terraform automation scripts, and instrumenting observability pipelines using Prometheus and Grafana.',
      jobType: 'INTERNSHIP',
      location: 'Hyderabad, India (Hybrid)',
      salaryMin: 50000, // 50k/month
      salaryMax: 70000, // 70k/month
      experienceRequired: 0,
      educationRequired: 'B.Tech / B.E in any engineering branch',
      minCgpa: 7.5,
      deadline: '2026-10-30T23:59:59.000Z',
      status: 'ACTIVE',
      createdAt: '2026-09-05T14:30:00.000Z',
    };

    const j3: Job = {
      id: 'job-3',
      companyId: c1.id,
      title: 'Backend Systems Engineer - High Throughput',
      description: 'Architect low-latency financial gateways. Requires rock-solid mastery of Java concurrent programming, Kafka distributed event queues, and PostgreSQL indexing.',
      jobType: 'FULL_TIME',
      location: 'Pune / Bengaluru',
      salaryMin: 1800000, // 18 LPA
      salaryMax: 2400000, // 24 LPA
      experienceRequired: 0,
      educationRequired: 'B.Tech CS / IT',
      minCgpa: 8.5,
      deadline: '2026-11-20T23:59:59.000Z',
      status: 'ACTIVE',
      createdAt: '2026-09-10T09:15:00.000Z',
    };

    const jobs = [j1, j2, j3];

    // 7. Job Skills (Weights 1 to 5, required flags for explainable matching)
    const jobSkills: JobSkill[] = [
      // Job 1: Java Fullstack
      { id: 'js-1', jobId: j1.id, skillId: 'skl-java', required: true, importanceWeight: 5 },
      { id: 'js-2', jobId: j1.id, skillId: 'skl-spring', required: true, importanceWeight: 5 },
      { id: 'js-3', jobId: j1.id, skillId: 'skl-sql', required: true, importanceWeight: 4 },
      { id: 'js-4', jobId: j1.id, skillId: 'skl-react', required: false, importanceWeight: 3 },
      { id: 'js-5', jobId: j1.id, skillId: 'skl-git', required: true, importanceWeight: 3 },
      { id: 'js-6', jobId: j1.id, skillId: 'skl-micro', required: false, importanceWeight: 3 },
      // Job 2: DevOps Intern
      { id: 'js-7', jobId: j2.id, skillId: 'skl-docker', required: true, importanceWeight: 5 },
      { id: 'js-8', jobId: j2.id, skillId: 'skl-k8s', required: true, importanceWeight: 4 },
      { id: 'js-9', jobId: j2.id, skillId: 'skl-aws', required: false, importanceWeight: 4 },
      { id: 'js-10', jobId: j2.id, skillId: 'skl-python', required: false, importanceWeight: 3 },
      { id: 'js-11', jobId: j2.id, skillId: 'skl-git', required: true, importanceWeight: 4 },
      // Job 3: High Throughput Backend
      { id: 'js-12', jobId: j3.id, skillId: 'skl-java', required: true, importanceWeight: 5 },
      { id: 'js-13', jobId: j3.id, skillId: 'skl-kafka', required: true, importanceWeight: 5 },
      { id: 'js-14', jobId: j3.id, skillId: 'skl-sql', required: true, importanceWeight: 4 },
      { id: 'js-15', jobId: j3.id, skillId: 'skl-redis', required: false, importanceWeight: 3 },
      { id: 'js-16', jobId: j3.id, skillId: 'skl-micro', required: true, importanceWeight: 4 },
    ];

    // 8. Applications
    const app1: Application = {
      id: 'app-1',
      studentId: sp1.id,
      jobId: j1.id,
      appliedAt: '2026-09-03T11:20:00.000Z',
      status: 'INTERVIEW',
      resumeUrl: sp1.resumeUrl,
      coverLetter: 'I am deeply enthusiastic about Nexus Fintech. Having built microservice projects with Spring Boot and ACID relational storage, I would love to contribute to your core transaction rails.',
      updatedAt: '2026-09-18T16:00:00.000Z',
    };

    const app2: Application = {
      id: 'app-2',
      studentId: sp1.id,
      jobId: j3.id,
      appliedAt: '2026-09-12T14:10:00.000Z',
      status: 'SHORTLISTED',
      resumeUrl: sp1.resumeUrl,
      coverLetter: 'Passionate about concurrent Java systems and event streaming architectures.',
      updatedAt: '2026-09-15T10:30:00.000Z',
    };

    const app3: Application = {
      id: 'app-3',
      studentId: sp2.id,
      jobId: j2.id,
      appliedAt: '2026-09-08T09:45:00.000Z',
      status: 'ASSESSMENT',
      resumeUrl: sp2.resumeUrl,
      coverLetter: 'Experienced with Docker containerization, Kubernetes manifest development, and cloud pipelines.',
      updatedAt: '2026-09-14T11:00:00.000Z',
    };

    const applications = [app1, app2, app3];

    // 9. Application Timelines
    const applicationTimelines: ApplicationTimeline[] = [
      {
        id: 'atl-1',
        applicationId: app1.id,
        status: 'APPLIED',
        changedAt: '2026-09-03T11:20:00.000Z',
        comment: 'Application submitted through CampusConnect portal.',
      },
      {
        id: 'atl-2',
        applicationId: app1.id,
        status: 'SHORTLISTED',
        changedAt: '2026-09-07T14:00:00.000Z',
        comment: 'Profile cleared automated CGPA and Core Java skill thresholds (Match Score 94%).',
      },
      {
        id: 'atl-3',
        applicationId: app1.id,
        status: 'ASSESSMENT',
        changedAt: '2026-09-11T10:30:00.000Z',
        comment: 'Online Coding Assessment cleared (Score: 98/100, Clean DSA implementation).',
      },
      {
        id: 'atl-4',
        applicationId: app1.id,
        status: 'INTERVIEW',
        changedAt: '2026-09-18T16:00:00.000Z',
        comment: 'Technical Round 1 scheduled with Staff Backend Architect for Spring Boot & System Design.',
      },
      {
        id: 'atl-5',
        applicationId: app2.id,
        status: 'APPLIED',
        changedAt: '2026-09-12T14:10:00.000Z',
        comment: 'Application submitted for High Throughput Backend.',
      },
      {
        id: 'atl-6',
        applicationId: app2.id,
        status: 'SHORTLISTED',
        changedAt: '2026-09-15T10:30:00.000Z',
        comment: 'Resume shortlisted by Talent Acquisition team.',
      },
      {
        id: 'atl-7',
        applicationId: app3.id,
        status: 'APPLIED',
        changedAt: '2026-09-08T09:45:00.000Z',
        comment: 'Application submitted for Cloud & DevOps Intern.',
      },
      {
        id: 'atl-8',
        applicationId: app3.id,
        status: 'ASSESSMENT',
        changedAt: '2026-09-14T11:00:00.000Z',
        comment: 'Docker & Linux bash test link sent to candidate.',
      },
    ];

    // 10. Career Goals
    const careerGoals: CareerGoal[] = [
      {
        id: 'cg-1',
        studentId: sp1.id,
        targetRole: 'Distributed Backend Engineer / SDE-1',
        targetIndustry: 'Fintech & Cloud Systems',
        targetLocation: 'Bengaluru / Hyderabad',
        targetDate: '2026-12-31',
      },
      {
        id: 'cg-2',
        studentId: sp2.id,
        targetRole: 'Site Reliability / Cloud Platform Engineer',
        targetIndustry: 'Enterprise SaaS & Cloud',
        targetLocation: 'Hyderabad / Pune',
        targetDate: '2026-12-31',
      },
    ];

    // 11. Placement Readiness
    const placementReadiness: PlacementReadiness[] = [
      {
        id: 'pr-1',
        studentId: sp1.id,
        technicalScore: 92,
        projectScore: 88,
        resumeScore: 85,
        interviewScore: 82,
        overallScore: 87.5,
        calculatedAt: '2026-09-20T08:00:00.000Z',
      },
      {
        id: 'pr-2',
        studentId: sp2.id,
        technicalScore: 86,
        projectScore: 90,
        resumeScore: 82,
        interviewScore: 80,
        overallScore: 85.2,
        calculatedAt: '2026-09-20T08:30:00.000Z',
      },
    ];

    // 12. Skill Gaps
    const skillGaps: SkillGap[] = [
      {
        id: 'sg-1',
        studentId: sp1.id,
        jobId: j3.id,
        skillId: 'skl-kafka',
        status: 'MISSING',
        priority: 'HIGH',
      },
      {
        id: 'sg-2',
        studentId: sp1.id,
        jobId: j3.id,
        skillId: 'skl-redis',
        status: 'NEEDS_IMPROVEMENT',
        priority: 'MEDIUM',
      },
    ];

    // 13. Learning Recommendations
    const learningRecommendations: LearningRecommendation[] = [
      {
        id: 'lr-1',
        studentId: sp1.id,
        skillId: 'skl-kafka',
        recommendation: 'Build a sample event-driven producer-consumer microservice using Spring Cloud Stream and Apache Kafka broker on Docker.',
        priority: 'HIGH',
        completed: false,
      },
      {
        id: 'lr-2',
        studentId: sp1.id,
        skillId: 'skl-redis',
        recommendation: 'Implement distributed session management and read-through caching in your portfolio project using Spring Data Redis.',
        priority: 'MEDIUM',
        completed: true,
      },
      {
        id: 'lr-3',
        studentId: sp1.id,
        skillId: 'skl-micro',
        recommendation: 'Study Saga pattern for distributed transactions in financial platforms to prepare for System Design interviews.',
        priority: 'HIGH',
        completed: false,
      },
    ];

    // 14. Resume Analysis
    const resumeAnalyses: ResumeAnalysis[] = [
      {
        id: 'ra-1',
        studentId: sp1.id,
        jobId: j1.id,
        matchPercentage: 92,
        matchedSkills: ['Java', 'Spring Boot', 'SQL & Relational DBs', 'React.js', 'Git & GitHub', 'RESTful API Design'],
        missingSkills: ['Microservices Architecture (production metrics)'],
        recommendations: [
          'Highlight specific transaction throughput metrics (e.g. TPS handled, latency reduction) in your Spring Boot project section.',
          'Quantify database query optimization results (e.g. indexing reduced query time by 60%).',
          'Ensure GitHub link is clickable in PDF export format.',
        ],
        analyzedAt: '2026-09-18T10:00:00.000Z',
      },
    ];

    return {
      users,
      studentProfiles,
      skills,
      studentSkills,
      companies,
      jobs,
      jobSkills,
      applications,
      applicationTimelines,
      careerGoals,
      placementReadiness,
      skillGaps,
      learningRecommendations,
      resumeAnalyses,
    };
  }
}

export const db = new DatabaseManager();
