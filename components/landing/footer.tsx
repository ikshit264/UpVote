import Link from "next/link";
import AnimatedLogo from "@/components/animated-logo";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2.5 text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
                        <AnimatedLogo size={24} reducedMotion />
                        UpVote
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">
                        The easiest way to collect and manage customer feedback. Built for modern product teams.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Product</h4>
                    <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                        <li><Link href="#" className="hover:text-blue-600 transition-colors">Features</Link></li>
                        <li><Link href="#" className="hover:text-blue-600 transition-colors">Integrations</Link></li>
                        <li><Link href="#" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-blue-600 transition-colors">Changelog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Company</h4>
                    <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                        <li><Link href="/blogs" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                        <li><Link href="/info" className="hover:text-blue-600 transition-colors">Information</Link></li>
                        <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link></li>
                        <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-zinc-400 text-sm">
                    © {new Date().getFullYear()} UpVote Inc. All rights reserved.
                </p>
                <div className="flex gap-4">
                    {/* Social Icons would go here */}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
