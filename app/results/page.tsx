"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Check,
  Briefcase,
  MapPin,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import type { CareerRecommendation, DashboardState } from "@/lib/types/careers";
import { useRouter } from "next/navigation";
import CareerStatsChart from "@/components/Careerstatschart";

export default function Results() {
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisTime, setAnalysisTime] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [addingToDashboard, setAddingToDashboard] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("careerRecommendations");
    if (stored) {
      const data = JSON.parse(stored);
      console.log("Loaded recommendations:", data);
      setRecommendations(data.recommendations || []);
      setAnalysisTime(data.analysisTime || 0);
    }
    setLoading(false);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  }, []);

  const handleAddToDashboard = async (careerId: number, careerName: string, matchScore: number, similarity?: number) => {
    setAddingToDashboard(careerId);
    try {
      // Find the career data
      const career = recommendations.find(r => r.career.id === careerId)?.career;
      if (!career) {
        alert("Career data not found");
        return;
      }

      // Step 1: Generate roadmap with career data
      // Note: In a full implementation, you would call suggest-roles API here to get skill gap
      // For now, we'll use the career's skills_required as missing skills
      const roadmapResponse = await fetch("/api/generate-roadmap", {
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
          recognizedSkills: career.recognized_skills || [],
          missingSkills: career.missing_skills || career.skills_required,
          gapAnalysis: career.gap_analysis || {
            foundational_gaps: [],
            intermediate_gaps: [],
            advanced_gaps: [],
          },
        }),
      });

      if (!roadmapResponse.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const { roadmap } = await roadmapResponse.json();

      // Step 2: Add to dashboard with roadmap data
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerId,
          careerName,
          matchScore,
          modules: roadmap.modules,
          recognizedSkills: roadmap.recognizedSkills || [],
          missingSkills: roadmap.missingSkills || [],
          gapAnalysis: roadmap.gapAnalysis || null,
          similarity: similarity || roadmap.similarity,
        }),
      });

      if (response.ok) {
        await fetchDashboard();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add to dashboard");
      }
    } catch (error) {
      console.error("Error adding to dashboard:", error);
      alert("Failed to add to dashboard");
    } finally {
      setAddingToDashboard(null);
    }
    setLoading(false);
    fetchDashboard();
  }, [fetchDashboard]);

  const handleAddToDashboard = useCallback(
    async (careerId: number, careerName: string, matchScore: number) => {
      setAddingToDashboard(careerId);
      try {
        const response = await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ careerId, careerName, matchScore }),
        });

        if (response.ok) {
          await fetchDashboard();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to add to dashboard");
        }
      } catch (error) {
        console.error("Error adding to dashboard:", error);
        alert("Failed to add to dashboard");
      } finally {
        setAddingToDashboard(null);
      }
    },
    [fetchDashboard]
  );

  const isInDashboard = useCallback(
    (careerId: number) => dashboard?.roadmaps.some((r) => r.careerId === careerId) || false,
    [dashboard]
  );

  const isDashboardFull = useCallback(
    () => dashboard && dashboard.roadmaps.length >= dashboard.maxRoadmaps,
    [dashboard]
  );

  const handleSelectCareer = useCallback(
    (careerId: number) => {
      setSelectedCareer(careerId);
      setTimeout(() => router.push(`/roadmap/${careerId}`), 500);
    },
    [router]
  );

  const toggleCard = useCallback((index: number) => {
    setExpandedCard((prev) => (prev === index ? null : index));
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Analyzing your interests...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-poppins flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold mb-4">No recommendations found</h2>
          <p className="text-gray-400 mb-6">Please complete the interest detector first.</p>
          <a
            href="/interest-detector"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            Start Interest Detector
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-semibold">SkillOrbit</span>
            </div>
            <div className="flex items-center gap-4">
              {dashboard && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-all text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard ({dashboard.count}/{dashboard.maxRoadmaps})
                </button>
              )}
              <div className="text-sm text-gray-400">
                Analysis completed in {(analysisTime / 1000).toFixed(1)}s
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Your Top 5 Career Matches
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Click on any career to explore details, then select one to generate your personalized
            learning roadmap.
          </p>
        </motion.div>

        {/* Career Cards */}
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => {
            const isExpanded = expandedCard === index;
            const isSelected = selectedCareer === recommendation.career.id;

            return (
              <motion.div
                key={recommendation.career.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeInOut" }}
                whileHover={{ scale: isExpanded ? 1 : 1.02 }}
                className={`
                  relative border rounded-3xl overflow-hidden transition-all duration-300
                  backdrop-blur-xl
                  ${isSelected
                    ? 'border-green-500/50 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                  }
                  ${isExpanded ? 'shadow-2xl shadow-green-500/10' : 'hover:shadow-xl'}
                `}
              >
                {/* Compact Card View */}
                <div
                  className="p-6 cursor-pointer group"
                  onClick={() => setExpandedCard(isExpanded ? null : index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-white/40">#{index + 1}</span>
                        <h2 className="text-2xl font-bold">{recommendation.career.field_name}</h2>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-shrink-0 p-2 rounded-full bg-white/5"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-green-400" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-zinc-400 group-hover:text-green-400 transition-colors" />
                          )}
                        </motion.div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, ease: "easeInOut" }}
                          className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/40 rounded-full text-green-400 text-sm font-semibold shadow-lg shadow-green-500/10"
                        >
                          {((recommendation.similarity ?? recommendation.career.similarity ?? (recommendation.matchScore / 100)) * 100).toFixed(2)}% Match
                        </motion.div>
                        {recommendation.career.recognized_skills && recommendation.career.recognized_skills.length > 0 && (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3, ease: "easeInOut" }}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/40 rounded-full text-blue-400 text-sm font-semibold shadow-lg shadow-blue-500/10"
                          >
                            {recommendation.career.recognized_skills.length} Skill{recommendation.career.recognized_skills.length === 1 ? '' : 's'} Matched
                          </motion.div>
                        )}
                        {/* {recommendation.career.remote_friendly && (
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3, ease: "easeInOut" }}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/40 rounded-full text-blue-400 text-sm font-semibold shadow-lg shadow-blue-500/10"
                          >
                            Remote Friendly
                          </motion.div>
                        )} */}
                      </div>


                      {/* Key Stats - Always Visible */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Salary Range</p>
                            <p className="text-sm font-semibold">{recommendation.career.salary_range_inr || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Growth 2026</p>
                            <p className="text-sm font-semibold">{recommendation.career.demand_growth_2026 || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Entry Duration</p>
                            <p className="text-sm font-semibold">{recommendation.career.entry_level_duration || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Award className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Difficulty</p>
                            <p className="text-sm font-semibold">{recommendation.career.difficulty_rating || 'N/A'}/10</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 space-y-6">
                        {/* Why This Matches */}
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-sm font-semibold text-white mb-2">Why this matches you:</p>
                          <p className="text-sm text-gray-300">{recommendation.reasoning}</p>
                        </div>

                        {/* Description */}
                        <div>
                          <p className="text-sm font-semibold mb-2">About this career:</p>
                          <p className="text-gray-300">{recommendation.career.field_description || 'No description available.'}</p>
                        </div>

                        {/* Skills Required */}
                        {recommendation.career.skills_required && recommendation.career.skills_required.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-3">Key Skills Required:</p>
                            <div className="flex flex-wrap gap-2">
                              {recommendation.career.skills_required.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Industry Focus */}
                        {recommendation.career.industry_focus && recommendation.career.industry_focus.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-3">Industry Focus:</p>
                            <div className="flex flex-wrap gap-2">
                              {recommendation.career.industry_focus.map((industry, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs flex items-center gap-1"
                                >
                                  <MapPin className="w-3 h-3" />
                                  {industry}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Typical Companies */}
                        {recommendation.career.typical_companies && recommendation.career.typical_companies.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-3">Typical Companies:</p>
                            <div className="flex flex-wrap gap-2">
                              {recommendation.career.typical_companies.map((company, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs flex items-center gap-1"
                                >
                                  <Briefcase className="w-3 h-3" />
                                  {company}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Add to Dashboard Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToDashboard(
                                recommendation.career.id,
                                recommendation.career.field_name,
                                recommendation.matchScore,
                                recommendation.similarity || recommendation.career.similarity
                              );
                            }}
                            disabled={isInDashboard(recommendation.career.id) || isDashboardFull() || addingToDashboard === recommendation.career.id}
                            whileHover={!isInDashboard(recommendation.career.id) && !isDashboardFull() ? { scale: 1.02 } : {}}
                            whileTap={!isInDashboard(recommendation.career.id) && !isDashboardFull() ? { scale: 0.98 } : {}}
                            transition={{ ease: "easeInOut" }}
                            className={`
                              flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all
                              ${isInDashboard(recommendation.career.id)
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-default shadow-lg shadow-green-500/30'
                                : isDashboardFull()
                                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/20'
                              }
                            `}
                          >
                            {addingToDashboard === recommendation.career.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                              </>
                            ) : isInDashboard(recommendation.career.id) ? (
                              <>
                                <Check className="w-5 h-5" />
                                In Dashboard
                              </>
                            ) : isDashboardFull() ? (
                              <>
                                Dashboard Full (3/3)
                              </>
                            ) : (
                              <>
                                <Plus className="w-5 h-5" />
                                Add to Dashboard
                              </>
                            )}
                          </motion.button>

                          {/* Select Career Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectCareer(recommendation.career.id);
                            }}
                            disabled={isSelected}
                            whileHover={!isSelected ? { scale: 1.02 } : {}}
                            whileTap={!isSelected ? { scale: 0.98 } : {}}
                            transition={{ ease: "easeInOut" }}
                            className={`
                              flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all
                              ${isSelected
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-default shadow-lg shadow-green-500/30'
                                : 'bg-gradient-to-r from-white to-gray-100 text-black hover:shadow-xl hover:shadow-black/20'
                              }
                            `}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-5 h-5" />
                                Generating Roadmap...
                              </>
                            ) : (
                              <>
                                Start Learning
                                <ArrowRight className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Career Stats Chart - Floating slide-out panel */}
        <CareerStatsChart recommendations={recommendations} />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="p-8 border border-white/10 rounded-lg bg-white/5">
            <h3 className="text-2xl font-bold mb-4">Ready to start your journey?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Select a career above to generate your personalized learning roadmap with curated
              resources and progress tracking.
            </p>
            <a
              href="/interest-detector"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-all"
            >
              Retake Assessment
            </a>
          </div>
        </motion.div>
      </main>

      {/* Floating Dashboard Action */}
      <AnimatePresence>
        {dashboard && dashboard.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 pl-6 pr-8 py-4 bg-green-600 text-white rounded-full font-semibold shadow-lg shadow-green-600/30 hover:bg-green-500 hover:scale-105 active:scale-95 transition-all group"
            >
              <div className="relative">
                <LayoutDashboard className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <div className="text-left">
                <p className="text-xs font-normal text-green-100">Review your path</p>
                <p className="text-sm">Go to Dashboard ({dashboard.count}/3)</p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Extracted CareerCard component for better performance
interface CareerCardProps {
  recommendation: CareerRecommendation;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  isInDashboard: boolean;
  isDashboardFull: boolean;
  isAdding: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onAddToDashboard: () => void;
}

function CareerCard({
  recommendation,
  index,
  isExpanded,
  isSelected,
  isInDashboard,
  isDashboardFull,
  isAdding,
  onToggle,
  onSelect,
  onAddToDashboard,
}: CareerCardProps) {
  const { career, matchScore, reasoning } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: isExpanded ? 1 : 1.01 }}
      className={`
        relative border rounded-xl overflow-hidden transition-all duration-300 backdrop-blur-sm
        ${isSelected
          ? "border-green-500/50 bg-gradient-to-br from-green-500/10 to-white/5 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
          : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        }
        ${isExpanded ? "shadow-2xl shadow-green-500/10" : "hover:shadow-xl"}
      `}
    >
      {/* Compact Card View */}
      <div className="p-6 cursor-pointer group" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-white/40">#{index + 1}</span>
              <h2 className="text-2xl font-bold">{career.field_name}</h2>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-green-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-green-400 transition-colors" />
                )}
              </motion.div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/40 rounded-full text-green-400 text-sm font-semibold shadow-lg shadow-green-500/10"
              >
                {matchScore}% Match
              </motion.div>
              {career.remote_friendly && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/40 rounded-full text-blue-400 text-sm font-semibold shadow-lg shadow-blue-500/10"
                >
                  Remote Friendly
                </motion.div>
              )}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem icon={DollarSign} color="green" label="Salary Range" value={career.salary_range_inr} />
              <StatItem icon={TrendingUp} color="blue" label="Growth 2026" value={career.demand_growth_2026} />
              <StatItem icon={Clock} color="purple" label="Entry Duration" value={career.entry_level_duration} />
              <StatItem icon={Award} color="yellow" label="Difficulty" value={`${career.difficulty_rating}/10`} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-6 space-y-6">
              {/* Why This Matches */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm font-semibold text-white mb-2">Why this matches you:</p>
                <p className="text-sm text-gray-300">{reasoning}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold mb-2">About this career:</p>
                <p className="text-gray-300">{career.field_description}</p>
              </div>

              {/* Skills Required */}
              <TagSection title="Key Skills Required" items={career.skills_required} />

              {/* Industry Focus */}
              <TagSection title="Industry Focus" items={career.industry_focus} icon={MapPin} variant="subtle" />

              {/* Typical Companies */}
              <TagSection title="Typical Companies" items={career.typical_companies} icon={Briefcase} variant="subtle" />

              {/* Action Buttons */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToDashboard();
                  }}
                  disabled={isInDashboard || isDashboardFull || isAdding}
                  variant={isInDashboard ? "success" : isDashboardFull ? "disabled" : "primary"}
                >
                  {isAdding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : isInDashboard ? (
                    <>
                      <Check className="w-5 h-5" />
                      In Dashboard
                    </>
                  ) : isDashboardFull ? (
                    "Dashboard Full (3/3)"
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to Dashboard
                    </>
                  )}
                </ActionButton>

                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                  }}
                  disabled={isSelected}
                  variant={isSelected ? "success" : "white"}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-5 h-5" />
                      Generating Roadmap...
                    </>
                  ) : (
                    <>
                      Start Learning
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </ActionButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Reusable stat item component
interface StatItemProps {
  icon: React.ElementType;
  color: "green" | "blue" | "purple" | "yellow";
  label: string;
  value: string;
}

function StatItem({ icon: Icon, color, label, value }: StatItemProps) {
  const colorClasses = {
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="flex items-start gap-2">
      <Icon className={`w-5 h-5 ${colorClasses[color]} mt-0.5 shrink-0`} />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

// Reusable tag section component
interface TagSectionProps {
  title: string;
  items: string[];
  icon?: React.ElementType;
  variant?: "default" | "subtle";
}

function TagSection({ title, items, icon: Icon, variant = "default" }: TagSectionProps) {
  const tagClasses =
    variant === "default"
      ? "px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs"
      : "px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs flex items-center gap-1";

  return (
    <div>
      <p className="text-sm font-semibold mb-3">{title}:</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className={tagClasses}>
            {Icon && <Icon className="w-3 h-3" />}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Reusable action button component
interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  variant: "primary" | "success" | "disabled" | "white";
  children: React.ReactNode;
}

function ActionButton({ onClick, disabled, variant, children }: ActionButtonProps) {
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/20",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 text-white cursor-default shadow-lg shadow-green-500/30",
    disabled: "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30",
    white:
      "bg-gradient-to-r from-white to-gray-100 text-black hover:shadow-xl hover:shadow-black/20",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all ${variantClasses[variant]}`}
    >
      {children}
    </motion.button>
  );
}