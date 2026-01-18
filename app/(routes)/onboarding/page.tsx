"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { Code2, GraduationCap, Briefcase, Trophy, Save, Trash2, X, Plus } from "lucide-react";
import { getId } from "@/lib/helper/getId";
import TestDialog from "@/components/test-dialog";

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
  "R",
  "Machine Learning",
  "SQL",
  "TensorFlow",
  "PyTorch",
  "Statistics",
  "Data Visualization",
  "Healthcare Regulations",
  "NLP",
  "Computer Vision",
  "EHR Systems (Epic, Cerner, Meditech)",
  "HL7/FHIR",
  "Healthcare Workflows",
  "Project Management",
  "Clinical Knowledge",
  "Data Analysis",
  "System Design",
  "HIPAA Compliance",
  "Node.js/Python/Django",
  "React.js/React Native",
  "WebRTC for video",
  "HL7/FHIR Integration",
  "AWS/Azure",
  "Real-time protocols",
  "Database Design",
  "Security Implementation",
  "Product Strategy",
  "User Research",
  "HIPAA/Compliance",
  "Stakeholder Management",
  "Market Research",
  "Communication",
  "Training & Documentation",
  "Change Management",
  "HIPAA",
  "Problem Solving",
  "Advanced Machine Learning",
  "Deep Learning",
  "System Architecture",
  "Python/C++",
  "Cloud Platforms",
  "FDA Compliance",
  "Data Science",
  "Node.js/TypeScript",
  "React/Vue.js",
  "FHIR APIs",
  "Cloud Architecture",
  "AWS/Azure/GCP",
  "Microservices",
  "API Development",
  "Network Security",
  "HITRUST",
  "Penetration Testing",
  "Vulnerability Assessment",
  "Incident Response",
  "Encryption",
  "Access Control",
  "Security Tools",
  "Risk Management"
];

