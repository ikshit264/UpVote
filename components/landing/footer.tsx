import Link from "next/link";
import Logo from "@/components/logo";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/60 dark:border-zinc-800/60 py-16 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2.5 text-2xl font-black text-zinc-950 dark:text-white tracking-tighter mb-4">
                        <Logo size={28} />
                        UpVote
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-sm leading-relaxed">
                        The easiest way to collect, manage, and prioritize customer feedback. Built for modern product teams that care about their users' voice.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-zinc-950 dark:text-white mb-5 text-sm uppercase tracking-wider">Product</h4>
                    <ul className="space-y-3 test-sm text-zinc-500 dark:text-zinc-400">
                        <li><Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link></li>
                        <li><Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Integrations</Link></li>
                        <li><Link href="/#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
                        <li><Link href="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Changelog</Link></li>
                    </ul>
                </div>
 
                <div>
                    <h4 className="font-semibold text-zinc-950 dark:text-white mb-5 text-sm uppercase tracking-wider">Company</h4>
                    <ul className="space-y-3 test-sm text-zinc-500 dark:text-zinc-400">
                        <li><Link href="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                        <li><Link href="/info" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                        <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-zinc-950 dark:text-white mb-5 text-sm uppercase tracking-wider">Connect</h4>
                    <ul className="space-y-3 test-sm text-zinc-500 dark:text-zinc-400">
                        <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Twitter (X)</Link></li>
                        <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">LinkedIn</Link></li>
                        <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-zinc-400 dark:text-zinc-600 text-sm">
                    © {new Date().getFullYear()} UpVote Inc. All rights reserved.
                </p>
                <div className="flex gap-4">
                    {/* Additional bottom links if needed */}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
