"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  X,
  ChevronRight,
  BookOpen,
  Zap,
  Target,
  Map,
  List,
  Sparkles,
} from "lucide-react";
import type { Roadmap, Module, SubModule } from "@/lib/types/roadmap";
import careersData from "@/lib/data/careers.json";
import {
  saveProgress,
  loadProgress,
  calculateModuleProgress,
  updateModuleStatus,
} from "@/lib/utils/progress";
import VideoRecommendations from "@/components/roadmap/VideoRecommendations";

// Color palette for branches - Whimsical style
const BRANCH_COLORS = [
  { stroke: "#e879f9", bg: "bg-fuchsia-50", text: "text-fuchsia-500", border: "border-fuchsia-300", badge: "bg-fuchsia-500" },
  { stroke: "#a78bfa", bg: "bg-violet-50", text: "text-violet-500", border: "border-violet-300", badge: "bg-violet-500" },
  { stroke: "#60a5fa", bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-300", badge: "bg-blue-500" },
  { stroke: "#2dd4bf", bg: "bg-teal-50", text: "text-teal-500", border: "border-teal-300", badge: "bg-teal-500" },
  { stroke: "#4ade80", bg: "bg-green-50", text: "text-green-500", border: "border-green-300", badge: "bg-green-500" },
  { stroke: "#fbbf24", bg: "bg-amber-50", text: "text-amber-500", border: "border-amber-300", badge: "bg-amber-500" },
  { stroke: "#fb923c", bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-300", badge: "bg-orange-500" },
  { stroke: "#f87171", bg: "bg-red-50", text: "text-red-500", border: "border-red-300", badge: "bg-red-500" },
] as const;

// Layout constants
const LAYOUT = {
  startY: 140,
  rowHeight: 100,
  branchLength: 250,
  nodeWidth: 280,
} as const;

// Curved branch SVG component
const CurvedBranch = memo(function CurvedBranch({ 
  centerX, 
  y, 
  side, 
  color, 
  delay,
  isActive,
}: { 
  centerX: number;
  y: number;
  side: "left" | "right";
  color: string;
  delay: number;
  isActive: boolean;
}) {
  const endX = side === "right" ? centerX + LAYOUT.branchLength : centerX - LAYOUT.branchLength;
  const direction = side === "right" ? 1 : -1;
  
  // Create smooth S-curve
  const cp1x = centerX + (40 * direction);
  const cp1y = y;
  const cp2x = centerX + (LAYOUT.branchLength * 0.6 * direction);
  const cp2y = y;
  
  const d = `M ${centerX} ${y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${y}`;

  return (
    <g>
      {/* Glow effect */}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        opacity={0.15}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      />
      {/* Main line */}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      />
      {/* Animated dot for in-progress */}
      {isActive && (
        <motion.circle
          r={6}
          fill={color}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: `path("${d}")` }}
        >
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </motion.circle>
      )}
    </g>
  );
});

