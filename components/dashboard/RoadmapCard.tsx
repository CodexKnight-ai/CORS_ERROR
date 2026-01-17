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
      className="relative border border-white/10 rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all backdrop-blur-sm"
    >
      {/* Remove Button */}
      <motion.button
        onClick={handleRemove}
        disabled={isRemoving}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 z-10 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg transition-all group"
      >
        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
      </motion.button>

      {/* Card Content */}
      <div className="p-6">
        {/* Progress Badge */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, ease: "easeInOut" }}
            className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/40 rounded-full text-green-400 text-sm font-semibold shadow-lg shadow-green-500/10"
          >
            {roadmap.matchScore}% Match
          </motion.div>
          <div className="text-2xl font-bold text-white">
            {roadmap.progress}%
          </div>
        </div>

        {/* Career Name */}
        <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
          {roadmap.careerName}
        </h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${roadmap.progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
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
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all bg-gradient-to-r from-white to-gray-100 text-black hover:shadow-xl hover:shadow-black/20"
        >
          {roadmap.progress === 0 ? "Start Learning" : "Continue Learning"}
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Last Accessed */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {roadmap.lastAccessed 
            ? `Last accessed ${formatDate(roadmap.lastAccessed)}`
            : `Added ${formatDate(roadmap.addedAt)}`
          }
        </div>
      </div>
    </motion.div>
  );
}
