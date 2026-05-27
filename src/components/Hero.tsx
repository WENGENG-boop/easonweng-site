'use client';

import { useState, useEffect } from 'react';
import { Terminal, ArrowRight, BookOpen } from 'lucide-react';

const HERO_TAGS = [
  'AI Explorer',
  'Student Builder',
  'CS Learner',
  'Product Thinker',
  'Creative Technologist',
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 -z-10" />
      <div className="absolute inset-0 radial-highlight -z-10" />
      
      {/* Glow dot in the center-top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-zinc-200/50 dark:border-zinc-800/50 text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-8 transition-all duration-700 ease-out transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          }`}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <Terminal size={12} className="text-blue-500 dark:text-blue-400" />
          <span>G10 A-Level Student & Builder</span>
        </div>

        {/* Heading */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] transition-all duration-700 ease-out delay-100 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Hi, I’m <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">Weng</span>.
          <br className="hidden sm:inline" />
          <span className="text-zinc-800 dark:text-zinc-100 text-3xl sm:text-4xl md:text-5xl font-bold mt-2 block">
            Student builder exploring AI, CS, and data.
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 ease-out delay-200 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          I build small tools, study computer science and data, and explore how AI can connect with products, business, education, and creative expression.
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 ease-out delay-300 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => handleScrollTo('projects')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-md dark:shadow-zinc-950/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>View Projects</span>
            <ArrowRight size={16} />
          </button>
          
          <button
            onClick={() => handleScrollTo('notes')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 hover:bg-white dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <BookOpen size={16} className="text-zinc-600 dark:text-zinc-400" />
            <span>Read My Notes</span>
          </button>
        </div>

        {/* Tags */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto transition-all duration-700 ease-out delay-400 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {HERO_TAGS.map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-full bg-zinc-200/50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/60 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
