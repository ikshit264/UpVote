import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Zap, BarChart3 } from 'lucide-react';
import AnimatedLogo from '@/components/animated-logo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
            <AnimatedLogo size={40} />
            UpVote
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Collect Customer Feedback
            <span className="text-blue-600"> Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Embed a beautiful feedback widget on your website. Let your customers upvote ideas and
            track what matters most to them.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose UpVote?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Integration
              </h3>
              <p className="text-gray-600">
                Add the widget to your website with just two lines of code. No complex setup required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Engage Users
              </h3>
              <p className="text-gray-600">
                Let customers upvote ideas they care about. Create a community around feature requests.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Track & Analyze
              </h3>
              <p className="text-gray-600">
                See what matters most to your customers. Prioritize development based on real feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Example */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Integration in Minutes
          </h2>
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
            <p className="text-gray-600 mb-4">Copy this code and paste it on your website:</p>
            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm overflow-x-auto mb-4">
              <pre>{`<div data-upvote-company-id="your_company_id"></div>
<script src="https://your-domain.com/widget.js"><\/script>`}</pre>
            </div>
            <p className="text-sm text-gray-500">
              Replace{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">your_company_id</code> with your actual company ID from the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to hear from your customers?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Start collecting feedback today. It's free to get started.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2.5 text-2xl font-black text-white uppercase tracking-tighter">
              <AnimatedLogo size={40} />
              UpVote
            </div>
            <p className="text-center md:text-right">
              © 2024 UpVote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

