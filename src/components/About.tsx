import { User, Code2, Compass, BookMarked } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-zinc-100/30 dark:bg-zinc-900/10 border-y border-zinc-200/40 dark:border-zinc-800/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <User className="text-blue-500" size={24} />
            <span>About Me</span>
            <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-2">/ 关于我</span>
          </h2>
          <div className="h-1 w-12 bg-blue-500 rounded mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Narrative */}
          <div className="md:col-span-7 space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-[15px] sm:text-base">
            <p>
              I am a Grade 10 student based in Shanghai, currently navigating my transition from a traditional Chinese educational path (体制内) to the A-Level international system. This shift has given me the freedom to pursue my curiosity beyond exam papers and textbook boundaries.
            </p>
            <p>
              My academic interests lie at the intersection of <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Computer Science, Data Science, AI, and Economics</strong>. But rather than just studying theories, I believe in learning by doing. I enjoy putting ideas into code, constructing small tools, and figuring out how technology connects with products, business, and daily productivity.
            </p>
            <p>
              I don&apos;t label myself an &ldquo;AI entrepreneur&rdquo; or a &ldquo;full-stack engineer.&rdquo; I am simply a <strong className="text-blue-600 dark:text-blue-400 font-semibold">student builder who is still growing</strong>. My current focus is on building useful applications, maintaining my own local workflows, and preparing my long-term academic and personal foundations.
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 italic">
              &ldquo;I believe the best way to understand a system is to build a small version of it.&rdquo;
            </p>
          </div>

          {/* Quick Info Board */}
          <div className="md:col-span-5 space-y-4">
            <div
              className="p-5 rounded-2xl glass border border-zinc-200/60 dark:border-zinc-800/60 space-y-4 shadow-sm hover:-translate-y-1 transition-transform duration-300"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">My Perspectives</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 mt-0.5">
                    <Compass size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">System Explorer</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Fascinated by how complex pipelines and tools can be self-hosted (Docker, tunnels, local AI).
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 mt-0.5">
                    <Code2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Practical Builder</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Focused on building simple dashboards, automation utilities, and learning tools.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 mt-0.5">
                    <BookMarked size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Active Thinker</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Connecting technology with economic fundamentals, education, and film storytelling.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
