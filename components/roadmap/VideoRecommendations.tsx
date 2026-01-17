"use client";

import { motion } from "framer-motion";
import { Play, Eye, ExternalLink } from "lucide-react";
import type { YouTubeVideo } from "@/lib/types/roadmap";

interface VideoRecommendationsProps {
  videos: YouTubeVideo[];
  moduleId: string;
}

export default function VideoRecommendations({ videos, moduleId }: VideoRecommendationsProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <Play className="w-5 h-5 text-green-400" />
        Recommended YouTube Videos
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.slice(0, 3).map((video, index) => (
          <motion.a
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="group relative border border-white/10 rounded-lg overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <motion.div
                  className="w-12 h-12 bg-green-500/90 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </motion.div>
              </div>
              {/* Placeholder gradient background */}
              <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20" />
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h5 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                {video.title}
              </h5>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="truncate">{video.channelName}</span>
                <span className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <Eye className="w-3 h-3" />
                  {video.viewCount}
                </span>
              </div>
            </div>

            {/* External link indicator */}
            <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                <ExternalLink className="w-3 h-3 text-white" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
