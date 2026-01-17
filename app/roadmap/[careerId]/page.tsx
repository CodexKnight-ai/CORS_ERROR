"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronUp, Clock, Award } from "lucide-react";
import type { Roadmap, Module, SubModule } from "@/lib/types/roadmap";
import careersData from "@/lib/data/careers.json";
import { saveProgress, loadProgress, calculateModuleProgress, updateModuleStatus } from "@/lib/utils/progress";
import VideoRecommendations from "@/components/roadmap/VideoRecommendations";

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const careerId = parseInt(params.careerId as string);

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [completedSubModules, setCompletedSubModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRoadmap();
  }, [careerId]);

  const loadRoadmap = async () => {
    try {
      // Find career data
      const career = careersData.find((c: any) => c.id === careerId);
      if (!career) {
        router.push("/results");
        return;
      }

      // Check if roadmap exists in sessionStorage
      let storedRoadmap = sessionStorage.getItem(`roadmap_${careerId}`);
      
      if (!storedRoadmap) {
        // Generate new roadmap via API
        const response = await fetch("/api/generate-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            careerId,
            careerData: {
              field_name: career.field_name,
              field_description: career.field_description,
              skills_required: career.skills_required,
              difficulty_rating: career.difficulty_rating,
              entry_level_duration: career.entry_level_duration,
            },
          }),
        });

        if (!response.ok) throw new Error("Failed to generate roadmap");

        const data = await response.json();
        sessionStorage.setItem(`roadmap_${careerId}`, JSON.stringify(data.roadmap));
        storedRoadmap = JSON.stringify(data.roadmap);
      }

      const parsedRoadmap: Roadmap = JSON.parse(storedRoadmap);

      // Load progress from localStorage
      const progress = loadProgress(careerId);
      if (progress) {
        setCompletedSubModules(new Set(progress.completedSubModules));
        
        // Update roadmap with progress
        parsedRoadmap.modules = parsedRoadmap.modules.map(module => {
          const moduleProgress = progress.moduleProgress[module.id] || 0;
          return {
            ...module,
            progress: moduleProgress,
            status: updateModuleStatus(moduleProgress),
            subModules: module.subModules.map(sub => ({
              ...sub,
              completed: progress.completedSubModules.includes(sub.id),
            })),
          };
        });
        parsedRoadmap.overallProgress = progress.overallProgress;
      }

      setRoadmap(parsedRoadmap);
      setLoading(false);
      
      // Update last accessed in dashboard
      updateLastAccessed(careerId);
    } catch (error) {
      console.error("Error loading roadmap:", error);
      setLoading(false);
    }
  };

  const updateLastAccessed = async (careerId: number) => {
    try {
      await fetch("/api/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          careerId,
          updateLastAccessed: true 
        }),
      });
    } catch (error) {
      // Silent fail - not critical
    }
  };

  const toggleSubModule = (moduleId: string, subModuleId: string) => {
    if (!roadmap) return;

    const newCompleted = new Set(completedSubModules);
    if (newCompleted.has(subModuleId)) {
      newCompleted.delete(subModuleId);
    } else {
      newCompleted.add(subModuleId);
    }
    setCompletedSubModules(newCompleted);

    // Calculate new progress
    const moduleProgress: Record<string, number> = {};
    const updatedModules = roadmap.modules.map(module => {
      const completedCount = module.subModules.filter(sub => 
        newCompleted.has(sub.id)
      ).length;
      const progress = calculateModuleProgress(completedCount, module.subModules.length);
      moduleProgress[module.id] = progress;

      return {
        ...module,
        progress,
        status: updateModuleStatus(progress),
        subModules: module.subModules.map(sub => ({
          ...sub,
          completed: newCompleted.has(sub.id),
        })),
      };
    });

    const overallProgress = Math.round(
      Object.values(moduleProgress).reduce((a, b) => a + b, 0) / Object.keys(moduleProgress).length
    );

    // Update state
    setRoadmap({
      ...roadmap,
      modules: updatedModules,
      overallProgress,
    });

    // Save to localStorage
    saveProgress(careerId, Array.from(newCompleted), moduleProgress, overallProgress);
    
    // Sync progress to dashboard (MongoDB)
    syncProgressToDashboard(careerId, overallProgress);
  };

  const syncProgressToDashboard = async (careerId: number, progress: number) => {
    try {
      await fetch("/api/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          careerId, 
          progress,
          updateLastAccessed: true 
        }),
      });
    } catch (error) {
      console.error("Error syncing progress to dashboard:", error);
      // Silent fail - localStorage still works
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Generating your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-black text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Roadmap not found</h2>
          <button
            onClick={() => router.push("/results")}
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/results")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{roadmap.careerName}</h1>
              <p className="text-gray-400">Learning Roadmap</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{roadmap.overallProgress}%</div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${roadmap.overallProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
              <span>Estimated Duration: {roadmap.estimatedDuration}</span>
              <span>{roadmap.modules.filter(m => m.status === 'completed').length} / {roadmap.modules.length} modules completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.modules.map((module, index) => {
            const isExpanded = expandedModule === module.id;
            const statusColors = {
              pending: 'bg-gray-500/20 border-gray-500/40 text-gray-300',
              'in-progress': 'bg-blue-500/20 border-blue-500/40 text-blue-300',
              completed: 'bg-green-500/20 border-green-500/40 text-green-300',
            };

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: isExpanded ? 1 : 1.02 }}
                className={`
                  border rounded-xl overflow-hidden transition-all duration-300
                  backdrop-blur-sm
                  ${isExpanded 
                    ? 'md:col-span-2 lg:col-span-3 border-green-500/30 bg-gradient-to-br from-green-500/10 to-white/5 shadow-2xl shadow-green-500/10' 
                    : 'border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-green-500/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                  }
                `}
              >
                {/* Compact View */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                        className="px-3 py-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white text-sm font-bold shadow-lg shadow-green-500/30"
                      >
                        D{index + 1}
                      </motion.div>
                      <h3 className="text-lg font-bold">{module.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">{module.description}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-4 h-4 text-green-400" />
                      {module.duration}
                    </div>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[module.status]}`}
                    >
                      {module.status === 'pending' ? 'Pending' : module.status === 'in-progress' ? 'In Progress' : 'Completed'}
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${module.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{module.progress}% complete</div>
                </div>

                {/* Expanded View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 space-y-4">
                        <h4 className="font-semibold mb-3">Sub-Modules:</h4>
                        {module.subModules.map((subModule, subIndex) => (
                          <motion.div
                            key={subModule.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                            className={`
                              flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer
                              ${subModule.completed 
                                ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/15' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-500/30'
                              }
                            `}
                            onClick={() => toggleSubModule(module.id, subModule.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <motion.div 
                              className="mt-0.5"
                              animate={{ 
                                scale: subModule.completed ? [1, 1.2, 1] : 1,
                                rotate: subModule.completed ? [0, 10, 0] : 0
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {subModule.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </motion.div>
                            <div className="flex-1">
                              <h5 className={`font-medium mb-1 ${subModule.completed ? 'line-through text-gray-400' : ''}`}>
                                {subModule.title}
                              </h5>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {subModule.topics.map((topic, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {subModule.duration}
                                </span>
                                <span>•</span>
                                <span>{subModule.resources.join(", ")}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Video Recommendations */}
                        {roadmap.videos[module.id] && roadmap.videos[module.id].length > 0 && (
                          <VideoRecommendations 
                            videos={roadmap.videos[module.id]} 
                            moduleId={module.id}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Message */}
        {roadmap.overallProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 p-8 border border-green-500/30 rounded-lg bg-green-500/10 text-center"
          >
            <Award className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
            <p className="text-gray-300 mb-6">
              You've completed the entire learning roadmap for {roadmap.careerName}!
            </p>
            <button
              onClick={() => router.push("/results")}
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Explore More Careers
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
