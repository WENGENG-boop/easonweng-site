'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { Lock, Send, Trash2, ExternalLink, ArrowLeft, AlertCircle, CheckCircle2, Loader2, Key, FileText, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface Article {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  date: string;
  readTime: string;
  wechatUrl: string;
}

function isArticle(value: unknown): value is Article {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Article).slug === 'string' &&
    typeof (value as Article).title === 'string' &&
    typeof (value as Article).summary === 'string' &&
    typeof (value as Article).coverImage === 'string' &&
    typeof (value as Article).date === 'string' &&
    typeof (value as Article).readTime === 'string' &&
    typeof (value as Article).wechatUrl === 'string'
  );
}

function getApiErrorMessage(value: unknown, fallback: string) {
  if (typeof value === 'object' && value !== null && typeof (value as { error?: unknown }).error === 'string') {
    return (value as { error: string }).error;
  }

  return fallback;
}

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [url, setUrl] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data: unknown = await res.json();
        setArticles(Array.isArray(data) ? data.filter(isArticle) : []);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load passcode from sessionStorage if exists
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedPassword) {
      window.setTimeout(() => {
        setPassword(savedPassword);
        setIsAuthenticated(true);
      }, 0);
    }
    const timer = window.setTimeout(() => {
      fetchArticles();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchArticles]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      sessionStorage.setItem('admin_password', password);
      setIsAuthenticated(true);
      showTemporaryMessage('Passcode saved. Actions will verify password.', 'success');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password');
    setPassword('');
    setIsAuthenticated(false);
  };

  const showTemporaryMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), password }),
      });

      const data: unknown = await res.json();

      if (res.ok) {
        showTemporaryMessage('Article parsed and added successfully!', 'success');
        setUrl('');
        fetchArticles();
      } else {
        if (res.status === 401) {
          handleLogout();
          showTemporaryMessage('Invalid passcode. Please log in again.', 'error');
        } else {
          showTemporaryMessage(getApiErrorMessage(data, 'Failed to parse article.'), 'error');
        }
      }
    } catch {
      showTemporaryMessage('Network error. Failed to add article.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      });

      const data: unknown = await res.json();

      if (res.ok) {
        showTemporaryMessage('Article deleted successfully.', 'success');
        fetchArticles();
      } else {
        if (res.status === 401) {
          handleLogout();
          showTemporaryMessage('Invalid passcode. Please log in again.', 'error');
        } else {
          showTemporaryMessage(getApiErrorMessage(data, 'Failed to delete article.'), 'error');
        }
      }
    } catch {
      showTemporaryMessage('Network error. Failed to delete article.', 'error');
    }
  };

  // Login Screen Layout (Theme-reactive)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex items-center justify-center p-4 bg-grid-pattern transition-colors duration-300">
        <div className="absolute inset-0 radial-highlight -z-10" />
        
        <div className="w-full max-w-md p-6 rounded-2xl glass shadow-md dark:shadow-zinc-950/40 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Lock size={22} />
            </div>
            <h1 className="text-xl font-bold">Admin Login</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Enter your passcode to manage WeChat articles</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                />
                <Key className="absolute left-3.5 top-3.5 text-zinc-400 dark:text-zinc-500" size={16} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-semibold text-sm transition-colors cursor-pointer shadow-sm dark:shadow-none"
            >
              Access Dashboard
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Layout (Theme-reactive)
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 p-4 sm:p-6 lg:p-8 bg-grid-pattern transition-colors duration-300">
      <div className="absolute inset-0 radial-highlight -z-10" />
      
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex items-center justify-between p-4 rounded-2xl glass shadow-sm dark:shadow-zinc-950/20">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-white/50 hover:bg-white dark:bg-zinc-850 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 text-zinc-750 hover:text-zinc-950 dark:text-zinc-350 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold">Weng&apos;s Portfolio</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">WeChat Article Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 border border-zinc-200 dark:border-zinc-750 transition-colors cursor-pointer"
            >
              Lock Dashboard
            </button>
          </div>
        </header>

        {/* Global Alert Message */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/25 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
            )}
            <p className="text-xs sm:text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Add Article Box */}
          <div className="md:col-span-4 p-5 rounded-2xl glass shadow-sm dark:shadow-zinc-950/20 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Import Article</h2>
            
            <form onSubmit={handleAddArticle} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">WeChat Article Link</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://mp.weixin.qq.com/s/..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Parsing Content...</span>
                  </>
                ) : (
                  <>
                    <span>Add Article</span>
                    <Send size={12} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of Articles */}
          <div className="md:col-span-8 p-5 rounded-2xl glass shadow-sm dark:shadow-zinc-950/20 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Currently Published</h2>
              <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-350 px-2 py-0.5 rounded-full">
                {articles.length} total
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 space-y-2">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <span className="text-xs">Loading articles data...</span>
              </div>
            ) : articles.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 text-xs border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                No WeChat articles have been added yet. Use the sidebar to import.
              </div>
            ) : (
              <div className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                {articles.map((article) => (
                  <div
                    key={article.slug}
                    className="py-4 flex items-start justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Cover preview with anti-hotlink policy */}
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt="Cover"
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-850 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                          <FileText size={18} />
                        </div>
                      )}
                      
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate pr-2">
                          {article.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 dark:text-zinc-550">
                          <span>{article.date}</span>
                          <span>·</span>
                          <span>{article.readTime}</span>
                          <span>·</span>
                          <a
                            href={article.wechatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>Link</span>
                            <ExternalLink size={8} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteArticle(article.slug)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-650 hover:text-white dark:bg-red-950/20 dark:hover:bg-red-950/80 dark:text-red-500 dark:hover:text-white transition-colors cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
