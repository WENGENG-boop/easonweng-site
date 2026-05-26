export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/40 dark:border-zinc-800/40 text-center text-xs text-zinc-500 dark:text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 space-y-2">
        <p>© {currentYear} Weng. All rights reserved.</p>
        <p className="font-mono text-[10px]">
          Student Builder · AI Explorer · Creative Technologist
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
          Built with Next.js, Tailwind CSS, and Framer Motion.
        </p>
      </div>
    </footer>
  );
}
