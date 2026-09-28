export interface SpringBootFile {
  filename: string;
  category: 'Entity' | 'Repository' | 'Service' | 'Controller' | 'Security' | 'Config' | 'SQL';
  language: string;
  code: string;
}

export function getSpringBootProjectFiles(): SpringBootFile[] {
  return [
    {
      filename: 'pom.xml',
      category: 'Config',
      language: 'xml',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>
    <groupId>com.campusconnect</groupId>
    <artifactId>placement-platform</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>CampusConnect Placement Intelligence Platform</name>
    <description>College Placement &amp; Internship Management with Explainable Job Matching</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.11.5</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT Authentication -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Developer Tooling -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>
    </dependencies>
</project>`,
    },
    {
      filename: 'User.java',
      category: 'Entity',
      language: 'java',
      code: `package com.campusconnect.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean active = true;

    public enum Role {
        STUDENT, COMPANY, ADMIN
    }
}`,
    },
    {
      filename: 'StudentProfile.java',
      category: 'Entity',
      language: 'java',
      code: `package com.campusconnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String phone;
    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private Double cgpa;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudentSkill> skills = new HashSet<>();
}`,
    },
    {
      filename: 'Job.java',
      category: 'Entity',
      language: 'java',
      code: `package com.campusconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobType jobType;

    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Integer experienceRequired;
    private String educationRequired;
    private Double minCgpa;
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<JobSkill> jobSkills = new HashSet<>();

    public enum JobType {
        FULL_TIME, INTERNSHIP, CONTRACT
    }

    public enum JobStatus {
        ACTIVE, CLOSED, DRAFT
    }
}`,
    },
    {
      filename: 'JobMatchingService.java',
      category: 'Service',
      language: 'java',
      code: `package com.campusconnect.service;

import com.campusconnect.dto.ExplainableMatchDTO;
import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobMatchingService {

    private final JobRepository jobRepository;
    private final StudentProfileRepository studentRepository;

    public ExplainableMatchDTO calculateExplainableMatch(Long studentId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
        StudentProfile student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        Set<JobSkill> requiredJobSkills = job.getJobSkills();
        Set<StudentSkill> studentSkills = student.getSkills();

        int totalWeight = 0;
        double earnedWeight = 0.0;
        int requiredCount = 0;
        int requiredMet = 0;

        List<ExplainableMatchDTO.MatchedSkillInfo> matched = new ArrayList<>();
        List<ExplainableMatchDTO.MissingSkillInfo> missing = new ArrayList<>();

        for (JobSkill js : requiredJobSkills) {
            totalWeight += js.getImportanceWeight();
            if (js.getRequired()) requiredCount++;

            Optional<StudentSkill> match = studentSkills.stream()
                    .filter(ss -> ss.getSkill().getId().equals(js.getSkill().getId()))
                    .findFirst();

            if (match.isPresent()) {
                double factor = getProficiencyFactor(match.get().getProficiencyLevel());
                earnedWeight += js.getImportanceWeight() * factor;
                if (js.getRequired()) requiredMet++;

                matched.add(new ExplainableMatchDTO.MatchedSkillInfo(
                        js.getSkill().getName(),
                        js.getRequired(),
                        js.getImportanceWeight(),
                        match.get().getProficiencyLevel().name()
                ));
            } else {
                missing.add(new ExplainableMatchDTO.MissingSkillInfo(
                        js.getSkill().getName(),
                        js.getRequired(),
                        js.getImportanceWeight(),
                        js.getRequired() ? "Critical prerequisite" : "Recommended elective"
                ));
            }
        }

        double skillScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 80.0;
        boolean cgpaEligible = student.getCgpa() != null && student.getCgpa() >= job.getMinCgpa();

        int overallScore = (int) Math.round(skillScore * 0.7 + (requiredCount > 0 ? ((double) requiredMet / requiredCount) * 30 : 30));
        if (!cgpaEligible) overallScore = Math.min(overallScore, 58);

        return ExplainableMatchDTO.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .overallMatchScore(overallScore)
                .isEligible(cgpaEligible && (requiredCount == 0 || requiredMet == requiredCount))
                .matchedSkills(matched)
                .missingSkills(missing)
                .build();
    }

    private double getProficiencyFactor(StudentSkill.ProficiencyLevel level) {
        return switch (level) {
            case EXPERT -> 1.0;
            case ADVANCED -> 0.85;
            case INTERMEDIATE -> 0.70;
            case BEGINNER -> 0.45;
        };
    }
}`,
    },
    {
      filename: 'JobController.java',
      category: 'Controller',
      language: 'java',
      code: `package com.campusconnect.controller;

import com.campusconnect.dto.*;
import com.campusconnect.service.JobMatchingService;
import com.campusconnect.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;
    private final JobMatchingService matchingService;

    @GetMapping
    public ResponseEntity<List<JobResponseDTO>> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) Double minSalary) {
        return ResponseEntity.ok(jobService.getFilteredJobs(search, jobType, minSalary));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<JobResponseDTO> createJob(@Valid @RequestBody CreateJobRequestDTO request) {
        return ResponseEntity.ok(jobService.createJob(request));
    }

    @GetMapping("/{id}/match/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ExplainableMatchDTO> getMatchExplanation(
            @PathVariable Long id,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(matchingService.calculateExplainableMatch(studentId, id));
    }
}`,
    },
    {
      filename: 'schema.sql',
      category: 'SQL',
      language: 'sql',
      code: `-- CampusConnect Normalized Relational Schema for MySQL 8.0+
CREATE DATABASE IF NOT EXISTS campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campusconnect;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'COMPANY', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    INDEX idx_user_email (email)
);

-- 2. Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    phone VARCHAR(25),
    college VARCHAR(150),
    degree VARCHAR(50),
    branch VARCHAR(100),
    graduation_year INT,
    cgpa DECIMAL(3,2),
    location VARCHAR(100),
    bio TEXT,
    resume_url VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL
);

-- 4. Student Skills (Many-to-Many)
CREATE TABLE IF NOT EXISTS student_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL,
    years_of_experience INT DEFAULT 0,
    UNIQUE KEY uq_student_skill (student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 5. Companies
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(100),
    logo_url VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    job_type ENUM('FULL_TIME', 'INTERNSHIP', 'CONTRACT') NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    experience_required INT DEFAULT 0,
    education_required VARCHAR(100),
    min_cgpa DECIMAL(3,2) DEFAULT 0.0,
    deadline DATETIME,
    status ENUM('ACTIVE', 'CLOSED', 'DRAFT') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 7. Job Skills
CREATE TABLE IF NOT EXISTS job_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    importance_weight INT DEFAULT 3,
    UNIQUE KEY uq_job_skill (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 8. Applications
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('APPLIED', 'SHORTLISTED', 'ASSESSMENT', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN') DEFAULT 'APPLIED',
    resume_url VARCHAR(255),
    cover_letter TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_app_student_job (student_id, job_id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 9. Application Timelines
CREATE TABLE IF NOT EXISTS application_timelines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);`,
    },
  ];
}
