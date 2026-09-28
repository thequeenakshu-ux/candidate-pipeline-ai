import {
  User,
  StudentProfile,
  CompanyProfile,
  JobCardDTO,
  ExplainableMatch,
  SkillGapAnalysis,
  LearningRecommendation,
  PlacementReadiness,
  StudentApplicationItem,
  JobApplicantItem,
  PlacementAnalytics,
  ResumeAnalysisResult,
  SkillItem,
  StudentSkillItem,
  ApplicationStatus,
} from '../types/index.js';

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('campusconnect_jwt_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...(options.headers || {}),
    };

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || `Request failed with status ${response.status}`);
    }

    return json.data as T;
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{
      token: string;
      user: User;
      studentProfile?: StudentProfile;
      companyProfile?: CompanyProfile;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'COMPANY' | 'ADMIN';
    college?: string;
    branch?: string;
    cgpa?: number;
    companyName?: string;
  }) {
    return this.request<{
      token: string;
      user: User;
      studentProfile?: StudentProfile;
      companyProfile?: CompanyProfile;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<{
      token: string;
      user: User;
      studentProfile?: StudentProfile;
      companyProfile?: CompanyProfile;
    }>('/auth/me');
  }

  // Jobs
  async getJobs(params?: { search?: string; jobType?: string; minSalary?: number; minCgpa?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.jobType) query.append('jobType', params.jobType);
    if (params?.minSalary) query.append('minSalary', String(params.minSalary));
    if (params?.minCgpa) query.append('minCgpa', String(params.minCgpa));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<JobCardDTO[]>(`/jobs${qs}`);
  }

  async getJobById(id: string) {
    return this.request<JobCardDTO & { companyWebsite?: string; companyDescription?: string }>(`/jobs/${id}`);
  }

  async createJob(jobData: {
    title: string;
    description: string;
    jobType: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    experienceRequired: number;
    educationRequired: string;
    minCgpa: number;
    deadline: string;
    skills: Array<{ skillId: string; required: boolean; importanceWeight: number }>;
  }) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // Skills Catalog
  async getSkills() {
    return this.request<SkillItem[]>('/skills');
  }

  // Explainable Matching
  async getExplainableMatch(jobId: string) {
    return this.request<ExplainableMatch>(`/matching/explain/${jobId}`);
  }

  // Skill Gaps & Roadmap
  async getSkillGaps(jobId: string) {
    return this.request<SkillGapAnalysis>(`/skill-gaps/analyze/${jobId}`);
  }

  async getLearningRecommendations() {
    return this.request<LearningRecommendation[]>('/skill-gaps/recommendations');
  }

  async toggleRecommendation(id: string) {
    return this.request<LearningRecommendation>(`/skill-gaps/recommendations/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Placement Readiness
  async getReadiness() {
    return this.request<PlacementReadiness>('/readiness/compute');
  }

  // Resume Analyzer
  async analyzeResume(jobId: string, resumeText: string) {
    return this.request<ResumeAnalysisResult>('/resume/analyze', {
      method: 'POST',
      body: JSON.stringify({ jobId, resumeText }),
    });
  }

  // Applications
  async applyForJob(jobId: string, coverLetter?: string, resumeUrl?: string) {
    return this.request('/applications/apply', {
      method: 'POST',
      body: JSON.stringify({ jobId, coverLetter, resumeUrl }),
    });
  }

  async getMyApplications() {
    return this.request<StudentApplicationItem[]>('/applications/my-applications');
  }

  async getJobApplicants(jobId: string) {
    return this.request<JobApplicantItem[]>(`/applications/job/${jobId}`);
  }

  async updateApplicationStatus(applicationId: string, status: ApplicationStatus, comment?: string) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  }

  // Student Profile
  async getStudentProfile() {
    return this.request<StudentProfile & { skills: StudentSkillItem[] }>('/students/profile');
  }

  async updateStudentProfile(profileData: Partial<StudentProfile>) {
    return this.request<StudentProfile>('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async addStudentSkill(skillId: string, proficiencyLevel: string, yearsOfExperience: number) {
    return this.request('/students/skills', {
      method: 'POST',
      body: JSON.stringify({ skillId, proficiencyLevel, yearsOfExperience }),
    });
  }

  async deleteStudentSkill(skillId: string) {
    return this.request(`/students/skills/${skillId}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics() {
    return this.request<PlacementAnalytics>('/analytics/overview');
  }

  // Spring Boot Source Code
  async getSpringBootFiles() {
    return this.request<Array<{ filename: string; category: string; language: string; code: string }>>(
      '/export/spring-boot-files'
    );
  }
}

export const api = new ApiClient();
