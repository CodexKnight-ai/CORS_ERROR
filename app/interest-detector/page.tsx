"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Zap } from "lucide-react";

type Option = {
  text: string;
};

type Question = {
  id: number;
  question: string;
  category: string;
  options: Option[];
  whyItMatters: string;
  singleSelect?: boolean; // New property to mark single-select questions
};

const questions: Question[] = [
  {
    id: 1,
    question: "What excites you MOST in your work?",
    category: "Core interest detector",
    options: [
      { text: "🧠 Working with data, numbers, and insights" },
      { text: "💻 Building software / systems" },
      { text: "🩺 Improving clinical workflows or patient care" },
      { text: "🧩 Solving security, compliance, or risk problems" },
      { text: "🎨 Designing user-friendly experiences" },
      { text: "📊 Improving business or operational efficiency" },
      { text: "⚙️ Designing medical devices or hardware" },
    ],
    whyItMatters:
      "This immediately narrows roles by interest cluster (Data / Tech / Clinical / Security / Design / Business / Devices)",
  },
  {
    id: 2,
    question: "Which type of problems do you prefer solving?",
    category: "Cognitive style filter",
    options: [
      { text: "Finding patterns & making predictions from data" },
      { text: "Designing systems that must scale & stay reliable" },
      { text: "Ensuring accuracy, safety, and regulatory compliance" },
      { text: "Improving how people interact with technology" },
      { text: "Coordinating people, processes, and decisions" },
      { text: "Testing, validating, and improving real-world systems" },
    ],
    whyItMatters:
      "This separates builders vs analysts vs validators vs leaders",
  },
  {
    id: 3,
    question: "How technical do you want your daily work to be?",
    category: "Technical depth slider",
    singleSelect: true, // This question is single-select
    options: [
      { text: "🔧 Very technical (coding, systems, architecture)" },
      { text: "⚙️ Moderately technical (tools + configuration)" },
      { text: "📋 Low technical (strategy, compliance, coordination)" },
    ],
    whyItMatters:
      "This cleanly splits Engineers, Specialists, and Managers / Compliance / Leadership",
  },
  {
    id: 4,
    question: "Which environment would you prefer working in?",
    category: "Work-context signal",
    options: [
      { text: "Tech companies / startups" },
      { text: "Hospitals or clinical environments" },
      { text: "Healthcare IT / consulting firms" },
      { text: "Medical device or biotech companies" },
      { text: "Government / regulatory / compliance bodies" },
      { text: "Remote / cloud-based healthcare platforms" },
    ],
    whyItMatters:
      "Some roles cannot exist in certain environments (e.g., CMIO ≠ startup-only).",
  },
  {
    id: 5,
    question: "What kind of impact motivates you most?",
    category: "Purpose alignment",
    options: [
      { text: "Improving patient outcomes using data or AI" },
      { text: "Making healthcare systems faster and more reliable" },
      { text: "Ensuring patient data privacy & safety" },
      { text: "Helping doctors and clinicians work better" },
      { text: "Making healthcare apps simple and accessible" },
      { text: "Bringing new medical technologies to life" },
    ],
    whyItMatters: "Maps directly to career intent, not just skills.",
  },
  {
    id: 6,
    question: "How do you prefer to work?",
    category: "Working style signal",
    options: [
      { text: "Independently on complex problems" },
      { text: "In cross-functional teams (tech + clinical)" },
      { text: "Leading discussions and decision-making" },
      { text: "Following structured rules and standards" },
      { text: "Iterating designs with constant feedback" },
    ],
    whyItMatters:
      "Distinguishes Individual contributors, Integrators, Leaders, Compliance specialists, Designers.",
  },
  {
    id: 7,
    question: "What best describes your long-term career goal?",
    category: "Future orientation",
    options: [
      { text: "Become a deep technical expert" },
      { text: "Become a domain specialist in healthcare" },
      { text: "Move into leadership or strategy" },
      { text: "Work on cutting-edge healthcare innovation" },
      { text: "Build products used by millions" },
      { text: "Ensure healthcare systems are safe and compliant" },
    ],
    whyItMatters:
      "Helps avoid recommending entry-level-only roles to leadership-oriented users.",
  },
];

export default function InterestDetector() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isSingleSelect = currentQuestion.singleSelect === true;

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => {
      const currentAnswers = prev[currentQuestionIndex] || [];
      
      // If single-select question, replace the answer
      if (isSingleSelect) {
        return {
          ...prev,
          [currentQuestionIndex]: [option],
        };
      }
      
      // Multi-select: toggle the option
      if (currentAnswers.includes(option)) {
        return {
          ...prev,
          [currentQuestionIndex]: currentAnswers.filter((a) => a !== option),
        };
      } else {
        return {
          ...prev,
          [currentQuestionIndex]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Call API to get career recommendations
      setIsLoading(true);
      try {
        const response = await fetch("/api/recommend-careers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        });

        if (!response.ok) {
          throw new Error("Failed to get recommendations");
        }

        const data = await response.json();
        
        // Store recommendations in sessionStorage and navigate to results
        sessionStorage.setItem("careerRecommendations", JSON.stringify(data));
        window.location.href = "/results";
      } catch (error) {
        console.error("Error getting recommendations:", error);
        alert("Failed to get recommendations. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-black text-white font-poppins flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-semibold">SkillOrbit</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestionIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full text-xs font-medium text-gray-300">
                  <Sparkles className="w-3 h-3" />
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {currentQuestion.question}
              </h2>
              
              {/* Selection hint */}
              <p className="text-sm text-gray-500 mb-10">
                {isSingleSelect ? "Select one option" : "Select all that apply"}
              </p>

              {/* Options */}
              <div className="space-y-3 mb-10">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected =
                    answers[currentQuestionIndex]?.includes(option.text);
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => handleSelectOption(option.text)}
                      className={`w-full text-left p-5 rounded-lg border transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? "border-white bg-white/5"
                          : "border-white/10 hover:border-white/30 hover:bg-white/5"
                      }`}
                    >
                      <span className="font-medium text-base sm:text-lg">
                        {option.text}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Why it matters */}
              <div className="p-5 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-400 leading-relaxed">
                  <span className="font-semibold text-white">Why this matters: </span>
                  {currentQuestion.whyItMatters}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentQuestionIndex === 0
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="group flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              disabled={!answers[currentQuestionIndex]?.length || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  {isLastQuestion ? "Finish" : "Next"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}