"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Star,
  Eye,
  BarChart3,
  Settings,
  LifeBuoy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPreview() {

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      const baseWidth = 1200;
      const padding = 40;

      const newScale = Math.min((screenWidth - padding) / baseWidth, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const apps = [
    {
      id: "1",
      name: "SaaS Platform Pro",
      feedbackCount: 1247,
      createdAt: "2024-01-15",
      status: "Live"
    },
    {
      id: "2",
      name: "Mobile Banking App",
      feedbackCount: 892,
      createdAt: "2024-02-20",
      status: "Live"
    },
  ];

  const recentFeedback = [
    { id: "f1", title: "Add dark mode support", votes: 47, category: "Feature" },
    { id: "f2", title: "Improve onboarding flow", votes: 32, category: "UX" },
  ];

  return (
    <section className="md:py-24 pb-10 bg-zinc-50 overflow-hidden">

      <div className="container sm:mx-auto md:px-4">

        <div className="flex justify-center items-center">

          {/* SCALE WRAPPER */}
          <div
            style={{
              transformOrigin: "top center",
              width: "100%"
            }}
          >

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden"
            >

              {/* Browser Bar */}
              <div className="flex items-center gap-2 p-3 md:p-4 bg-zinc-100 border-b">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400" />
                </div>

                <div className="flex-1 text-center text-[10px] md:text-sm text-zinc-500 font-medium">
                  upvote.entrext.com/dashboard
                </div>

                <div className="w-12 md:w-16" />
              </div>

              {/* DASHBOARD */}
              <div className="flex flex-col md:flex-row">

                {/* SIDEBAR - Hidden on Mobile */}
                <div className="hidden lg:block w-56 border-r bg-zinc-50 p-6 space-y-4">

                  <div className="text-lg font-bold mb-6">
                    Upvote
                  </div>

                  <nav className="space-y-2">

                    <SidebarItem icon={BarChart3} label="Analytics" />
                    <SidebarItem icon={MessageCircle} label="Feedback" />
                    <SidebarItem icon={LifeBuoy} label="Support" />
                    <SidebarItem icon={Users} label="Users" />
                    <SidebarItem icon={Settings} label="Settings" />

                  </nav>

                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 p-4 md:p-8">

                  {/* STATS - Responsive Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">

                    <StatCard
                      title="Total Feedback"
                      value="1,247"
                      icon={MessageCircle}
                      color="blue"
                    />

                    <StatCard
                      title="Active Users"
                      value="892"
                      icon={Users}
                      color="purple"
                    />

                    <StatCard
                      title="Response Rate"
                      value="94%"
                      icon={Zap}
                      color="green"
                    />

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                    {/* APPS */}
                    <div className="md:col-span-2 space-y-4 md:space-y-6">

                      <div className="flex justify-between items-center">

                        <h3 className="text-lg md:text-2xl font-bold">
                          Your Applications
                        </h3>

                        <Button variant="outline" size="sm" className="hidden md:flex">
                          <Eye className="w-4 h-4 mr-2" />
                          View All
                        </Button>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">

                        {apps.map((app) => (
                          <Card
                            key={app.id}
                            className="p-4 md:p-6 hover:shadow-lg transition"
                          >
                            <div className="space-y-3 md:space-y-4">

                              <div className="flex justify-between">

                                <h4 className="font-bold text-sm md:text-lg truncate">
                                  {app.name}
                                </h4>

                                <Badge className="bg-green-100 text-green-700 text-[10px] md:text-xs px-2 py-0.5">
                                  {app.status}
                                </Badge>

                              </div>

                              <div className="grid grid-cols-2 gap-2 md:gap-3">

                                <div className="bg-zinc-50 p-2 md:p-3 rounded-lg">
                                  <p className="text-[10px] md:text-xs text-zinc-500">
                                    Feedback
                                  </p>

                                  <p className="font-bold text-sm md:text-base">
                                    {app.feedbackCount}
                                  </p>
                                </div>

                                <div className="bg-zinc-50 p-2 md:p-3 rounded-lg">
                                  <p className="text-[10px] md:text-xs text-zinc-500">
                                    Created
                                  </p>

                                  <p className="font-bold text-sm md:text-base">
                                    Jan 15
                                  </p>
                                </div>

                              </div>

                              <Button className="w-full" variant="outline" size="sm">
                                Manage App
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                              </Button>

                            </div>
                          </Card>
                        ))}

                      </div>

                    </div>

                    {/* FEEDBACK */}
                    <Card className="p-4 md:p-6">

                      <h3 className="font-bold text-sm md:text-base mb-4 md:mb-6">
                        Popular Features
                      </h3>

                      <div className="space-y-3 md:space-y-4">

                        {recentFeedback.map((item) => (

                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >

                            <div>

                              <p className="font-medium text-xs md:text-sm">
                                {item.title}
                              </p>

                              <Badge variant="secondary" className="text-[9px] md:text-xs">
                                {item.category}
                              </Badge>

                            </div>

                            <div className="flex items-center gap-1">

                              {item.votes}

                              <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />

                            </div>

                          </div>

                        ))}

                      </div>

                    </Card>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </section>
  );
}

function SidebarItem({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-200 cursor-pointer">
      <Icon className="w-4 h-4 text-zinc-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="p-4 md:p-6 flex justify-between items-center">

      <div>
        <p className="text-[10px] md:text-lg text-zinc-500 uppercase">
          {title}
        </p>

        <p className="text-xs md:text-lg font-bold">
          {value}
        </p>
      </div>

      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
        <Icon className="w-5 h-5 md:w-7 md:h-7 text-zinc-700" />
      </div>

    </Card>
  );
}