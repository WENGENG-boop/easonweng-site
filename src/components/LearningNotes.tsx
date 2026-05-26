'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Binary, Zap, TrendingUp, Cpu, Brain, Lock } from 'lucide-react';

interface NoteSubject {
  name: string;
  category: string;
  description: string;
  status: 'In Progress' | 'Upcoming';
  icon: React.ElementType;
}

const SUBJECTS: NoteSubject[] = [
  {
    name: 'A-Level Mathematics',
    category: 'Core Curriculum',
    description: 'Focusing on pure mathematics (calculus, trigonometry, coordinate geometry) and statistics/mechanics applications.',
    status: 'In Progress',
    icon: Binary,
  },
  {
    name: 'Physics',
    category: 'Core Curriculum',
    description: 'Exploring Newtonian mechanics, waves, electromagnetism, and modern quantum physics fundamentals.',
    status: 'In Progress',
    icon: Zap,
  },
  {
    name: 'Economics',
    category: 'Core Curriculum',
    description: 'Studying market mechanisms, macro policies, and international trade from both micro and macro viewpoints.',
    status: 'In Progress',
    icon: TrendingUp,
  },
  {
    name: 'Computer Science',
    category: 'Self-Directed & A-Level',
    description: 'Delving into data structures, sorting algorithms, database structures (SQL), and object-oriented programming.',
    status: 'In Progress',
    icon: Cpu,
  },
  {
    name: 'AI & Data Science',
    category: 'Self-Directed Explorer',
    description: 'Learning data wrangling (Pandas, Numpy), regression models, and experimenting with open source LLMs and fine-tuning.',
    status: 'In Progress',
    icon: Brain,
  },
];

export default function LearningNotes() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="notes" className="py-20 bg-zinc-100/30 dark:bg-zinc-900/10 border-y border-zinc-200/40 dark:border-zinc-800/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
              <BookOpen className="text-blue-500" size={24} />
              <span>Learning Notes</span>
              <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-2">/ 学习笔记</span>
            </h2>
            <div className="h-1 w-12 bg-blue-500 rounded mt-3" />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            Overview of what I am currently studying. Detailed Markdown notes will be linked here in the future.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SUBJECTS.map((subject, idx) => {
            const Icon = subject.icon;
            const delayClass = idx === 0 ? '' : idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : 'delay-300';
            return (
              <div
                key={subject.name}
                className={`p-5 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm flex flex-col justify-between transition-all duration-500 ease-out transform ${delayClass} ${
                  mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {subject.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <Lock size={8} />
                      <span>Draft</span>
                    </span>
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      {subject.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
                  <span>Future Integration</span>
                  <span>MD Link Pending</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
