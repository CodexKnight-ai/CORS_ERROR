"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, DollarSign, Clock, Briefcase, Award, MapPin } from "lucide-react";
import type { CareerRecommendation } from "@/lib/types/careers";

export default function Results() {
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisTime, setAnalysisTime] = useState(0);

  useEffect(() => {
    // Get recommendations from sessionStorage
    const stored = sessionStorage.getItem("careerRecommendations");
    if (stored) {
      const data = JSON.parse(stored);
      setRecommendations(data.recommendations || []);
      setAnalysisTime(data.analysisTime || 0);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing your interests...</p>
        </div>
      </div>
    );
  }

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
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-semibold">SkillOrbit</span>
            </div>
            <div className="text-sm text-gray-400">
              Analysis completed in {(analysisTime / 1000).toFixed(1)}s
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
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
            Based on your interests and preferences, here are the healthcare careers that align best with your profile.
          </p>
        </motion.div>

        {/* Career Cards */}
        <div className="space-y-6">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.career.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all bg-white/5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-white/40">#{index + 1}</span>
                    <h2 className="text-2xl font-bold">{recommendation.career.field_name}</h2>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{recommendation.career.subdomain}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                      {recommendation.matchScore}% Match
                    </div>
                    {recommendation.career.remote_friendly && (
                      <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
                        Remote Friendly
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Why This Matches */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm font-semibold text-white mb-2">Why this matches you:</p>
                <p className="text-sm text-gray-300">{recommendation.reasoning}</p>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6">{recommendation.career.field_description}</p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Salary Range</p>
                    <p className="text-sm font-semibold">{recommendation.career.salary_range_inr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Growth 2026</p>
                    <p className="text-sm font-semibold">{recommendation.career.demand_growth_2026}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Entry Duration</p>
                    <p className="text-sm font-semibold">{recommendation.career.entry_level_duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Difficulty</p>
                    <p className="text-sm font-semibold">{recommendation.career.difficulty_rating}/10</p>
                  </div>
                </div>
              </div>

              {/* Skills Required */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">Key Skills Required:</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.career.skills_required.slice(0, 8).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {recommendation.career.skills_required.length > 8 && (
                    <span className="px-3 py-1 text-xs text-gray-400">
                      +{recommendation.career.skills_required.length - 8} more
                    </span>
                  )}
                </div>
              </div>

              {/* Industry Focus */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">Industry Focus:</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.career.industry_focus.map((industry, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs"
                    >
                      <MapPin className="w-3 h-3" />
                      {industry}
                    </span>
                  ))}
                </div>
              </div>

              {/* Typical Companies */}
              <div>
                <p className="text-sm font-semibold mb-3">Typical Companies:</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.career.typical_companies.map((company, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs"
                    >
                      <Briefcase className="w-3 h-3" />
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="p-8 border border-white/10 rounded-lg bg-white/5">
            <h3 className="text-2xl font-bold mb-4">Ready to start your journey?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              These career paths are tailored to your interests. Explore learning resources, certifications, and job opportunities to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/interest-detector"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-all"
              >
                Retake Assessment
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                Explore All Careers
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
