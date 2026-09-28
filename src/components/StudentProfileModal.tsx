import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { StudentSkillItem, SkillItem } from '../types/index.js';
import { X, Plus, Trash2, Save, GraduationCap, Github, Linkedin, Check } from 'lucide-react';

interface StudentProfileModalProps {
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ onClose }) => {
  const { studentProfile, user, refreshProfile } = useAuth();

  const [college, setCollege] = useState(studentProfile?.college || 'National Institute of Technology');
  const [degree, setDegree] = useState(studentProfile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(studentProfile?.branch || 'Computer Science and Engineering');
  const [graduationYear, setGraduationYear] = useState(studentProfile?.graduationYear || 2026);
  const [cgpa, setCgpa] = useState(studentProfile?.cgpa || 8.85);
  const [location, setLocation] = useState(studentProfile?.location || 'Bengaluru');
  const [githubUrl, setGithubUrl] = useState(studentProfile?.githubUrl || 'https://github.com/aaravsharma-dev');
  const [linkedinUrl, setLinkedinUrl] = useState(studentProfile?.linkedinUrl || 'https://linkedin.com/in/aarav-sharma-tech');
  const [bio, setBio] = useState(studentProfile?.bio || '');

  const [studentSkills, setStudentSkills] = useState<StudentSkillItem[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillItem[]>([]);
  const [selectedNewSkillId, setSelectedNewSkillId] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('INTERMEDIATE');
  const [selectedExp, setSelectedExp] = useState(2);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = async () => {
    try {
      const p = await api.getStudentProfile();
      setStudentSkills(p.skills || []);
      const allS = await api.getSkills();
      setAvailableSkills(allS);
      if (allS.length > 0) {
        setSelectedNewSkillId(allS[0].id);
      }
    } catch (err) {
      console.error('Failed to load student profile data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateStudentProfile({
        college,
        degree,
        branch,
        graduationYear: Number(graduationYear),
        cgpa: Number(cgpa),
        location,
        githubUrl,
        linkedinUrl,
        bio,
      });
      await refreshProfile();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedNewSkillId) return;
    try {
      await api.addStudentSkill(selectedNewSkillId, selectedProficiency, Number(selectedExp));
      await loadData();
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await api.deleteStudentSkill(skillId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Student Profile & Skill Inventory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.name} · {user?.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Academic Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Academic & Placement Transcripts
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">University / College</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Degree Program</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Engineering Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Passout Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Cumulative CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">GitHub Portfolio</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded outline-none font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1 text-xs">
                Professional Bio & Technical Summary
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded outline-none text-xs"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Saved' : 'Save Transcript'}</span>
              </button>
            </div>
          </form>

          {/* Skills Management */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Verified Skills Inventory ({studentSkills.length})
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used directly by the matching algorithm to calculate fit percentages.
                </p>
              </div>
            </div>

            {/* Current Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {studentSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{sk.skill?.name}</div>
                    <div className="text-slate-500 text-xs">
                      {sk.proficiencyLevel} · {sk.yearsOfExperience}y experience
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(sk.skillId)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Controls */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-slate-800">Add Technical Competency</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <select
                  value={selectedNewSkillId}
                  onChange={(e) => setSelectedNewSkillId(e.target.value)}
                  className="p-2 border border-slate-300 rounded bg-white sm:col-span-2"
                >
                  {availableSkills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value)}
                  className="p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
