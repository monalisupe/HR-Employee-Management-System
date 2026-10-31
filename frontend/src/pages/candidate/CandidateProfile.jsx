import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  UploadCloud,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CandidateProfile() {
  const { currentCandidate, updateCandidateProfile } = useApp();

  const [formData, setFormData] = useState({
    name: currentCandidate?.name || '',
    email: currentCandidate?.email || '',
    phone: currentCandidate?.phone || '',
    location: currentCandidate?.location || '',
    headline: currentCandidate?.headline || '',
    education: currentCandidate?.education || '',
    experience: currentCandidate?.experience || '',
    skillsInput: currentCandidate?.skills?.join(', ') || '',
    bio: currentCandidate?.bio || '',
    resumeName: currentCandidate?.resumeName || 'Alex_Rivera_Software_Engineer_Resume.pdf',
    resumeSize: currentCandidate?.resumeSize || '248 KB',
  });

  const [mockFileSelected, setMockFileSelected] = useState(false);

  const handleFakeFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        resumeName: file.name,
        resumeSize: `${Math.round(file.size / 1024)} KB`,
      });
      setMockFileSelected(true);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const skills = formData.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateCandidateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      headline: formData.headline,
      education: formData.education,
      experience: formData.experience,
      skills,
      bio: formData.bio,
      resumeName: formData.resumeName,
      resumeSize: formData.resumeSize,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Candidate Profile
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your personal profile, credentials, and resume used for 1-click job applications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-bold flex items-center justify-center text-xl shadow-xs">
              {formData.name.substring(0, 2).toUpperCase() || 'CA'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{formData.name}</h2>
              <p className="text-xs text-slate-500">{formData.headline || 'Job Candidate'}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                Verified Candidate Profile
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Austin, TX (Open to Remote)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Professional Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. Senior Full Stack Engineer & Python Specialist"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Bio / Summary</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Education & Experience */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Education, Experience & Skills
          </h3>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
              Education & Degrees *
            </label>
            <input
              type="text"
              required
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
              Work Experience Summary *
            </label>
            <textarea
              rows={2}
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
              Skills (Comma separated tags) *
            </label>
            <input
              type="text"
              required
              value={formData.skillsInput}
              onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Resume / Curriculum Vitae
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-violet-100 bg-violet-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-600 text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{formData.resumeName}</p>
                <p className="text-xs text-slate-500">File size: {formData.resumeSize} • Ready for application submissions</p>
              </div>
            </div>

            <label className="px-3.5 py-2 bg-white hover:bg-slate-50 text-violet-700 font-semibold text-xs border border-violet-200 rounded-xl cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-2 self-start sm:self-auto">
              <UploadCloud className="h-4 w-4" />
              <span>Select New File</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFakeFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {mockFileSelected && (
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Resume selection updated. Click Save Changes to commit.</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Candidate Profile
          </button>
        </div>
      </form>
    </div>
  );
}

