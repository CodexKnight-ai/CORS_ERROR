"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trophy, Brain } from "lucide-react";

interface SkillGapAnalysisProps {
  recognizedSkills: string[];
  missingSkills: string[];
  acquiredSkills: Set<string>;
}

export default function SkillGapAnalysis({ 
  recognizedSkills = [], 
  missingSkills = [], 
  acquiredSkills 
}: SkillGapAnalysisProps) {
  // Calculate stats
  const normalizedAcquired = new Set(Array.from(acquiredSkills).map(s => s.toLowerCase()));
  const totalToLearn = missingSkills.length;
  const learnedCount = missingSkills.filter(skill => normalizedAcquired.has(skill.toLowerCase())).length;
  const progress = totalToLearn > 0 ? Math.round((learnedCount / totalToLearn) * 100) : 0;

  return (
    <div className="mb-12 bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Skill Gap Analysis</h2>
            <p className="text-sm text-gray-400">Track your journey from current skills to career readiness</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Skill Acquisition Progress</span>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-xl font-bold text-white">{progress}%</span>
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 text-xs text-right text-gray-400">
            {learnedCount} of {totalToLearn} key skills acquired
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recognized Skills (Already Have) */}
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Skills You Have
            </h3>
            <div className="flex flex-wrap gap-2">
              {recognizedSkills.length > 0 ? (
                recognizedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-200"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">No prior skills identified</span>
              )}
            </div>
          </div>

          {/* Missing Skills (To Learn) */}
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <Circle className="w-4 h-4" />
              Skills To Learn
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => {
                const isAcquired = normalizedAcquired.has(skill.toLowerCase());
                return (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{
                      backgroundColor: isAcquired ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      borderColor: isAcquired ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.1)",
                      color: isAcquired ? "rgb(191, 219, 254)" : "rgb(156, 163, 175)"
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors"
                  >
                    {isAcquired ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-gray-500" />
                    )}
                    {skill}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
