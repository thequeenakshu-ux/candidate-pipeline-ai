import { Router, Response } from 'express';
import crypto from 'crypto';
import {
  authService,
  jobMatchingService,
  skillGapService,
  placementReadinessService,
  resumeAnalysisService,
  applicationService,
  analyticsService,
} from '../services/index.js';
import {
  userRepository,
  jobRepository,
  companyRepository,
  studentRepository,
  skillRepository,
  applicationRepository,
  skillGapRepository,
} from '../repositories/index.js';
import {
  authenticateToken,
  authorizeRoles,
  AuthenticatedRequest,
} from '../security/jwt.js';
import { getSpringBootProjectFiles } from '../export/springBootCode.js';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & IDENTITY
// ==========================================
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return res.status(400).json({ success: false, message });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid credentials';
    return res.status(401).json({ success: false, message });
  }
});

apiRouter.get('/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated' });
    const result = await authService.getCurrentUser(req.user.id);
    return res.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve profile';
    return res.status(404).json({ success: false, message });
  }
});

// ==========================================
// 2. SKILLS CATALOG
// ==========================================
apiRouter.get('/skills', (_req, res) => {
  const skills = skillRepository.findAll();
  return res.json({ success: true, data: skills });
});

// ==========================================
// 3. JOBS & DISCOVERY
// ==========================================
apiRouter.get('/jobs', (req, res) => {
  try {
    const { search, jobType, location, minSalary, minCgpa } = req.query;
    let jobs = jobRepository.findAll();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
      );
    }

    if (jobType && typeof jobType === 'string') {
      jobs = jobs.filter((j) => j.jobType === jobType);
    }

    if (location && typeof location === 'string') {
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (minSalary) {
      jobs = jobs.filter((j) => j.salaryMax >= Number(minSalary));
    }

    if (minCgpa) {
      jobs = jobs.filter((j) => j.minCgpa <= Number(minCgpa));
    }

    const applications = applicationRepository.findAll();

    const dtos = jobs.map((job) => {
      const company = companyRepository.findById(job.companyId);
      const skills = jobRepository.getJobSkills(job.id).map((js) => ({
        id: js.skill.id,
        name: js.skill.name,
        category: js.skill.category,
        required: js.required,
        importanceWeight: js.importanceWeight,
      }));
      const applicantCount = applications.filter((a) => a.jobId === job.id).length;

      return {
        id: job.id,
        companyId: job.companyId,
        companyName: company?.companyName || 'Corporate Partner',
        companyLogo: company?.logoUrl || '',
        companyLocation: company?.location || job.location,
        title: job.title,
        description: job.description,
        jobType: job.jobType,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        experienceRequired: job.experienceRequired,
        educationRequired: job.educationRequired,
        minCgpa: job.minCgpa,
        deadline: job.deadline,
        status: job.status,
        createdAt: job.createdAt,
        applicantCount,
        skills,
      };
    });

    return res.json({ success: true, data: dtos });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query jobs';
    return res.status(500).json({ success: false, message });
  }
});

apiRouter.get('/jobs/:id', (req, res) => {
  const job = jobRepository.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  const company = companyRepository.findById(job.companyId);
  const skills = jobRepository.getJobSkills(job.id).map((js) => ({
    id: js.skill.id,
    name: js.skill.name,
    category: js.skill.category,
    required: js.required,
    importanceWeight: js.importanceWeight,
  }));
  const applicantCount = applicationRepository.findByJobId(job.id).length;

  return res.json({
    success: true,
    data: {
      ...job,
      companyName: company?.companyName || 'Corporate Partner',
      companyLogo: company?.logoUrl || '',
      companyLocation: company?.location || job.location,
      companyWebsite: company?.website || '',
      companyDescription: company?.description || '',
      applicantCount,
      skills,
    },
  });
});

apiRouter.post(
  '/jobs',
  authenticateToken,
  authorizeRoles('COMPANY', 'ADMIN'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      let company = companyRepository.findByUserId(user.id);
      if (!company) {
        // Fallback for admin or auto-link
        const companies = companyRepository.findAll();
        company = companies[0];
      }

      if (!company) {
        return res.status(400).json({ success: false, message: 'No associated company profile' });
      }

      const {
        title,
        description,
        jobType,
        location,
        salaryMin,
        salaryMax,
        experienceRequired,
        educationRequired,
        minCgpa,
        deadline,
        skills,
      } = req.body;

      const newJob = {
        id: `job-${crypto.randomUUID()}`,
        companyId: company.id,
        title,
        description,
        jobType: jobType || 'FULL_TIME',
        location: location || company.location,
        salaryMin: Number(salaryMin) || 1200000,
        salaryMax: Number(salaryMax) || 1600000,
        experienceRequired: Number(experienceRequired) || 0,
        educationRequired: educationRequired || 'B.Tech / B.E',
        minCgpa: Number(minCgpa) || 7.0,
        deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'ACTIVE' as const,
        createdAt: new Date().toISOString(),
      };

      jobRepository.save(newJob);

      if (Array.isArray(skills) && skills.length > 0) {
        jobRepository.setJobSkills(newJob.id, skills);
      }

      return res.status(201).json({ success: true, data: newJob });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Job creation failed';
      return res.status(500).json({ success: false, message });
    }
  }
);

