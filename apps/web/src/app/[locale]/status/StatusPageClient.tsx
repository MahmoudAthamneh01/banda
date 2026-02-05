"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  CreditCard,
  Image,
  Bell,
  Calendar,
} from "lucide-react";
import { PublicShell } from "@/components/layout/shells/PublicShell";
import { AskPanda } from "@/components/ai/AskPanda";

interface StatusPageClientProps {
  locale: string;
}

type ComponentStatus = "operational" | "degraded" | "down";

export function StatusPageClient({ locale }: StatusPageClientProps) {
  const components = [
    {
      name: "Web Application",
      status: "operational" as ComponentStatus,
      icon: Globe,
      uptime: "99.99%",
    },
    {
      name: "API",
      status: "operational" as ComponentStatus,
      icon: Activity,
      uptime: "99.98%",
    },
    {
      name: "Payments",
      status: "operational" as ComponentStatus,
      icon: CreditCard,
      uptime: "99.95%",
    },
    {
      name: "Media/Storage",
      status: "operational" as ComponentStatus,
      icon: Image,
      uptime: "99.97%",
    },
    {
      name: "Notifications",
      status: "operational" as ComponentStatus,
      icon: Bell,
      uptime: "99.96%",
    },
  ];

  const incidents = [
    {
      id: 1,
      date: "2026-01-28",
      title: "Scheduled Maintenance - Database Upgrade",
      status: "resolved",
      desc: "Completed database upgrade. All systems returned to normal operation.",
      duration: "2 hours",
    },
    {
      id: 2,
      date: "2026-01-15",
      title: "Payment Processing Delays",
      status: "resolved",
      desc: "Third-party payment provider experienced temporary delays. Resolved by provider within 45 minutes.",
      duration: "45 minutes",
    },
  ];

  const getStatusConfig = (status: ComponentStatus) => {
    switch (status) {
      case "operational":
        return {
          icon: CheckCircle,
          color: "text-success-500",
          bg: "bg-success-500/20",
          border: "border-success-500/30",
          label: "Operational",
        };
      case "degraded":
        return {
          icon: AlertCircle,
          color: "text-warn-500",
          bg: "bg-warn-500/20",
          border: "border-warn-500/30",
          label: "Degraded",
        };
      case "down":
        return {
          icon: AlertCircle,
          color: "text-danger-500",
          bg: "bg-danger-500/20",
          border: "border-danger-500/30",
          label: "Down",
        };
    }
  };

  const allOperational = components.every((c) => c.status === "operational");

  return (
    <PublicShell locale={locale}>
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Activity className="h-12 w-12 text-panda-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-4">
              System Status
            </h1>
            <p className="text-slate-300">
              Real-time status of BandaChao services and infrastructure
            </p>
          </div>

          {/* Overall Status */}
          <div
            className={`glass-card p-8 mb-8 ${
              allOperational
                ? "border-success-500/30 bg-success-500/5"
                : "border-warn-500/30 bg-warn-500/5"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {allOperational ? (
                <>
                  <CheckCircle className="h-8 w-8 text-success-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-200">
                      All Systems Operational
                    </h2>
                    <p className="text-slate-300 text-sm">
                      All services are running normally
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-8 w-8 text-warn-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-200">
                      System Issues Detected
                    </h2>
                    <p className="text-slate-300 text-sm">
                      Some services are experiencing problems
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Components */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">
              Service Components
            </h2>
            <div className="space-y-3">
              {components.map((component, i) => {
                const Icon = component.icon;
                const StatusIcon = getStatusConfig(component.status).icon;
                const config = getStatusConfig(component.status);

                return (
                  <motion.div
                    key={component.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card p-4 border ${config.border}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className="text-slate-200 font-semibold">
                            {component.name}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            Uptime: {component.uptime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${config.color}`} />
                        <span className={`text-sm font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Incident History */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">
              Recent Incidents
            </h2>
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="glass-card p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-slate-300" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-200">
                              {incident.title}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {incident.date}
                            </p>
                          </div>
                          <span className="badge bg-success-500/20 text-success-500 border-success-500/30">
                            Resolved
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">
                          {incident.desc}
                        </p>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Duration: {incident.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                  No Incidents Reported
                </h3>
                <p className="text-slate-300 text-sm">
                  All systems have been stable for the past 30 days
                </p>
              </div>
            )}
          </div>

          {/* Subscribe */}
          <div className="glass-card p-8 text-center">
            <Bell className="h-10 w-10 text-panda-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              Get Status Updates
            </h3>
            <p className="text-slate-300 mb-6">
              Subscribe to receive notifications about incidents and maintenance
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="input flex-1 w-full sm:w-auto"
              />
              <button className="btn-primary w-full sm:w-auto">Subscribe</button>
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <AskPanda context="status" />
      </div>
    </PublicShell>
  );
}
