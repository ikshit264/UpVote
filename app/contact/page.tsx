import Link from "next/link";
import { Mail, MapPin, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tighter mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Reach out and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid gap-6 mb-12">
          
          {/* Email */}
          <Card className="p-6 border-none shadow-sm bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Email Us</h3>
                <a href="mailto:hello@upvote.com" rel="nofollow" className="text-blue-600 dark:text-blue-400 hover:underline">
                  hello@upvote.com
                </a>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 border-none shadow-sm bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Location</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </Card>

          {/* Response Time */}
          <Card className="p-6 border-none shadow-sm bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Response Time</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            For support inquiries, please use the widget in your dashboard.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link 
              href="/" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Back to Home
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link 
              href="/blogs" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Visit Blog
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
