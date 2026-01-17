"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { Code2, GraduationCap, Briefcase, Trophy, Save, Trash2, X } from "lucide-react";
import { getId } from "@/lib/helper/getId";
import TestDialog from "@/components/test-dialog";

/* ================= TYPES ================= */

interface Education {
  institution: string;
  degree: string;
  year: string;
  cgpa: string;
}

interface Project {
  name: string;
  description: string;
}

interface Achievement {
  title: string;
  description: string;
}

interface FormData {
  skills: string[];
  education: Education[];
  projects: Project[];
  achievements: Achievement[];
}

/* ================= CONSTANTS ================= */

const HEALTHCARE_STUDENT_SKILLS = [
  "Python",
  "JavaScript",
  "SQL",
  "React",
  "HTML",
  "CSS",
  "Data Analysis",
  "Data Visualization",
  "Excel",
  "Health Informatics",
  "EHR Systems",
  "Patient Data",
  "Dashboards",
  "REST APIs",
  "AI Basics",
  "Machine Learning Basics",
  "Telemedicine",
  "Git",
];

/* ================= SECTION COMPONENT ================= */

const Section = ({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: any;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
    <div className="mb-6 flex items-start gap-4">
      <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

/* ================= MAIN COMPONENT ================= */

export default function HealthcareOnboardingForm() {
  const [formData, setFormData] = useState<FormData>({
    skills: [],
    education: [{ institution: "", degree: "", year: "", cgpa: "" }],
    projects: [{ name: "", description: "" }],
    achievements: [{ title: "", description: "" }],
  });

  const [skillInput, setSkillInput] = useState("");
  const skillInputRef = useRef<HTMLInputElement>(null);
  const [testDialog, setTestDialog] = useState<boolean>(false);

  const input = "w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500";

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (!s || formData.skills.includes(s)) return;
    setFormData((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput("");
    requestAnimationFrame(() => skillInputRef.current?.focus());
  };

  const removeSkill = (skill: string) => {
    setFormData((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData((p) => {
      const edu = [...p.education];
      edu[index][field] = value;
      return { ...p, education: edu };
    });
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setFormData((p) => {
      const projs = [...p.projects];
      projs[index][field] = value;
      return { ...p, projects: projs };
    });
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    setFormData((p) => {
      const achs = [...p.achievements];
      achs[index][field] = value;
      return { ...p, achievements: achs };
    });
  };

  const addItem = <T extends object>(section: keyof Omit<FormData, "skills">, template: T) => {
    setFormData((p) => ({ ...p, [section]: [...p[section], template] }));
  };

  const removeItem = (section: keyof Omit<FormData, "skills">, index: number) => {
    setFormData((p) => {
      const arr = [...p[section]];
      arr.splice(index, 1);
      return { ...p, [section]: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.skills.length === 0) {
      alert("Please add at least one skill");
      return;
    }

    const decoded = await getId();

    const res = await fetch("/api/user/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: decoded.userId,
        skills: formData.skills,
        education: formData.education,
        projects: formData.projects,
        achievements: formData.achievements,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error updating profile:", data.error);
      return;
    }

    setTestDialog(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <header className="mb-14 text-center">
          <h1 className="text-3xl font-semibold">Healthcare Tech Onboarding</h1>
          <p className="text-slate-400">Build your academic & professional profile</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SKILLS */}
          <Section icon={Code2} title="Skills" subtitle="Technical & healthcare-related skills">
            <div className="flex gap-2">
              <input
                ref={skillInputRef}
                className={input}
                placeholder="Add a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                className="rounded-lg bg-indigo-600 px-4 text-sm hover:bg-indigo-500"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {HEALTHCARE_STUDENT_SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {formData.skills.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs"
                >
                  {s}
                  <X size={14} className="cursor-pointer" onClick={() => removeSkill(s)} />
                </span>
              ))}
            </div>
          </Section>

          {/* EDUCATION */}
          <Section icon={GraduationCap} title="Education" subtitle="Academic background">
            {formData.education.map((e, idx) => (
              <div key={idx} className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  className={input}
                  placeholder="Institution"
                  value={e.institution}
                  onChange={(ev) => updateEducation(idx, "institution", ev.target.value)}
                />
                <input
                  required
                  className={input}
                  placeholder="Degree"
                  value={e.degree}
                  onChange={(ev) => updateEducation(idx, "degree", ev.target.value)}
                />
                <input
                  required
                  className={input}
                  placeholder="Year"
                  value={e.year}
                  onChange={(ev) => updateEducation(idx, "year", ev.target.value)}
                />
                <input
                  required
                  className={input}
                  placeholder="CGPA / %"
                  value={e.cgpa}
                  onChange={(ev) => updateEducation(idx, "cgpa", ev.target.value)}
                />
              </div>
            ))}
          </Section>

          {/* PROJECTS */}
          <Section icon={Briefcase} title="Projects" subtitle="Healthcare / data / web projects">
            {formData.projects.map((p, idx) => (
              <div key={idx} className="relative mb-4 rounded-xl border border-white/10 p-4">
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem("projects", idx)}
                    className="absolute right-3 top-3 text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <input
                  required
                  className={`${input} mb-2`}
                  placeholder="Project name"
                  value={p.name}
                  onChange={(e) => updateProject(idx, "name", e.target.value)}
                />
                <textarea
                  required
                  rows={3}
                  className={input}
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) => updateProject(idx, "description", e.target.value)}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("projects", { name: "", description: "" })}
              className="text-sm text-indigo-400"
            >
              + Add project
            </button>
          </Section>

          {/* ACHIEVEMENTS */}
          <Section icon={Trophy} title="Achievements" subtitle="Certifications, hackathons, awards">
            {formData.achievements.map((a, idx) => (
              <div key={idx} className="relative mb-3 flex gap-3">
                {formData.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem("achievements", idx)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <input
                  required
                  className={input}
                  placeholder="Title"
                  value={a.title}
                  onChange={(e) => updateAchievement(idx, "title", e.target.value)}
                />
                <input
                  required
                  className={input}
                  placeholder="Description"
                  value={a.description}
                  onChange={(e) => updateAchievement(idx, "description", e.target.value)}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("achievements", { title: "", description: "" })}
              className="text-sm text-indigo-400"
            >
              + Add achievement
            </button>
          </Section>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium hover:bg-indigo-500"
            >
              <Save size={18} />
              Save Profile
            </button>
          </div>
        </form>
      </div>
      {testDialog && <TestDialog open={testDialog} setOpen={setTestDialog} />}
    </div>
  );
}