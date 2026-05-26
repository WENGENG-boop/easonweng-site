'use client';

import React, { useState } from 'react';
import { Mail, Send, Copy, Check, ExternalLink, MessageSquare } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const copyEmail = () => {
    navigator.clipboard.writeText('yizheng.weng404@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState('submitting');
    // Simulate submission delay
    setTimeout(() => {
      setFormState('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormState('idle'), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 bg-zinc-100/30 dark:bg-zinc-900/10 border-t border-zinc-200/40 dark:border-zinc-800/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <MessageSquare className="text-blue-500" size={24} />
            <span>Get in Touch</span>
            <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-2">/ 联系方式</span>
          </h2>
          <div className="h-1 w-12 bg-blue-500 rounded mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Info Side */}
          <div className="md:col-span-5 space-y-6">
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              I’m open to feedback, collaboration, and learning from other builders. If you want to chat about project ideas, university applications, self-hosting setups, or creative tech, feel free to reach out!
            </p>

            <div className="space-y-3">
              {/* Email item */}
              <div className="flex items-center justify-between p-3.5 rounded-xl glass border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Email Address</h4>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 select-all">
                      yizheng.weng404@gmail.com
                    </p>
                  </div>
                </div>
                <button
                  onClick={copyEmail}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-250 transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>

              {/* GitHub Link */}
              <a
                href="https://github.com/WENGENG-boop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl glass border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-zinc-100 dark:text-zinc-300">
                    <GithubIcon size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">GitHub Profile</h4>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      github.com/WENGENG-boop
                    </p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
              </a>

              {/* Reddit Link */}
              <a
                href="https://www.reddit.com/user/Potential-Hotel-8725/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl glass border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                      <circle cx="9" cy="12" r="1" />
                      <circle cx="15" cy="12" r="1" />
                      <path d="M8 15.5c2 1.5 6 1.5 8 0" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Reddit Account</h4>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      u/Potential-Hotel-8725
                    </p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors" />
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-7">
            <div className="p-6 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30 text-xs sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-zinc-900 dark:text-zinc-50"
                      disabled={formState === 'submitting' || formState === 'success'}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30 text-xs sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-zinc-900 dark:text-zinc-50"
                      disabled={formState === 'submitting' || formState === 'success'}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your idea or request..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30 text-xs sm:text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-zinc-900 dark:text-zinc-50 resize-none"
                    disabled={formState === 'submitting' || formState === 'success'}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-green-500 font-medium">
                    {formState === 'success' && '✓ Message sent successfully!'}
                  </span>
                  
                  <button
                    type="submit"
                    disabled={formState !== 'idle'}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                      formState === 'success'
                        ? 'bg-green-600 text-white cursor-default shadow-none'
                        : formState === 'submitting'
                        ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-wait'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950'
                    }`}
                  >
                    {formState === 'submitting' ? (
                      <span>Sending...</span>
                    ) : formState === 'success' ? (
                      <span>Sent!</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