/* ================= SUB-COMPONENTS ================= */

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
  <section className="group relative rounded-2xl border border-white/5 bg-zinc-900/20 p-8 transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/30">
    <div className="mb-8 flex items-start gap-4">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-white transition-colors group-hover:bg-white/10">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-lg font-medium text-white">{title}</h2>
        <p className="text-sm text-zinc-500">{subtitle}</p>
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

  // Modernized Input Style
  const input = "w-full rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-white/20 focus:bg-zinc-900 focus:ring-1 focus:ring-white/20";

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

    // Send form data to suggest-roles API and save the response
    try {
      const suggestRolesRes = await fetch("/api/admin/suggest-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: formData.skills,
          education: formData.education,
          projects: formData.projects,
          achievements: formData.achievements,
        }),
      });

      if (!suggestRolesRes.ok) {
        const errorText = await suggestRolesRes.text();
        console.error(`Suggest Roles API failed (${suggestRolesRes.status}):`, errorText);
        // Fallback or just ignore to allow the flow to continue
        sessionStorage.setItem("suggestedJobRoles", "[]");
      } else {
        const suggestRolesData = await suggestRolesRes.json();
        console.log("Suggest Roles Response:", suggestRolesData);
        sessionStorage.setItem("suggestedJobRoles", JSON.stringify(suggestRolesData));
      }
    } catch (error) {
      console.error("Error calling suggest-roles API:", error);
      sessionStorage.setItem("suggestedJobRoles", "[]");
    }

    setTestDialog(true);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-white selection:text-black font-poppins">

      {/* Background Grid Pattern (Matching Landing Page) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-xs font-medium text-zinc-300">Profile Setup</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Healthcare Tech Onboarding
          </h1>
          <p className="text-lg text-zinc-500">
            Build your academic & professional profile to get AI-powered recommendations
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SKILLS */}
          <Section icon={Code2} title="Skills" subtitle="Technical & healthcare-related skills">
            <div className="flex gap-3">
              <input
                ref={skillInputRef}
                className={input}
                placeholder="Type a skill and press Enter..."
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
                className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/20"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 py-4">
              {formData.skills.map((s) => (
                <span
                  key={s}
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-300 transition-all hover:border-white/30 hover:text-white"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="ml-1 rounded-full p-0.5 hover:bg-white/20 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="border-t border-white/5">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Suggested Skills</p>
              <div className="flex flex-wrap gap-2">
                {HEALTHCARE_STUDENT_SKILLS.filter(s => !formData.skills.includes(s)).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="rounded-full border border-dashed border-zinc-700 px-3 py-1 text-xs text-zinc-500 transition-all hover:border-zinc-500 hover:text-zinc-300"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* EDUCATION */}
          <Section icon={GraduationCap} title="Education" subtitle="Academic background">
            {formData.education.map((e, idx) => (
              <div key={idx} className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  className={input}
                  placeholder="Institution Name"
                  value={e.institution}
                  onChange={(ev) => updateEducation(idx, "institution", ev.target.value)}
                />
                <input
                  required
                  className={input}
                  placeholder="Degree (e.g. B.Tech)"
                  value={e.degree}
                  onChange={(ev) => updateEducation(idx, "degree", ev.target.value)}
                />
                <input
                  required
                  className={input}
                  placeholder="Year of Completion"
                  value={e.year}
                  onChange={(ev) => updateEducation(idx, "year", ev.target.value)}
                />
                <input
                  required
                  className={input}
                  placeholder="CGPA / Percentage"
                  value={e.cgpa}
                  onChange={(ev) => updateEducation(idx, "cgpa", ev.target.value)}
                />
              </div>
            ))}
          </Section>

          {/* PROJECTS */}
          <Section icon={Briefcase} title="Projects" subtitle="Healthcare / data / web projects">
            <div className="space-y-6">
              {formData.projects.map((p, idx) => (
                <div key={idx} className="group/item relative rounded-xl border border-white/5 bg-zinc-900/30 p-5 transition-all hover:border-white/10">
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("projects", idx)}
                      className="absolute right-4 top-4 text-zinc-500 transition-opacity hover:text-red-400 group-hover/item:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="grid gap-4">
                    <input
                      required
                      className={`${input} font-medium`}
                      placeholder="Project Name"
                      value={p.name}
                      onChange={(e) => updateProject(idx, "name", e.target.value)}
                    />
                    <textarea
                      required
                      rows={3}
                      className={`${input} resize-none`}
                      placeholder="Brief description of the project..."
                      value={p.description}
                      onChange={(e) => updateProject(idx, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addItem("projects", { name: "", description: "" })}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-white hover:text-zinc-300 hover:underline hover:underline-offset-4"
            >
              <Plus size={16} /> Add another project
            </button>
          </Section>

          {/* ACHIEVEMENTS */}
          <Section icon={Trophy} title="Achievements" subtitle="Certifications, hackathons, awards">
            <div className="space-y-4">
              {formData.achievements.map((a, idx) => (
                <div key={idx} className="group/item relative flex gap-4">
                  <div className="flex-1 space-y-4">
                    <input
                      required
                      className={input}
                      placeholder="Achievement Title"
                      value={a.title}
                      onChange={(e) => updateAchievement(idx, "title", e.target.value)}
                    />
                    <input
                      required
                      className={input}
                      placeholder="Description / Organization"
                      value={a.description}
                      onChange={(e) => updateAchievement(idx, "description", e.target.value)}
                    />
                  </div>

                  {formData.achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("achievements", idx)}
                      className="mt-3 text-zinc-500 transition-opacity hover:text-red-400 group-hover/item:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addItem("achievements", { title: "", description: "" })}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-white hover:text-zinc-300 hover:underline hover:underline-offset-4"
            >
              <Plus size={16} /> Add achievement
            </button>
          </Section>

          {/* SUBMIT */}
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="group flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-zinc-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <Save size={18} className="transition-transform group-hover:scale-110" />
              Complete Profile
            </button>
          </div>
        </form>
      </div>
      {testDialog && <TestDialog open={testDialog} setOpen={setTestDialog} />}
    </div>
  );
}