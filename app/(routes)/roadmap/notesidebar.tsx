"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Save, Loader2, ChevronLeft } from "lucide-react";

interface NotesSidebarProps {
  userId: string | null;  
  careerId: number;
}

export default function NotesSidebar({ userId, careerId }: NotesSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial notes
  useEffect(() => {
    if (isOpen) {
      fetch(`/api/notes?careerId=${careerId}&userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content || "");
          setIsLoading(false);
        })
        .catch((err) => console.error("Failed to load notes", err));
    }
  }, [isOpen, careerId]);

  // Debounced Auto-Save Logic
  useEffect(() => {
    if (!isOpen || isLoading) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ careerId, content, userId }),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save note", error);
      } finally {
        setIsSaving(false);
      }
    }, 2000); // Save 2 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [content, careerId, isOpen, isLoading]);

  return (
    <>
      {/* Toggle Button (Floating on the right) */}
      {!isOpen && (
        <motion.button
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-0 z-40 bg-white text-black p-3 rounded-l-xl shadow-xl hover:bg-gray-200 transition-colors flex flex-col items-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold writing-vertical-lr">Notes</span>
        </motion.button>
      )}

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-[#0A0A0A] border-l border-white/10 z-[100] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-lg text-white">My Notes</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Editor Area */}
              <div className="flex-1 p-4 relative">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Jot down key takeaways, code snippets, or future goals..."
                    className="w-full h-full bg-transparent text-gray-300 placeholder-gray-600 resize-none focus:outline-none font-poppins text-sm leading-relaxed"
                  />
                )}
              </div>

              {/* Footer / Status Bar */}
              <div className="p-3 border-t border-white/10 bg-black flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : lastSaved ? (
                    <>
                      <Save className="w-3 h-3 text-green-500" />
                      <span>Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </>
                  ) : (
                    <span>Ready to write</span>
                  )}
                </div>
                <div>Markdown supported</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}