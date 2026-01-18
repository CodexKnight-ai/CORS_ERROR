"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Brain, TrendingUp, Target, BarChart3, CheckCircle2, Menu, X, Zap, ChevronRight, Map, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Map className="w-5 h-5" />, title: 'AI-Driven Roadmaps', desc: 'Personalized learning paths tailored to close your specific skill gaps' },
    { icon: <BarChart3 className="w-5 h-5" />, title: 'Skill Gap Analysis', desc: 'Visualize missing competencies and track your mastery in real-time' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Smart Note-Taking', desc: 'Integrated notes with auto-save to capture insights alongside your curriculum' },
    { icon: <Sparkles className="w-5 h-5" />, title: 'Curated Resources', desc: 'AI-matched courses and materials with relevance scoring for efficient learning' }
  ];

  const sectors = [
    { title: 'Health Data & AI', icon: '🧬', desc: 'Master machine learning and predictive analytics for healthcare.' },
    { title: 'Clinical Systems', icon: '🩺', desc: 'Optimize EHR workflows and bridge clinical care with IT.' },
    { title: 'Digital Health', icon: '💻', desc: 'Build secure telemedicine platforms and future-ready apps.' }
  ];

  const benefits = [
    'Unified medical portfolio & CV',
    'ACGME-aligned competency tracking',
    'Integration with hospital learning systems',
    'Real-time specialty roadmap visualization',
    'CME & Research opportunity matching',
    'HIPAA-compliant data handling'
  ];

  return (
    <div className="min-h-screen bg-black text-white font-poppins selection:bg-white selection:text-black">
      
      {/* Background Grid Pattern - Hidden in Hero to avoid conflict */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 hidden md:block">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/70 backdrop-blur-xl border-white/10' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight">SkillOrbit</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Sectors', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
              <Link href="/dashboard">
                <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  Get Started
                </button>
              </Link>
            </div>

            <button className="md:hidden text-zinc-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 space-y-4 animate-in slide-in-from-top-5">
            {['Features', 'Sectors', 'About'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-lg font-medium text-zinc-400 hover:text-white">
                {item}
              </a>
            ))}
            <Link href="/dashboard" className="block pt-4">
              <button className="w-full py-3 bg-white text-black font-semibold rounded-lg">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-center items-center overflow-hidden bg-black">
        
        {/* Spline Background for Desktop/Tablet - Absolute Full Screen */}
        <div className="hidden md:block absolute inset-0 z-0 w-full h-full">
          <Spline
            scene="https://prod.spline.design/XRwrZ1LSs2PP88uf/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Image Background for Mobile - Absolute Full Screen */}
        <div className="block md:hidden absolute inset-0 z-0 w-full h-full">
          <img src="/brain.png" alt="Brain Background" className="w-full h-full object-cover opacity-50" />
        </div>

        {/* Content Container - pointer-events-none allows clicks to pass through to Spline */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-6 lg:px-8 pointer-events-none mt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-xs font-medium text-zinc-300 mb-8 hover:bg-white/10 transition-colors cursor-default pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            AI-Powered Medical Career Intelligence
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">
            Map Your Medical Journey <br /> with Precision
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            The first unified platform that captures your clinical skills, tracks research hours, and guides your path from student to specialist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 pointer-events-auto">
            <Link href="/dashboard">
              <button className="group px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="px-8 py-4 text-white font-medium rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]">
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10 py-8 bg-black/20 backdrop-blur-xl pointer-events-auto rounded-2xl shadow-2xl">
            {[
              { val: '500+', label: 'Skills Tracked' },
              { val: '95%', label: 'AI Accuracy' },
              { val: '50+', label: 'Career Paths' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow-md">{stat.val}</span>
                <span className="text-xs sm:text-sm text-zinc-400 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="py-24 px-6 lg:px-8 relative z-10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Medical Pathways</h2>
              <p className="text-zinc-400 max-w-lg">
                Specialized frameworks for clinical and non-clinical healthcare careers.
              </p>
            </div>
            <a href="#" className="text-sm font-medium text-white underline underline-offset-4 decoration-zinc-700 hover:decoration-white transition-all">
              View all frameworks
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sectors.map((sector, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-lg">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110">{sector.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-white transition-colors">{sector.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 group-hover:text-zinc-300 transition-colors">
                  {sector.desc}
                </p>
                <div className="flex items-center text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                  Explore Path <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 relative z-10 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
               Everything you need to master your academic journey and career progression.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-zinc-400 group-hover:text-white group-hover:bg-white/20 transition-all border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section id="about" className="py-24 px-6 lg:px-8 relative z-10 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose SkillOrbit</h2>
              <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
                A living system that evolves with you, providing continuous insights and guidance for your academic and professional growth.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-400">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Glass Card Stack */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl blur-2xl"></div>
              <div className="relative space-y-4 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                
                {[
                  { label: 'Skill Progress', val: '87%' },
                  { label: 'Career Readiness', val: '92%' },
                  { label: 'Learning Velocity', val: '+45%' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-zinc-300">{item.label}</span>
                      <span className="font-mono text-white text-shadow-glow">{item.val}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                        style={{ width: item.val.replace('+', '') }}
                      />
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 relative z-10 border-t border-white/10 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            Ready to Transform Your Journey?
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
            Join thousands of students and professionals mapping their path to success today.
          </p>
          <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-8 border-t border-white/10 bg-black relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">SkillOrbit</span>
          </div>
          <p className="text-zinc-600 text-xs">
            © 2026 SkillOrbit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
