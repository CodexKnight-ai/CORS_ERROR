"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Brain, TrendingUp, Target, BarChart3, CheckCircle2, Menu, X, Zap } from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Brain className="w-6 h-6" />, title: 'Skill Assessment', desc: 'AI-powered analysis of your capabilities and potential' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Career Pathways', desc: 'Visualize your progression in emerging sectors' },
    { icon: <Target className="w-6 h-6" />, title: 'Smart Recommendations', desc: 'Personalized courses and projects aligned with goals' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Progress Dashboard', desc: 'Track achievements and growth in real-time' }
  ];

  const sectors = [
    'Healthcare Informatics',
    'Agricultural Technology',
    'Smart City Planning'
  ];

  const benefits = [
    'Unified academic and professional profile',
    'Domain-specific skill frameworks',
    'Integration with LinkedIn and learning platforms',
    'Real-time career pathway visualization',
    'Interdisciplinary training recommendations',
    'Privacy-first data management'
  ];

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-semibold">SkillOrbit</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition">Features</a>
              <a href="#sectors" className="text-sm text-gray-400 hover:text-white transition">Sectors</a>
              <a href="#about" className="text-sm text-gray-400 hover:text-white transition">About</a>
              <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition">
                Get Started
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-gray-400 hover:text-white transition">Features</a>
              <a href="#sectors" className="block text-gray-400 hover:text-white transition">Sectors</a>
              <a href="#about" className="block text-gray-400 hover:text-white transition">About</a>
              <button className="w-full px-5 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-block mb-6">
              <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-medium text-gray-300">
                AI-Powered Career Intelligence
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Map Your Academic Journey with Intelligence
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
              A unified platform that captures your skills, analyzes your progress, and guides your career path in healthcare technology, agricultural sciences, and smart city planning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button className="group px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition flex items-center justify-center">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 border border-white/20 font-medium rounded hover:bg-white/5 transition">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-12">
              <div>
                <div className="text-3xl font-bold mb-1">10,000+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">95%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">3</div>
                <div className="text-sm text-gray-500">Key Sectors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="py-20 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Focus Sectors
            </h2>
            <p className="text-gray-400 max-w-2xl">
              Specialized frameworks for emerging industries with high growth potential
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sectors.map((sector, idx) => (
              <div
                key={idx}
                className="p-8 border border-white/10 rounded-lg hover:border-white/30 transition group"
              >
                <div className="text-4xl mb-4">{idx === 0 ? '🏥' : idx === 1 ? '🌾' : '🏙️'}</div>
                <h3 className="text-xl font-semibold mb-2">{sector}</h3>
                <p className="text-gray-500 text-sm">
                  Comprehensive skill mapping and career pathways
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl">
              Everything you need to master your academic journey and career progression
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 border border-white/10 rounded-lg hover:border-white/30 transition group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/10 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-20 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Choose SkillOrbit
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                A living system that evolves with you, providing continuous insights and guidance for your academic and professional growth.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Skill Progress</span>
                  <span className="text-sm font-semibold">87%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>
              
              <div className="p-6 border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Career Readiness</span>
                  <span className="text-sm font-semibold">92%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>

              <div className="p-6 border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Learning Velocity</span>
                  <span className="text-sm font-semibold">+45%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Career Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of students and professionals mapping their path to success
          </p>
          <button className="px-8 py-4 bg-white text-black font-semibold rounded hover:bg-gray-200 transition text-lg">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">SkillOrbit</span>
            </div>
            <p className="text-gray-500 text-sm text-center">
              Empowering the next generation of healthcare, agriculture, and urban development professionals
            </p>
            <p className="text-gray-500 text-sm">
              © 2026 SkillOrbit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;