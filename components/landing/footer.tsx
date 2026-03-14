import Link from "next/link";
import Logo from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 py-14 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5 text-xl md:text-2xl font-black text-zinc-950 dark:text-white tracking-tighter">
              <Logo size={28} />
              <span>UpVote</span>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-md">
              The easiest way to collect, manage, and prioritize customer feedback.
              Built for modern product teams that care about their users' voice.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              Product
            </h4>

            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features
                </Link>
              </li>

              <li>
                <Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Integrations
                </Link>
              </li>

              <li>
                <Link href="/#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              Company
            </h4>

            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/info" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              Connect
            </h4>

            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Twitter (X)
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  LinkedIn
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-zinc-400 dark:text-zinc-600 text-sm text-center md:text-left">
            © {new Date().getFullYear()} UpVote Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-zinc-400 dark:text-zinc-500">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms
            </Link>

            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;