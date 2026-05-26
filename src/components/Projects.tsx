'use client';

import { useState, useEffect } from 'react';
import { FolderGit2, Star, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  homepage: string | null;
}

// Fallback cached data if GitHub API fails/rate-limits
const FALLBACK_PROJECTS = [
  {
    name: 'potential-carnival',
    description: '一个软件可以识别图片，文字同时添加到 Google 日历和 notion 日历 (An automation tool that recognizes images and text, then schedules them to Google Calendar and Notion Calendar).',
    tags: ['Google Calendar', 'Notion', 'OCR', 'Automation'],
    githubUrl: 'https://github.com/WENGENG-boop/potential-carnival',
    stars: 0,
    language: 'Python',
  }
];

export default function Projects() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        const response = await fetch('https://api.github.com/users/WENGENG-boop/repos');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data: GithubRepo[] = await response.json();
        
        // Filter out forks (only show original projects) and limit to 4
        const originalRepos = data
          .filter((repo) => !repo.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count || b.id - a.id)
          .slice(0, 4);

        setRepos(originalRepos);
        setError(false);
      } catch (err) {
        console.error('Error fetching repos:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  // Format repo name for display (e.g. potential-carnival -> Potential Carnival)
  const formatName = (name: string) => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <section id="projects" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
              <FolderGit2 className="text-blue-500" size={24} />
              <span>Featured Projects</span>
              <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-2">/ 项目展示</span>
            </h2>
            <div className="h-1 w-12 bg-blue-500 rounded mt-3" />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Live Syncing from GitHub</span>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl glass border border-zinc-200/40 dark:border-zinc-800/40 animate-pulse space-y-4"
              >
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                </div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Error/Fallback state */}
        {!loading && (error || repos.length === 0) && (
          <div className="space-y-6">
            {error && (
              <p className="text-xs text-amber-500 dark:text-amber-400 mb-2">
                Note: API limit reached or offline. Showing cached profile data.
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FALLBACK_PROJECTS.map((project) => (
                <div
                  key={project.name}
                  className="group p-6 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {formatName(project.name)}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {project.language && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-500/10 text-blue-500 dark:text-blue-400">
                          {project.language}
                        </span>
                      )}
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[11px] font-medium rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                    >
                      <GithubIcon size={14} />
                      <span>Repository</span>
                    </a>
                    
                    <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                      <Star size={13} className="text-yellow-500 fill-yellow-500" />
                      <span>{project.stars} stars</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active repos list */}
        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="group p-6 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Title & Language */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {formatName(repo.name)}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {repo.language && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-500/10 text-blue-500 dark:text-blue-400">
                        {repo.language}
                      </span>
                    )}
                    {(repo.topics || []).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-[11px] font-medium rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <div className="flex items-center gap-3">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                    >
                      <GithubIcon size={14} />
                      <span>Repository</span>
                    </a>

                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>Live Link</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <Star size={13} className="text-yellow-500 fill-yellow-500" />
                    <span>{repo.stargazers_count} stars</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
