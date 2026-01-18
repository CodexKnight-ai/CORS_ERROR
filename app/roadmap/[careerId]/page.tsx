"use client";

import { useEffect, useState, useMemo ,useRef} from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Circle, ChevronDown,
  Clock, Target, ExternalLink, BookOpen, Sparkles
} from "lucide-react";

import type { Career, CareerRecommendation } from "@/lib/types/careers";
import type { Roadmap, Module, SubModule } from "@/lib/types/roadmap";
import careersDataRaw from "@/lib/data/careers.json";
const careersData = careersDataRaw as Career[];

import { saveProgress, loadProgress, calculateModuleProgress, updateModuleStatus } from "@/lib/utils/progress";
import SkillGapAnalysis from "@/components/roadmap/SkillGapAnalysis";
import CircularProgress from "@/components/roadmap/CircularProgress";

// --- Sub-Component: Enhanced Course Recommendations ---
function CourseRecommendations({ courses }: { courses: any[] }) {
  if (!courses || courses.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center bg-white/[0.01]">
        <p className="text-gray-500 text-sm italic">Curating specialized resources for this module...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      {courses.map((course, idx) => (
        <motion.a
          key={idx}
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
          className="flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all group shadow-xl"
        >
          {/* Course Thumbnail */}
          <div className="relative h-32 w-full bg-neutral-900 overflow-hidden">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-indigo-900/20">
                <BookOpen className="w-8 h-8 text-white/10" />
              </div>
            )}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-black/70 backdrop-blur-md text-[10px] font-bold text-blue-400 rounded border border-white/10 uppercase tracking-widest">
                {course.partner || "Professional"}
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-1">
            <h5 className="text-sm font-bold text-gray-100 line-clamp-2 mb-3 leading-snug group-hover:text-blue-400 transition-colors">
              {course.title}
            </h5>

            <div className="mt-auto flex items-center justify-between">
              {course.similarity && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[10px] font-bold text-green-500/90 uppercase tracking-tighter">
                    {Math.round(course.similarity * 100)}% Match
                  </span>
                </div>
              )}
              <div className="text-gray-500 group-hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}

// --- Main Page Component ---
export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const careerId = parseInt(params.careerId as string);
  const containerRef = useRef<HTMLDivElement>(null);

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [completedSubModules, setCompletedSubModules] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  const acquiredSkills = useMemo(() => {
    if (!roadmap) return new Set<string>();
    const skills = new Set<string>();
    roadmap.modules.forEach((module: Module) => {
      if (module.status === 'completed' && module.relatedSkills) {
        module.relatedSkills.forEach((skill: string) => skills.add(skill));
      }
    });
    return skills;
  }, [roadmap]);

  const skillAcquisitionProgress = useMemo(() => {
    if (!roadmap || !roadmap.missingSkills || roadmap.missingSkills.length === 0) return 0;
    const normalizedAcquired = new Set(Array.from(acquiredSkills).map(s => s.toLowerCase()));
    const learnedCount = roadmap.missingSkills.filter((skill: string) =>
      normalizedAcquired.has(skill.toLowerCase())
    ).length;
    return Math.round((learnedCount / roadmap.missingSkills.length) * 100);
  }, [roadmap, acquiredSkills]);

  const loadRoadmapData = async () => {
    try {
      let career: Career | undefined;
      const storedRecs = sessionStorage.getItem("careerRecommendations");
      if (storedRecs) {
        const data = JSON.parse(storedRecs);
        const recommendations: CareerRecommendation[] = data.recommendations || [];
        career = recommendations.find(r => r.career.id === careerId)?.career;
      }

      if (!career) career = careersData.find((c) => c.id === careerId);
      if (!career) { router.push("/results"); return; }

      let parsedRoadmap: Roadmap | null = null;
      let storedRoadmap = sessionStorage.getItem(`roadmap_${careerId}`);

      if (!storedRoadmap) {
        const response = await fetch("/api/generate-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            careerId,
            careerData: career,
            missingSkills: career.missing_skills || career.skills_required || [],
            recognizedSkills: career.recognized_skills || [],
          }),
        });

        if (!response.ok) throw new Error("Failed to generate roadmap");
        const data = await response.json();
        storedRoadmap = JSON.stringify(data.roadmap);
        sessionStorage.setItem(`roadmap_${careerId}`, storedRoadmap);
      }

      parsedRoadmap = JSON.parse(storedRoadmap!);
      const progress = loadProgress(careerId);
      if (progress && parsedRoadmap) {
        setCompletedSubModules(new Set(progress.completedSubModules));
        parsedRoadmap.modules = parsedRoadmap.modules.map((module: Module) => {
          const moduleProgress = progress.moduleProgress[module.id] || 0;
          return {
            ...module,
            progress: moduleProgress,
            status: updateModuleStatus(moduleProgress),
            subModules: module.subModules.map((sub: SubModule) => ({
              ...sub,
              completed: progress.completedSubModules.includes(sub.id),
            })),
          };
        });
        parsedRoadmap.overallProgress = progress.overallProgress;
      }

      setRoadmap(parsedRoadmap);
      setLoading(false);
    } catch (error) {
      console.error("Error loading roadmap:", error);
      setLoading(false);
    }
  };
  useEffect(() => { loadRoadmapData(); }, [careerId]);

  

  const toggleSubModule = (moduleId: string, subModuleId: string) => {
    if (!roadmap) return;
    const newCompleted = new Set(completedSubModules);
    newCompleted.has(subModuleId) ? newCompleted.delete(subModuleId) : newCompleted.add(subModuleId);
    setCompletedSubModules(newCompleted);

    const moduleProgressRecord: Record<string, number> = {};
    const updatedModules = roadmap.modules.map((module: Module) => {
      const completedCount = module.subModules.filter((sub: SubModule) => newCompleted.has(sub.id)).length;
      const progress = calculateModuleProgress(completedCount, module.subModules.length);
      moduleProgressRecord[module.id] = progress;
      return {
        ...module,
        progress,
        status: updateModuleStatus(progress),
        subModules: module.subModules.map((sub: SubModule) => ({
          ...sub,
          completed: newCompleted.has(sub.id),
        })),
      };
    });

    const overallProgress = Math.round(
      Object.values(moduleProgressRecord).reduce((a, b) => a + b, 0) / updatedModules.length
    );

    setRoadmap({ ...roadmap, modules: updatedModules, overallProgress });
    saveProgress(careerId, Array.from(newCompleted), moduleProgressRecord, overallProgress);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 animate-pulse font-medium">Building your career path...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Responsive Floating Progress */}
      <div className="fixed bottom-6 right-6 md:top-6 md:bottom-auto z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4"
        >
          <CircularProgress percentage={skillAcquisitionProgress} size={50} strokeWidth={5} showPercentage />
          <div className="hidden sm:block">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mastery</p>
            <p className="text-xs font-bold">Skills Acquired</p>
          </div>
        </motion.div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-all">
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Exit Roadmap</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Personalized</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              {roadmap?.careerName}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-medium">
              A data-driven learning path to bridge your skill gaps. Estimated duration: <span className="text-white">{roadmap?.estimatedDuration}</span>
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 min-w-[280px] backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Overall Progress</span>
              <span className="text-2xl font-black text-green-400">{roadmap?.overallProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${roadmap?.overallProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-green-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-16 space-y-20">
        <section>
          <SkillGapAnalysis
            recognizedSkills={roadmap?.recognizedSkills || []}
            missingSkills={roadmap?.missingSkills || []}
            acquiredSkills={acquiredSkills}
          />
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            Learning Modules
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {roadmap?.modules.map((module, idx) => {
              const isExpanded = expandedModule === module.id;
              return (
                <motion.div
                  key={module.id}
                  layout
                  className={`group border rounded-[2.5rem] transition-all duration-500 overflow-hidden ${isExpanded
                      ? 'bg-white/[0.04] border-white/20 shadow-2xl'
                      : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                    }`}
                >
                  <div
                    className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${isExpanded ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-gray-600'
                        }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{module.title}</h3>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tighter text-gray-500">
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {module.duration || "Self-paced"}</span>
                          <span className="text-gray-800">•</span>
                          <span className={module.progress === 100 ? 'text-green-500' : 'text-blue-500'}>
                            {module.progress}% Complete
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`ml-auto p-3 rounded-full transition-all ${isExpanded ? 'bg-white/10 rotate-180' : 'bg-white/5 text-gray-600'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                      >
                        <div className="p-8 pt-10">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left: Interactive Checklist */}
                            <div className="lg:col-span-7 space-y-6">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Module Curriculum</p>
                              <div className="space-y-3">
                                {module.subModules.map((sub) => (
                                  <div
                                    key={sub.id}
                                    onClick={(e) => { e.stopPropagation(); toggleSubModule(module.id, sub.id); }}
                                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 group/item ${sub.completed ? 'bg-green-500/5 border-green-500/20 opacity-70' : 'bg-white/[0.02] border-white/5 hover:border-blue-500/40'
                                      }`}
                                  >
                                    <div className="transition-transform group-hover/item:scale-110">
                                      {sub.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-gray-700" />}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className={`text-base font-bold ${sub.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                        {sub.title}
                                      </h4>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {sub.topics.map((t, i) => (
                                          <span key={i} className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-gray-500 uppercase">{t}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Right: Courses Side Panel */}
                            <div className="lg:col-span-5 space-y-6">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Learning Materials</p>
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Powered by Coursera</span>
                              </div>
                              <CourseRecommendations courses={(module as any).suggestedCourses} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}