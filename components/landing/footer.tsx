import Link from "next/link";
import Logo from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-white px-4 py-14 dark:bg-zinc-950 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-around gap-12 md:flex-row md:items-center">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2.5 text-xl font-black tracking-tighter text-zinc-950 dark:text-white md:text-2xl">
              <Logo size={28} />
              <span>MonkFeed</span>
            </div>

            <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              MonkFeed is the easiest way to collect, manage, and prioritize customer feedback.
              Built for modern product teams that care about their users&apos; voice, our platform helps you
              make data-driven decisions and build products your customers love. Join thousands of teams
              using MonkFeed to transform feedback into actionable insights and ship features that matter most.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              Quick Links
            </p>

            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/blogs" className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/info" className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
                  Info
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200/60 pt-8 dark:border-zinc-800/60 md:flex-row">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 md:text-left">
            {"\u00A9"} {new Date().getFullYear()} MonkFeed Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/privacy" className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
