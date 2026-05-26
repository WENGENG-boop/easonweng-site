'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Clock, X, ArrowUpRight, MessageSquare, QrCode, ExternalLink, Check } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  date: string;
  readTime: string;
  wechatUrl: string;
}

export default function Writing() {
  const [copiedID, setCopiedID] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  const handleCopyID = () => {
    navigator.clipboard.writeText('Beyond the Interface');
    setCopiedID(true);
    setTimeout(() => setCopiedID(false), 2000);
  };

  return (
    <section id="writing" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <FileText className="text-blue-500" size={24} />
            <span>Writing & Thoughts</span>
            <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-2">/ 想法文章</span>
          </h2>
          <div className="h-1 w-12 bg-blue-500 rounded mt-3" />
        </div>

        {/* WeChat Account Brand Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="md:col-span-2 p-6 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-green-500/10 text-green-500 dark:text-green-400">
                  <MessageSquare size={16} />
                </span>
                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  WeChat Official Account / 微信公众号
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Beyond the Interface <span className="text-sm font-normal text-zinc-500">探索界外</span>
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                My writing channel focusing on AI applications, computer science education, product thinking, and self-hosted infrastructure. I post articles describing my growth as a student builder in Shanghai.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleCopyID}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 transition-colors cursor-pointer"
              >
                {copiedID ? <Check size={14} className="text-green-500" /> : <QrCode size={14} />}
                <span>{copiedID ? 'Copied ID!' : 'Copy Search ID'}</span>
              </button>
              
              <div className="text-xs text-zinc-500 dark:text-zinc-500">
                Search ID: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300 select-all">Beyond the Interface</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col items-center justify-center text-center space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-center gap-1.5">
                <FileText size={14} className="text-blue-500" />
                <span>Exploring the Edge</span>
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 max-w-[200px]">
                Thoughts and notes on the frontier of AI and human interfaces.
              </p>
            </div>
            
            {/* Real QR Code Image */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-xs opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative p-1.5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-800 shadow-md">
                <img
                  src="/wechat-qr.jpg"
                  alt="WeChat QR Code"
                  className="w-32 h-32 md:w-36 md:h-36 rounded-lg bg-white"
                />
              </div>
            </div>
            
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Scan on WeChat / 微信扫码关注</span>
          </div>
        </div>

        {/* Dynamic Articles List */}
        {!loading && articles.length > 0 && (
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2.5 mb-4">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Latest Articles / 最新文章
              </h3>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Author: Weng / 作者：Weng
              </span>
            </div>
            
            {articles.slice(0, 4).map((article) => (
              <div
                key={article.slug}
                className="p-5 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 min-w-0">
                  {/* Cover image (Anti-hotlink) */}
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full sm:w-24 sm:h-20 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/50 shrink-0"
                    />
                  )}
                  
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded animate-pulse">
                        WeChat Post
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                        <Calendar size={12} />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
                      {article.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 self-start md:self-center shrink-0 w-full md:w-auto justify-end">
                  <a
                    href={article.wechatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ExternalLink size={12} />
                  </a>

                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <span>Summary</span>
                    <Clock size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 dark:bg-zinc-950/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between z-10">
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded">
                  WeChat Post Summary
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  {selectedArticle.coverImage && (
                    <img
                      src={selectedArticle.coverImage}
                      alt={selectedArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-48 md:h-64 object-cover rounded-xl border border-zinc-200/50 dark:border-zinc-800"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                      {selectedArticle.title}
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 pt-1">
                      <span className="flex items-center gap-1"><Calendar size={13} /> {selectedArticle.date}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {selectedArticle.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Body Summary */}
                <div className="prose dark:prose-invert max-w-none text-zinc-650/80 dark:text-zinc-300 leading-relaxed text-sm md:text-base space-y-4">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Article Abstract / 微信内容摘要</h3>
                  <p>{selectedArticle.summary}</p>
                  
                  <div className="p-4 rounded-xl bg-zinc-500/10 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    <strong>Note:</strong> WeChat content is protected from full scraping. Click the link below to access the full article, graphics, and reader comments on the official WeChat platform.
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center gap-4">
                <a
                  href={selectedArticle.wechatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <span>Read Full on WeChat</span>
                  <ExternalLink size={12} />
                </a>
                
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
