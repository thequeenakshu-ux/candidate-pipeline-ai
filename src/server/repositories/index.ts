import crypto from 'crypto';
import { db } from '../database/db.js';
import {
  User,
  StudentProfile,
  Company,
  Job,
  Skill,
  JobSkill,
  StudentSkill,
  Application,
  ApplicationTimeline,
  CareerGoal,
  PlacementReadiness,
  SkillGap,
  LearningRecommendation,
  ResumeAnalysis,
  ApplicationStatus,
} from '../entities/types.js';

export class UserRepository {
  findById(id: string): User | undefined {
    return db.data.users.find((u) => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    return db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  save(user: User): User {
    const existingIndex = db.data.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      db.data.users[existingIndex] = user;
    } else {
      db.data.users.push(user);
    }
    db.saveToDisk();
    return user;
  }
}

export class StudentRepository {
  findById(id: string): StudentProfile | undefined {
    return db.data.studentProfiles.find((sp) => sp.id === id);
  }

  findByUserId(userId: string): StudentProfile | undefined {
    return db.data.studentProfiles.find((sp) => sp.userId === userId);
  }

  findAll(): StudentProfile[] {
    return [...db.data.studentProfiles];
  }

  save(profile: StudentProfile): StudentProfile {
    const index = db.data.studentProfiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      db.data.studentProfiles[index] = profile;
    } else {
      db.data.studentProfiles.push(profile);
    }
    db.saveToDisk();
    return profile;
  }

  getStudentSkills(studentId: string): Array<StudentSkill & { skill: Skill }> {
    const sSkills = db.data.studentSkills.filter((ss) => ss.studentId === studentId);
    return sSkills
      .map((ss) => {
        const skill = db.data.skills.find((s) => s.id === ss.skillId);
        if (!skill) return null;
        return {
          ...ss,
          skill,
        };
      })
      .filter(Boolean) as Array<StudentSkill & { skill: Skill }>;
  }

  saveSkill(studentSkill: StudentSkill): StudentSkill {
    const idx = db.data.studentSkills.findIndex(
      (s) => s.studentId === studentSkill.studentId && s.skillId === studentSkill.skillId
    );
    if (idx >= 0) {
      db.data.studentSkills[idx] = studentSkill;
    } else {
      db.data.studentSkills.push(studentSkill);
    }
    db.saveToDisk();
    return studentSkill;
  }

  deleteSkill(studentId: string, skillId: string): boolean {
    const beforeCount = db.data.studentSkills.length;
    db.data.studentSkills = db.data.studentSkills.filter(
      (s) => !(s.studentId === studentId && s.skillId === skillId)
    );
    if (db.data.studentSkills.length !== beforeCount) {
      db.saveToDisk();
      return true;
    }
    return false;
  }

  getCareerGoal(studentId: string): CareerGoal | undefined {
    return db.data.careerGoals.find((cg) => cg.studentId === studentId);
  }

  saveCareerGoal(goal: CareerGoal): CareerGoal {
    const idx = db.data.careerGoals.findIndex((g) => g.studentId === goal.studentId);
    if (idx >= 0) {
      db.data.careerGoals[idx] = goal;
    } else {
      db.data.careerGoals.push(goal);
    }
    db.saveToDisk();
    return goal;
  }
}

export class CompanyRepository {
  findById(id: string): Company | undefined {
    return db.data.companies.find((c) => c.id === id);
  }

  findByUserId(userId: string): Company | undefined {
    return db.data.companies.find((c) => c.userId === userId);
  }

  findAll(): Company[] {
    return [...db.data.companies];
  }

  save(company: Company): Company {
    const index = db.data.companies.findIndex((c) => c.id === company.id);
    if (index >= 0) {
      db.data.companies[index] = company;
    } else {
      db.data.companies.push(company);
    }
    db.saveToDisk();
    return company;
  }
}

export class JobRepository {
  findById(id: string): Job | undefined {
    return db.data.jobs.find((j) => j.id === id);
  }

  findAll(): Job[] {
    return [...db.data.jobs];
  }

  findByCompanyId(companyId: string): Job[] {
    return db.data.jobs.filter((j) => j.companyId === companyId);
  }

  save(job: Job): Job {
    const idx = db.data.jobs.findIndex((j) => j.id === job.id);
    if (idx >= 0) {
      db.data.jobs[idx] = job;
    } else {
      db.data.jobs.push(job);
    }
    db.saveToDisk();
    return job;
  }

  getJobSkills(jobId: string): Array<JobSkill & { skill: Skill }> {
    const jSkills = db.data.jobSkills.filter((js) => js.jobId === jobId);
    return jSkills
      .map((js) => {
        const skill = db.data.skills.find((s) => s.id === js.skillId);
        if (!skill) return null;
        return {
          ...js,
          skill,
        };
      })
      .filter(Boolean) as Array<JobSkill & { skill: Skill }>;
  }

  setJobSkills(jobId: string, skills: Array<{ skillId: string; required: boolean; importanceWeight: number }>): void {
    db.data.jobSkills = db.data.jobSkills.filter((js) => js.jobId !== jobId);
    for (const item of skills) {
      db.data.jobSkills.push({
        id: `js-${crypto.randomUUID()}`,
        jobId,
        skillId: item.skillId,
        required: item.required,
        importanceWeight: item.importanceWeight,
      });
    }
    db.saveToDisk();
  }
}

