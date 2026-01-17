"use client";

import { motion } from "framer-motion";
import { Trash2, ArrowRight, TrendingUp } from "lucide-react";
import type { DashboardRoadmap } from "@/lib/types/careers";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoadmapCardProps {
  roadmap: DashboardRoadmap;
  onRemove: (careerId: number) => void;
}

export default function RoadmapCard({ roadmap, onRemove }: RoadmapCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleStartLearning = () => {
    router.push(`/roadmap/${roadmap.careerId}`);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    await onRemove(roadmap.careerId);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isRemoving ? 0 : 1, scale: isRemoving ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative border border-white/10 rounded-3xl overflow-hidden bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all backdrop-blur-xl group"
    >
      {/* Remove Button */}
      <motion.button
        onClick={handleRemove}
        disabled={isRemoving}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
      </motion.button>

      {/* Card Content */}
      <div className="p-8">
        {/* Progress Badge */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, ease: "easeInOut" }}
            className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-xs font-bold uppercase tracking-wide backdrop-blur-md"
          >
            {roadmap.matchScore}% Match
          </motion.div>
          <div className="text-3xl font-bold text-white drop-shadow-lg">
            {roadmap.progress}%
          </div>
        </div>

        {/* Career Name */}
        <h3 className="text-2xl font-bold mb-4 text-white line-clamp-2 leading-tight">
          {roadmap.careerName}
        </h3>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${roadmap.progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs font-medium text-zinc-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {roadmap.progress === 0 ? "Not started" : roadmap.progress === 100 ? "Completed" : "In progress"}
            </span>
            <span>{roadmap.progress}/100</span>
          </div>
        </div>

        {/* Start Learning Button */}
        <motion.button
          onClick={handleStartLearning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold transition-all bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          {roadmap.progress === 0 ? "Start Learning" : "Continue Learning"}
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Last Accessed */}
        <div className="mt-6 text-[10px] text-zinc-500 text-center uppercase tracking-widest font-medium">
          {roadmap.lastAccessed 
            ? `Last accessed ${formatDate(roadmap.lastAccessed)}`
            : `Added ${formatDate(roadmap.addedAt)}`
          }
        </div>
      </div>
    </motion.div>
  );
}