// ==========================================
// 4. EXPLAINABLE JOB MATCHING
// ==========================================
apiRouter.get('/matching/explain/:jobId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = studentRepository.findByUserId(req.user!.id);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Must be logged in with a Student profile to view personalized match.',
      });
    }

    const match = jobMatchingService.calculateExplainableMatch(student.id, req.params.jobId);
    return res.json({ success: true, data: match });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Calculation error';
    return res.status(500).json({ success: false, message });
  }
});

apiRouter.get('/matching/recommended', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = studentRepository.findByUserId(req.user!.id);
    if (!student) {
      return res.status(400).json({ success: false, message: 'Student profile required' });
    }

    const allJobs = jobRepository.findAll().filter((j) => j.status === 'ACTIVE');
    const scoredJobs = allJobs.map((job) => {
      const match = jobMatchingService.calculateExplainableMatch(student.id, job.id);
      const company = companyRepository.findById(job.companyId);
      return {
        ...job,
        companyName: company?.companyName || 'Corporate Partner',
        matchScore: match.overallMatchScore,
        isEligible: match.isEligible,
        explainableSummary: match.explainableSummary,
      };
    });

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({ success: true, data: scoredJobs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve recommendations';
    return res.status(500).json({ success: false, message });
  }
});

// ==========================================
// 5. SKILL GAP ANALYSIS & ROADMAP
// ==========================================
apiRouter.get('/skill-gaps/analyze/:jobId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = studentRepository.findByUserId(req.user!.id);
    if (!student) {
      return res.status(400).json({ success: false, message: 'Student profile required' });
    }

    const analysis = skillGapService.analyzeSkillGaps(student.id, req.params.jobId);
    return res.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Skill gap evaluation failed';
    return res.status(500).json({ success: false, message });
  }
});

apiRouter.get('/skill-gaps/recommendations', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const student = studentRepository.findByUserId(req.user!.id);
  if (!student) return res.status(400).json({ success: false, message: 'Student profile required' });

  const recs = skillGapRepository.getLearningRecommendations(student.id);
  return res.json({ success: true, data: recs });
});

apiRouter.patch('/skill-gaps/recommendations/:id/toggle', authenticateToken, (req, res) => {
  const updated = skillGapRepository.toggleRecommendation(req.params.id);
  if (!updated) return res.status(404).json({ success: false, message: 'Recommendation not found' });
  return res.json({ success: true, data: updated });
});

// ==========================================
// 6. PLACEMENT READINESS SCORECARD
// ==========================================
apiRouter.get('/readiness/compute', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = studentRepository.findByUserId(req.user!.id);
    if (!student) return res.status(400).json({ success: false, message: 'Student profile required' });

    const readiness = placementReadinessService.computeReadiness(student.id);
    return res.json({ success: true, data: readiness });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to calculate readiness';
    return res.status(500).json({ success: false, message });
  }
});

// ==========================================
// 7. RESUME & JD ANALYSIS
// ==========================================
apiRouter.post('/resume/analyze', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = studentRepository.findByUserId(req.user!.id);
    if (!student) return res.status(400).json({ success: false, message: 'Student profile required' });

    const { jobId, resumeText } = req.body;
    if (!jobId || !resumeText) {
      return res.status(400).json({ success: false, message: 'jobId and resumeText are required' });
    }

    const analysis = resumeAnalysisService.analyzeResume(student.id, jobId, resumeText);
    return res.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Resume parsing failed';
    return res.status(500).json({ success: false, message });
  }
});

// ==========================================
// 8. APPLICATIONS & PIPELINE
// ==========================================
apiRouter.post('/applications/apply', authenticateToken, authorizeRoles('STUDENT'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = studentRepository.findByUserId(req.user!.id);
    if (!student) return res.status(400).json({ success: false, message: 'Student profile required' });

    const { jobId, coverLetter, resumeUrl } = req.body;
    const application = applicationService.applyForJob(student.id, jobId, coverLetter, resumeUrl);
    return res.status(201).json({ success: true, data: application });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Application submission failed';
    return res.status(400).json({ success: false, message });
  }
});