// Module card component
const ModuleCard = memo(function ModuleCard({
  module,
  index,
  color,
  side,
  onClick,
}: {
  module: Module;
  index: number;
  color: typeof BRANCH_COLORS[number];
  side: "left" | "right";
  onClick: () => void;
}) {
  const isCompleted = module.status === "completed";
  const isInProgress = module.status === "in-progress";

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "right" ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
      whileHover={{ scale: 1.02, x: side === "right" ? 4 : -4 }}
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer group ${side === "left" ? "flex-row-reverse" : ""}`}
    >
      {/* Card */}
      <div 
        className={`
          relative px-4 py-3 rounded-xl bg-white border-2 shadow-sm 
          transition-all duration-200 hover:shadow-lg min-w-[200px] max-w-[280px]
          ${isCompleted ? "border-green-400 bg-green-50/50" : isInProgress ? "border-blue-400 bg-blue-50/50" : color.border}
        `}
      >
        <div className={`flex items-center gap-2 ${side === "left" ? "flex-row-reverse" : ""}`}>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
            Day {index + 1}
          </span>
          <span className="font-semibold text-gray-800 text-sm truncate">{module.title}</span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isCompleted ? "bg-green-500" : isInProgress ? "bg-blue-500" : "bg-gray-300"}`}
            initial={{ width: 0 }}
            animate={{ width: `${module.progress}%` }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
          />
        </div>

        {/* Hover tooltip */}
        <div className={`
          absolute top-full mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl 
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 w-[220px] pointer-events-none
          ${side === "right" ? "left-0" : "right-0"}
        `}>
          <p className="leading-relaxed line-clamp-3">{module.description}</p>
          <div className="mt-2 flex items-center gap-2 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{module.duration}</span>
            <span>•</span>
            <span>{module.subModules.length} topics</span>
          </div>
        </div>
      </div>

      {/* Badge */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg
        transition-transform duration-200 group-hover:scale-110
        ${isCompleted ? "bg-green-500" : isInProgress ? "bg-blue-500" : color.badge}
      `}>
        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : module.subModules.length}
      </div>
    </motion.div>
  );
});

// Memo helper
function memo<T extends React.FC<any>>(Component: T): T {
  return Component;
}

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

  // Calculate dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = containerRef.current?.offsetWidth || window.innerWidth;
      const moduleCount = roadmap?.modules.length || 8;
      const height = LAYOUT.startY + moduleCount * LAYOUT.rowHeight + 120;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [roadmap]);

  // Load roadmap
  useEffect(() => {
    loadRoadmapData();
  }, [careerId]);

  const loadRoadmapData = async () => {
    try {
      const career = careersData.find((c: any) => c.id === careerId);
      if (!career) {
        router.push("/results");
        return;
      }

      let storedRoadmap = sessionStorage.getItem(`roadmap_${careerId}`);

      if (!storedRoadmap) {
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
      const progress = loadProgress(careerId);
      
      if (progress) {
        setCompletedSubModules(new Set(progress.completedSubModules));
        parsedRoadmap.modules = parsedRoadmap.modules.map((module) => {
          const moduleProgress = progress.moduleProgress[module.id] || 0;
          return {
            ...module,
            progress: moduleProgress,
            status: updateModuleStatus(moduleProgress),
            subModules: module.subModules.map((sub) => ({
              ...sub,
              completed: progress.completedSubModules.includes(sub.id),
            })),
          };
        });
        parsedRoadmap.overallProgress = progress.overallProgress;
      }

      setRoadmap(parsedRoadmap);
      setLoading(false);
      
      // Update last accessed
      fetch("/api/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId, updateLastAccessed: true }),
      }).catch(() => {});
    } catch (error) {
      console.error("Error loading roadmap:", error);
      setLoading(false);
    }
  };

  const toggleSubModule = useCallback((moduleId: string, subModuleId: string) => {
    if (!roadmap) return;

    const newCompleted = new Set(completedSubModules);
    newCompleted.has(subModuleId) ? newCompleted.delete(subModuleId) : newCompleted.add(subModuleId);
    setCompletedSubModules(newCompleted);

    const moduleProgress: Record<string, number> = {};
    const updatedModules = roadmap.modules.map((module) => {
      const completedCount = module.subModules.filter((sub) => newCompleted.has(sub.id)).length;
      const progress = calculateModuleProgress(completedCount, module.subModules.length);
      moduleProgress[module.id] = progress;
      return {
        ...module,
        progress,
        status: updateModuleStatus(progress),
        subModules: module.subModules.map((sub) => ({ ...sub, completed: newCompleted.has(sub.id) })),
      };
    });

    const overallProgress = Math.round(
      Object.values(moduleProgress).reduce((a, b) => a + b, 0) / Object.keys(moduleProgress).length
    );

    const updatedRoadmap = { ...roadmap, modules: updatedModules, overallProgress };
    setRoadmap(updatedRoadmap);

    if (selectedModule?.id === moduleId) {
      setSelectedModule(updatedModules.find((m) => m.id === moduleId) || null);
    }

    saveProgress(careerId, Array.from(newCompleted), moduleProgress, overallProgress);
    
    // Sync to dashboard
    fetch("/api/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ careerId, progress: overallProgress, updateLastAccessed: true }),
    }).catch(() => {});
  }, [roadmap, completedSubModules, selectedModule, careerId]);

  // Memoized calculations
  const centerX = useMemo(() => dimensions.width / 2, [dimensions.width]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500 font-medium">Generating your roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Roadmap not found</h2>
          <button
            onClick={() => router.push("/results")}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-poppins">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push("/results")}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Back</span>
              </button>
              <div className="h-5 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{roadmap.careerName}</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Learning Roadmap</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                {(["map", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {mode === "map" ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    <span className="capitalize">{mode}</span>
                  </button>
                ))}
              </div>

              {/* Progress Circle */}
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xl font-bold text-gray-900">{roadmap.overallProgress}%</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
                <div className="w-11 h-11 relative">
                  <svg className="w-11 h-11 -rotate-90">
                    <circle cx="22" cy="22" r="18" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                    <motion.circle
                      cx="22" cy="22" r="18"
                      stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round"
                      initial={{ strokeDasharray: "0 113" }}
                      animate={{ strokeDasharray: `${(roadmap.overallProgress / 100) * 113} 113` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 sm:hidden">
                    {roadmap.overallProgress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24" ref={containerRef}>
        {viewMode === "map" ? (
          /* Mind Map View */
          <div className="relative overflow-x-auto" style={{ minHeight: dimensions.height }}>
            {/* Background pattern */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />

            {/* SVG Layer */}
            <svg 
              className="absolute top-0 left-0 w-full pointer-events-none" 
              style={{ height: dimensions.height, minWidth: dimensions.width }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Trunk line */}
              <motion.line
                x1={centerX} y1={LAYOUT.startY}
                x2={centerX} y2={dimensions.height - 80}
                stroke="#d1d5db"
                strokeWidth={2}
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* Branches */}
              {roadmap.modules.map((module, index) => {
                const y = LAYOUT.startY + 40 + index * LAYOUT.rowHeight;
                const side = index % 2 === 0 ? "right" : "left";
                const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
                
                return (
                  <CurvedBranch
                    key={module.id}
                    centerX={centerX}
                    y={y}
                    side={side}
                    color={color.stroke}
                    delay={index * 0.08}
                    isActive={module.status === "in-progress"}
                  />
                );
              })}
            </svg>

            {/* Center Node */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute z-10"
              style={{ left: centerX, top: LAYOUT.startY - 50, transform: "translateX(-50%)" }}
            >
              <div className="relative">
                {/* Connector dot */}
                <div className="absolute left-1/2 -bottom-6 w-6 h-6 -translate-x-1/2 bg-white rounded-full border-4 border-emerald-400 z-20">
                  <div className="absolute inset-1 rounded-full bg-emerald-400" />
                </div>
                
                {/* Card */}
                <div className="px-5 py-4 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{roadmap.careerName}</h2>
                    <p className="text-sm text-gray-500">{roadmap.estimatedDuration}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Module Nodes */}
            {roadmap.modules.map((module, index) => {
              const y = LAYOUT.startY + 40 + index * LAYOUT.rowHeight;
              const side = index % 2 === 0 ? "right" : "left";
              const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
              
              const positionStyle = side === "right" 
                ? { left: centerX + LAYOUT.branchLength + 16 }
                : { right: dimensions.width - centerX + LAYOUT.branchLength + 16 };

              return (
                <div
                  key={module.id}
                  className="absolute"
                  style={{ top: y - 24, ...positionStyle }}
                >
                  <ModuleCard
                    module={module}
                    index={index}
                    color={color}
                    side={side}
                    onClick={() => setSelectedModule(module)}
                  />
                </div>
              );
            })}

            {/* Fixed Panels */}
            <div className="fixed bottom-6 left-6 z-40 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {roadmap.modules.filter((m) => m.status === "completed").length}/{roadmap.modules.length}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{roadmap.estimatedDuration}</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Legend */}
            <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4"
              >
                <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Status</h4>
                <div className="space-y-2.5">
                  {[
                    { color: "bg-gray-300", label: "Pending" },
                    { color: "bg-blue-500", label: "In Progress", pulse: true },
                    { color: "bg-green-500", label: "Completed" },
                  ].map(({ color, label, pulse }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${color} ${pulse ? "animate-pulse" : ""}`} />
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
            <div className="space-y-3">
              {roadmap.modules.map((module, index) => {
                const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
                const isCompleted = module.status === "completed";
                const isInProgress = module.status === "in-progress";

                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedModule(module)}
                    className={`
                      p-4 sm:p-5 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-200
                      hover:shadow-lg active:scale-[0.99]
                      ${isCompleted ? "border-green-300 bg-green-50/30" : isInProgress ? "border-blue-300 bg-blue-50/30" : color.border}
                    `}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`
                        w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0
                        ${isCompleted ? "bg-green-500" : isInProgress ? "bg-blue-500" : color.badge}
                      `}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : `D${index + 1}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{module.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{module.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </span>
                          <span>{module.subModules.length} topics</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-bold text-gray-900">{module.progress}%</div>
                        <div className="h-1.5 w-16 sm:w-20 bg-gray-100 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isCompleted ? "bg-green-500" : isInProgress ? "bg-blue-500" : "bg-gray-300"
                            }`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 hidden sm:block" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Mobile View Toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:hidden">
        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-1">
          {(["map", "list"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === mode ? "bg-gray-900 text-white" : "text-gray-500"
              }`}
            >
              {mode === "map" ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
              <span className="capitalize">{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Module Detail Panel */}
      <AnimatePresence>
        {selectedModule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModule(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-11 h-11 rounded-xl flex items-center justify-center text-white
                      ${selectedModule.status === "completed" ? "bg-green-500" : selectedModule.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"}
                    `}>
                      {selectedModule.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedModule.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-500">{selectedModule.duration}</span>
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${selectedModule.status === "completed" ? "bg-green-100 text-green-600" :
                            selectedModule.status === "in-progress" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
                        `}>
                          {selectedModule.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedModule(null)} 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedModule.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${selectedModule.status === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedModule.progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-6">
                {/* About */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedModule.description}</p>
                </div>

                {/* Sub-modules */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Topics ({selectedModule.subModules.filter((s) => s.completed).length}/{selectedModule.subModules.length})
                  </h4>
                  <div className="space-y-2.5">
                    {selectedModule.subModules.map((subModule, idx) => (
                      <motion.div
                        key={subModule.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => toggleSubModule(selectedModule.id, subModule.id)}
                        className={`
                          p-3.5 rounded-xl border-2 cursor-pointer transition-all
                          ${subModule.completed 
                            ? "bg-green-50 border-green-200 hover:bg-green-100" 
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <motion.div
                            animate={{ scale: subModule.completed ? [1, 1.15, 1] : 1 }}
                            transition={{ duration: 0.25 }}
                            className="mt-0.5 shrink-0"
                          >
                            {subModule.completed 
                              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                              : <Circle className="w-5 h-5 text-gray-300" />
                            }
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h5 className={`font-medium text-sm ${subModule.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                              {subModule.title}
                            </h5>
                            {subModule.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {subModule.topics.slice(0, 3).map((topic, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-500">
                                    {topic}
                                  </span>
                                ))}
                                {subModule.topics.length > 3 && (
                                  <span className="px-2 py-0.5 text-xs text-gray-400">+{subModule.topics.length - 3}</span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{subModule.duration}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Videos */}
                {roadmap.videos?.[selectedModule.id] && (
                  <VideoRecommendations videos={roadmap.videos[selectedModule.id]} moduleId={selectedModule.id} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Completion Toast */}
      <AnimatePresence>
        {roadmap.overallProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl shadow-emerald-500/25">
              <Award className="w-7 h-7 text-white" />
              <div>
                <h3 className="font-bold text-white">Congratulations! 🎉</h3>
                <p className="text-emerald-100 text-sm">Roadmap completed!</p>
              </div>
              <button
                onClick={() => router.push("/results")}
                className="ml-2 px-4 py-1.5 bg-white text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors"
              >
                Explore More
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}