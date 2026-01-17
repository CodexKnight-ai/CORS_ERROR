"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, LogOut, TrendingUp } from "lucide-react";
import type { DashboardState } from "@/lib/types/careers";
import RoadmapCard from "@/components/dashboard/RoadmapCard";

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/dashboard");
      
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
      }

      const data = await response.json();
      setDashboard(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Failed to load dashboard");
      setLoading(false);
    }
  };

  const handleRemoveRoadmap = async (careerId: number) => {
    try {
      const response = await fetch("/api/dashboard", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove roadmap");
      }

      // Refresh dashboard
      await fetchDashboard();
    } catch (err) {
      console.error("Error removing roadmap:", err);
      alert("Failed to remove roadmap");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasRoadmaps = dashboard && dashboard.roadmaps.length > 0;
  const canAddMore = dashboard && dashboard.roadmaps.length < dashboard.maxRoadmaps;

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Learning Dashboard</h1>
                <p className="text-sm text-gray-400">
                  {dashboard?.count || 0}/{dashboard?.maxRoadmaps || 3} roadmaps
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {!hasRoadmaps ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't added any roadmaps yet. Discover your perfect career path and start learning today!
            </p>
            <motion.button
              onClick={() => router.push("/onboarding")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg font-semibold hover:shadow-xl hover:shadow-black/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              Discover Careers
            </motion.button>
          </motion.div>
        ) : (
          /* Roadmap Grid */
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-2">Your Learning Roadmaps</h2>
              <p className="text-gray-400">
                Continue your learning journey or explore new career paths
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {dashboard?.roadmaps.map((roadmap, index) => (
                  <motion.div
                    key={roadmap.careerId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1, ease: "easeInOut" }}
                  >
                    <RoadmapCard
                      roadmap={roadmap}
                      onRemove={handleRemoveRoadmap}
                    />
                  </motion.div>
                ))}

                {/* Add More Card */}
                {canAddMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: dashboard.roadmaps.length * 0.1, ease: "easeInOut" }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    onClick={() => router.push("/results")}
                    className="cursor-pointer border-2 border-dashed border-white/20 rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all backdrop-blur-sm flex items-center justify-center min-h-[300px]"
                  >
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Add New Roadmap</h3>
                      <p className="text-sm text-gray-400">
                        Explore more career paths
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Browse More CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
              className="mt-12 text-center"
            >
              <div className="p-8 border border-white/10 rounded-lg bg-white/5">
                <h3 className="text-xl font-bold mb-4">Want to explore more careers?</h3>
                <p className="text-gray-400 mb-6">
                  Take our interest detector to discover personalized career recommendations
                </p>
                <button
                  onClick={() => router.push("/interest-detector")}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-all"
                >
                  Retake Assessment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