apiRouter.get('/applications/my-applications', authenticateToken, authorizeRoles('STUDENT'), (req: AuthenticatedRequest, res: Response) => {
  const student = studentRepository.findByUserId(req.user!.id);
  if (!student) return res.status(400).json({ success: false, message: 'Student profile required' });

  const apps = applicationRepository.findByStudentId(student.id);
  const enriched = apps.map((app) => {
    const job = jobRepository.findById(app.jobId);
    const company = job ? companyRepository.findById(job.companyId) : undefined;
    const timeline = applicationRepository.getTimeline(app.id);
    return {
      ...app,
      jobTitle: job?.title || 'Unknown Position',
      jobType: job?.jobType,
      location: job?.location,
      companyName: company?.companyName || 'Corporate Partner',
      salaryMax: job?.salaryMax,
      timeline,
    };
  });

  return res.json({ success: true, data: enriched });
});

apiRouter.get('/applications/job/:jobId', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), (req, res) => {
  const apps = applicationRepository.findByJobId(req.params.jobId);
  const enriched = apps.map((app) => {
    const student = studentRepository.findById(app.studentId);
    const user = student ? userRepository.findById(student.userId) : undefined;
    const timeline = applicationRepository.getTimeline(app.id);
    const match = student ? jobMatchingService.calculateExplainableMatch(student.id, app.jobId) : null;

    return {
      ...app,
      studentName: user?.name || 'Student Candidate',
      studentEmail: user?.email,
      studentCgpa: student?.cgpa,
      studentBranch: student?.branch,
      studentCollege: student?.college,
      matchScore: match?.overallMatchScore || 75,
      timeline,
    };
  });

  return res.json({ success: true, data: enriched });
});

apiRouter.patch('/applications/:id/status', authenticateToken, authorizeRoles('COMPANY', 'ADMIN'), (req, res) => {
  try {
    const { status, comment } = req.body;
    const updated = applicationService.updateStatus(req.params.id, status, comment);
    return res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Status update failed';
    return res.status(400).json({ success: false, message });
  }
});

apiRouter.get('/applications/:id/timeline', authenticateToken, (req, res) => {
  const timeline = applicationRepository.getTimeline(req.params.id);
  return res.json({ success: true, data: timeline });
});

// ==========================================
// 9. STUDENT PROFILE & SKILLS MANAGEMENT
// ==========================================
apiRouter.get('/students/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const student = studentRepository.findByUserId(req.user!.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
  const skills = studentRepository.getStudentSkills(student.id);
  const careerGoal = studentRepository.getCareerGoal(student.id);

  return res.json({
    success: true,
    data: {
      ...student,
      skills,
      careerGoal,
    },
  });
});

apiRouter.put('/students/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const student = studentRepository.findByUserId(req.user!.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

  const { phone, college, degree, branch, graduationYear, cgpa, location, bio, resumeUrl, githubUrl, linkedinUrl } = req.body;
  const updated = studentRepository.save({
    ...student,
    phone: phone ?? student.phone,
    college: college ?? student.college,
    degree: degree ?? student.degree,
    branch: branch ?? student.branch,
    graduationYear: graduationYear ? Number(graduationYear) : student.graduationYear,
    cgpa: cgpa ? Number(cgpa) : student.cgpa,
    location: location ?? student.location,
    bio: bio ?? student.bio,
    resumeUrl: resumeUrl ?? student.resumeUrl,
    githubUrl: githubUrl ?? student.githubUrl,
    linkedinUrl: linkedinUrl ?? student.linkedinUrl,
  });

  return res.json({ success: true, data: updated });
});

apiRouter.post('/students/skills', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const student = studentRepository.findByUserId(req.user!.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

  const { skillId, proficiencyLevel, yearsOfExperience } = req.body;
  const saved = studentRepository.saveSkill({
    id: `ssk-${crypto.randomUUID()}`,
    studentId: student.id,
    skillId,
    proficiencyLevel: proficiencyLevel || 'INTERMEDIATE',
    yearsOfExperience: Number(yearsOfExperience) || 1,
  });

  const allSkills = studentRepository.getStudentSkills(student.id);
  return res.status(201).json({ success: true, data: { saved, currentSkills: allSkills } });
});

apiRouter.delete('/students/skills/:skillId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const student = studentRepository.findByUserId(req.user!.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

  const deleted = studentRepository.deleteSkill(student.id, req.params.skillId);
  return res.json({ success: true, deleted });
});

// ==========================================
// 10. PLACEMENT ANALYTICS
// ==========================================
apiRouter.get('/analytics/overview', (_req, res) => {
  const overview = analyticsService.getOverview();
  return res.json({ success: true, data: overview });
});

// ==========================================
// 11. SPRING BOOT & MYSQL SOURCE EXPORT
// ==========================================
apiRouter.get('/export/spring-boot-files', (_req, res) => {
  const files = getSpringBootProjectFiles();
  return res.json({ success: true, data: files });
});