export class SkillRepository {
  findAll(): Skill[] {
    return [...db.data.skills];
  }

  findById(id: string): Skill | undefined {
    return db.data.skills.find((s) => s.id === id);
  }

  findByName(name: string): Skill | undefined {
    return db.data.skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
  }

  save(skill: Skill): Skill {
    const idx = db.data.skills.findIndex((s) => s.id === skill.id);
    if (idx >= 0) {
      db.data.skills[idx] = skill;
    } else {
      db.data.skills.push(skill);
    }
    db.saveToDisk();
    return skill;
  }
}

export class ApplicationRepository {
  findById(id: string): Application | undefined {
    return db.data.applications.find((a) => a.id === id);
  }

  findAll(): Application[] {
    return [...db.data.applications];
  }

  findByStudentId(studentId: string): Application[] {
    return db.data.applications.filter((a) => a.studentId === studentId);
  }

  findByJobId(jobId: string): Application[] {
    return db.data.applications.filter((a) => a.jobId === jobId);
  }

  findByStudentAndJob(studentId: string, jobId: string): Application | undefined {
    return db.data.applications.find((a) => a.studentId === studentId && a.jobId === jobId);
  }

  save(app: Application): Application {
    const idx = db.data.applications.findIndex((a) => a.id === app.id);
    if (idx >= 0) {
      db.data.applications[idx] = app;
    } else {
      db.data.applications.push(app);
    }
    db.saveToDisk();
    return app;
  }

  getTimeline(applicationId: string): ApplicationTimeline[] {
    return db.data.applicationTimelines
      .filter((t) => t.applicationId === applicationId)
      .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());
  }

  addTimeline(timeline: ApplicationTimeline): ApplicationTimeline {
    db.data.applicationTimelines.push(timeline);
    db.saveToDisk();
    return timeline;
  }
}

export class ReadinessRepository {
  findByStudentId(studentId: string): PlacementReadiness | undefined {
    return db.data.placementReadiness.find((pr) => pr.studentId === studentId);
  }

  save(readiness: PlacementReadiness): PlacementReadiness {
    const idx = db.data.placementReadiness.findIndex((r) => r.studentId === readiness.studentId);
    if (idx >= 0) {
      db.data.placementReadiness[idx] = readiness;
    } else {
      db.data.placementReadiness.push(readiness);
    }
    db.saveToDisk();
    return readiness;
  }
}

export class SkillGapRepository {
  findByStudentAndJob(studentId: string, jobId: string): SkillGap[] {
    return db.data.skillGaps.filter((sg) => sg.studentId === studentId && sg.jobId === jobId);
  }

  saveAll(gaps: SkillGap[]): void {
    if (gaps.length === 0) return;
    const { studentId, jobId } = gaps[0];
    db.data.skillGaps = db.data.skillGaps.filter(
      (sg) => !(sg.studentId === studentId && sg.jobId === jobId)
    );
    db.data.skillGaps.push(...gaps);
    db.saveToDisk();
  }

  getLearningRecommendations(studentId: string): LearningRecommendation[] {
    return db.data.learningRecommendations.filter((lr) => lr.studentId === studentId);
  }

  saveLearningRecommendation(rec: LearningRecommendation): LearningRecommendation {
    const idx = db.data.learningRecommendations.findIndex((r) => r.id === rec.id);
    if (idx >= 0) {
      db.data.learningRecommendations[idx] = rec;
    } else {
      db.data.learningRecommendations.push(rec);
    }
    db.saveToDisk();
    return rec;
  }

  toggleRecommendation(id: string): LearningRecommendation | undefined {
    const rec = db.data.learningRecommendations.find((r) => r.id === id);
    if (rec) {
      rec.completed = !rec.completed;
      db.saveToDisk();
    }
    return rec;
  }
}

export class ResumeAnalysisRepository {
  findByStudentAndJob(studentId: string, jobId: string): ResumeAnalysis | undefined {
    return db.data.resumeAnalyses.find((ra) => ra.studentId === studentId && ra.jobId === jobId);
  }

  save(analysis: ResumeAnalysis): ResumeAnalysis {
    const idx = db.data.resumeAnalyses.findIndex(
      (a) => a.studentId === analysis.studentId && a.jobId === analysis.jobId
    );
    if (idx >= 0) {
      db.data.resumeAnalyses[idx] = analysis;
    } else {
      db.data.resumeAnalyses.push(analysis);
    }
    db.saveToDisk();
    return analysis;
  }
}

export const userRepository = new UserRepository();
export const studentRepository = new StudentRepository();
export const companyRepository = new CompanyRepository();
export const jobRepository = new JobRepository();
export const skillRepository = new SkillRepository();
export const applicationRepository = new ApplicationRepository();
export const readinessRepository = new ReadinessRepository();
export const skillGapRepository = new SkillGapRepository();
export const resumeAnalysisRepository = new ResumeAnalysisRepository();
