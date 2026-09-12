"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Activity, MonitorPlay, Network, Server, HardDrive, ShieldCheck, CheckCircle2, ArrowRight, Video,
  Zap, Lock, PlayCircle, BarChart3, AlertTriangle, Clock, MapPin, Building2, Briefcase, GraduationCap, Hospital,
  Home, Landmark, WifiOff, Moon, Sun
} from "lucide-react";

import { cn } from "@/lib/utils";

function Navbar() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [isLight]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 keep-colors">
          <img src="https://digitechhms.net/static/img/digitech-logo-light.png" alt="Digitech HMS" className="h-8 w-auto" />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#industries" className="hover:text-white transition-colors">Industries</a>
          <a href="#waitlist" className="hover:text-white transition-colors">Waitlist</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsLight(!isLight)} 
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Toggle Light/Dark Mode"
          >
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button className="hidden md:block text-sm font-medium text-white hover:text-gray-300 transition-colors">
            Login
          </button>
          <a href="#waitlist" className="bg-digitech-red hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Request Demo
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-tech-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background"></div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none w-full h-[5px] bg-digitech-red/10 blur-[2px] animate-scanline z-0"></div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-500/10 border border-red-500/20 text-digitech-red text-xs font-mono uppercase tracking-wider mb-8 shadow-[0_0_10px_rgba(229,57,53,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-digitech-red animate-pulse-fast"></span>
            System Status: Active Monitoring
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Security Infrastructure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Telemetry & Health.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            Continuous 24x7 monitoring for your entire security network. Digitech HMS automatically detects offline cameras, NVR storage failures, and network switch latency—delivering root-cause diagnostics before critical incidents occur.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#waitlist" className="bg-digitech-red hover:bg-red-700 text-white px-8 py-4 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)]">
              Request Platform Demo <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#waitlist" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all">
              <Activity className="w-5 h-5 text-gray-400" /> View Architecture
            </a>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto relative mt-4">
          {/* Old Dashboard Image - Now Full Width */}
          <div className="rounded-xl border border-white/10 shadow-2xl overflow-hidden relative group bg-[#050B14]">
            <div className="absolute inset-0 bg-digitech-red/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
            <img 
              src="https://digitechhms.net/static/img/shot-dashboard.webp" 
              alt="The DHMS dashboard: 17 monitored devices, 13 up, 3 down, 3 open incidents" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="py-24 bg-[#050B14] bg-tech-grid relative border-b border-white/10" id="product">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/50"></div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-6">
            <Lock className="w-3 h-3 text-gray-500" /> [ SYSTEM_AUDIT ]
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Your cameras are installed. <br/><span className="text-digitech-red">But are they working?</span></h2>
          <p className="text-gray-400 text-lg font-mono">
            > A single point of failure can compromise your entire security posture. You often only find out when you need the footage most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Camera Failure", id: "ERR_CAM_01", icon: Video, color: "text-red-400" },
            { title: "Recording Failure", id: "ERR_NVR_02", icon: HardDrive, color: "text-red-400" },
            { title: "Network Failure", id: "ERR_NET_03", icon: WifiOff, color: "text-red-400" },
            { title: "Power Failure", id: "ERR_PWR_04", icon: Zap, color: "text-red-400" },
          ].map((item, i) => (
            <div key={i} className="bg-[#0A0F1A]/80 backdrop-blur-sm border border-red-500/20 p-6 rounded-sm text-left flex flex-col group hover:border-red-500/60 transition-colors relative overflow-hidden shadow-[0_0_20px_rgba(229,57,53,0.05)] hover:shadow-[0_0_30px_rgba(229,57,53,0.15)]">
              <div className="absolute top-0 right-0 p-2 text-[10px] text-red-500/50 font-mono group-hover:text-red-500 transition-colors">{item.id}</div>
              <div className="w-10 h-10 bg-red-500/10 rounded-sm border border-red-500/20 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
              <h3 className="text-white font-mono uppercase text-sm mb-2">{item.title}</h3>
              <div className="w-full h-1 bg-red-500/10 mt-2 overflow-hidden rounded-full">
                <div className="h-full bg-red-500/50 w-full animate-pulse-fast"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeMonitor() {
  const monitors = [
    {
      title: "CCTV Cameras",
      icon: Video,
      items: ["Online / Offline status", "Stream availability", "IP changes", "Device health", "Connectivity"]
    },
    {
      title: "NVR / DVR",
      icon: Server,
      items: ["NVR availability", "Recording status", "HDD health", "Storage capacity", "Channel status"]
    },
    {
      title: "Network",
      icon: Network,
      items: ["Managed switches", "Port status", "Uptime", "Network connectivity", "SNMP monitoring"]
    },
    {
      title: "Recording",
      icon: HardDrive,
      items: ["Recording continuity", "Recording failure", "Missing footage", "Channel-wise status"]
    },
    {
      title: "Power & Connectivity",
      icon: Zap,
      items: ["Network outage", "Site outage", "Device recovery", "Persistent failures"]
    },
    {
      title: "Site Health",
      icon: Activity,
      items: ["Overall site score", "Availability", "Incidents", "Downtime", "SLA performance"]
    }
  ];

  return (
    <section className="py-24 bg-[#0A0F1A] bg-tech-grid relative border-b border-white/10" id="features">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-4">
              <Activity className="w-3 h-3" /> [ DIAGNOSTIC_COVERAGE ]
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">What does Digitech HMS monitor?</h2>
            <p className="text-gray-400 text-lg font-mono">> Complete visibility across every layer of your security infrastructure.</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] text-gray-500 font-mono mb-1">SCAN_RATE</div>
            <div className="text-2xl font-mono text-emerald-400">1000/sec</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitors.map((module, i) => (
            <div key={i} className="bg-[#111827]/90 backdrop-blur-md border border-white/10 rounded-sm p-8 hover:border-emerald-500/30 transition-all relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center justify-center text-emerald-400">
                  <module.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-mono uppercase text-white tracking-wide">{module.title}</h3>
              </div>
              <ul className="space-y-3">
                {module.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-400 text-sm font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Monitor", desc: "Know the health of every device 24x7." },
    { num: "02", title: "Detect", desc: "Identify failures automatically." },
    { num: "03", title: "Diagnose", desc: "Find the likely root cause instantly." },
    { num: "04", title: "Alert", desc: "Notify the right person immediately." },
    { num: "05", title: "Resolve", desc: "Track the fault until complete closure." },
    { num: "06", title: "Report", desc: "Measure uptime, downtime and response." }
  ];

  return (
    <section className="py-24 bg-[#050B14] bg-tech-grid relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-6">
            <Lock className="w-3 h-3" /> [ WORKFLOW_PROTOCOL ]
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Why Digitech HMS?</h2>
          <p className="text-gray-400 text-lg font-mono">> From detection to resolution — Digitech HMS gives you the complete picture.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="relative p-6 bg-[#0A0F1A]/80 backdrop-blur-md rounded-sm border border-white/10 text-center hover:border-emerald-500/50 transition-colors group">
              <div className="text-emerald-500/50 font-mono text-xs mb-3 group-hover:text-emerald-400 transition-colors">STEP_{step.num}</div>
              <h4 className="text-white font-mono uppercase text-sm tracking-wide mb-2">{step.title}</h4>
              <p className="text-xs text-gray-500 font-mono">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/10 group-hover:bg-emerald-500/50 transition-colors"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="py-24 bg-[#0A0F1A] border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-digitech-red text-[10px] font-mono uppercase tracking-widest mb-6">
            <ShieldAlert className="w-3 h-3" /> [ RISK_ASSESSMENT ]
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Cost of Blind Spots</h2>
          <p className="text-gray-400 text-lg font-mono">> Don't wait for an incident to discover your security system has failed.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Before */}
          <div className="bg-[#111827] border border-red-500/20 rounded-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
            <h3 className="text-xl font-mono uppercase tracking-wide text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-2">
              <span className="w-8 h-8 rounded-sm bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-xs">❌</span>
              Without Digitech HMS
            </h3>
            <div className="space-y-6 font-mono text-sm">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-gray-500"></span></div>
                <div><div className="text-white font-medium">Camera fails</div><div className="text-xs text-gray-500 mt-1">Hardware or network issue</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-500">Nobody notices</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-red-500/20 bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-500"></span></div>
                <div><div className="text-red-400 font-medium">Incident occurs</div><div className="text-xs text-gray-500 mt-1">Security breach or accident</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-500">Footage required</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-red-500/20 bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-500"></span></div>
                <div><div className="text-white font-medium">Camera found offline</div><div className="text-xs text-gray-500 mt-1">No recording available</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-500">Emergency site visit</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-red-500/50 bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(229,57,53,0.3)]"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span></div>
                <div><div className="text-red-400 font-medium">Customer complaint</div><div className="text-xs text-red-500/70 mt-1">Trust broken</div></div>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="bg-[#111827] border border-emerald-500/30 rounded-sm p-8 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/80"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-mono uppercase tracking-wide text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-2">
              <span className="w-8 h-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs">✓</span>
              With Digitech HMS
            </h3>
            <div className="space-y-6 relative z-10 font-mono text-sm">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span></div>
                <div><div className="text-emerald-400 font-medium">Camera working</div><div className="text-xs text-gray-500 mt-1">Monitored 24x7</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-red-400">Camera failure detected instantly</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-yellow-500/20 bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span></div>
                <div><div className="text-yellow-400 font-medium">Alert generated</div><div className="text-xs text-gray-500 mt-1">Root cause identified</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-500">Engineer assigned automatically</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-blue-500/20 bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span></div>
                <div><div className="text-blue-400 font-medium">Fault resolved</div><div className="text-xs text-gray-500 mt-1">Proactive maintenance</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-emerald-400">Camera restored quickly</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center shrink-0 mt-0.5"><BarChart3 className="w-3 h-3 text-white" /></div>
                <div><div className="text-white font-medium">Incident recorded</div><div className="text-xs text-gray-500 mt-1">SLA metric updated</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MultiSite() {
  return (
    <section className="py-24 bg-[#050B14] bg-tech-grid border-y border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none w-full h-[3px] bg-emerald-500/10 blur-[1px] animate-scanline z-0"></div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6">
              <MapPin className="w-3 h-3 text-blue-500" /> [ GEO_DISTRIBUTION ]
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Multi-Site Monitoring</h2>
            <p className="text-gray-400 text-lg mb-8 font-mono">
              > One dashboard. Every location. Every device. Consolidate your security infrastructure health across all branches, factories, or campuses into a single, unified view.
            </p>
            <ul className="space-y-4 font-mono text-sm">
              {[
                "Centralised health dashboard",
                "Site-wise availability metrics",
                "Global incident tracking",
                "Standardised reporting across regions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> [OK] {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative p-8 lg:p-12">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
            <div className="relative bg-[#0A0F1A]/90 backdrop-blur-md border border-blue-500/20 rounded-sm p-6 font-mono shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              
              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                <div>
                  <div className="text-white font-bold tracking-widest">DIGITECH HMS</div>
                  <div className="text-blue-400 text-[10px] tracking-widest mt-1">GLOBAL.NOC.NODE</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 text-xs animate-pulse">● LIVE</div>
                  <div className="text-gray-500 text-[10px] mt-1">12 SITES ONLINE</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 border border-white/10 rounded-sm p-3 relative group hover:border-emerald-500/50 transition-colors cursor-default">
                  <div className="text-gray-400 text-[10px] mb-1">NODE_DEL</div>
                  <div className="text-white text-sm mb-1 uppercase tracking-wide">Delhi</div>
                  <div className="text-emerald-400 text-lg">99.2%</div>
                </div>
                <div className="bg-blue-500/5 border border-yellow-500/30 rounded-sm p-3 relative group hover:border-yellow-500/80 transition-colors cursor-default shadow-[0_0_10px_rgba(234,179,8,0.05)]">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-bl-sm animate-pulse-fast"></div>
                  <div className="text-gray-400 text-[10px] mb-1">NODE_GUR</div>
                  <div className="text-white text-sm mb-1 uppercase tracking-wide">Gurugram</div>
                  <div className="text-yellow-400 text-lg">97.8%</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-sm p-3 relative group hover:border-emerald-500/50 transition-colors cursor-default">
                  <div className="text-gray-400 text-[10px] mb-1">NODE_NOI</div>
                  <div className="text-white text-sm mb-1 uppercase tracking-wide">Noida</div>
                  <div className="text-emerald-400 text-lg">99.7%</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-sm p-3 relative group hover:border-emerald-500/50 transition-colors cursor-default">
                  <div className="text-gray-400 text-[10px] mb-1">NODE_MUM</div>
                  <div className="text-white text-sm mb-1 uppercase tracking-wide">Mumbai</div>
                  <div className="text-emerald-400 text-lg">98.9%</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-sm p-3 relative group hover:border-emerald-500/50 transition-colors cursor-default">
                  <div className="text-gray-400 text-[10px] mb-1">NODE_CHE</div>
                  <div className="text-white text-sm mb-1 uppercase tracking-wide">Chennai</div>
                  <div className="text-emerald-400 text-lg">99.5%</div>
                </div>
                <div className="bg-red-500/5 border border-red-500/30 rounded-sm p-3 relative group hover:border-red-500/80 transition-colors cursor-default shadow-[0_0_10px_rgba(229,57,53,0.05)]">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-bl-sm animate-pulse-fast"></div>
                  <div className="text-gray-400 text-[10px] mb-1">NODE_JAI</div>
                  <div className="text-white text-sm mb-1 uppercase tracking-wide">Jaipur</div>
                  <div className="text-red-400 text-lg">96.8%</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const industries = [
    { name: "Corporate", desc: "Monitor multiple offices and branches.", icon: Building2 },
    { name: "Industrial", desc: "Protect large plants and critical areas.", icon: Briefcase },
    { name: "Education", desc: "Monitor campus-wide surveillance.", icon: GraduationCap },
    { name: "Healthcare", desc: "Maintain continuous security coverage.", icon: Hospital },
    { name: "Residential", desc: "Monitor society-wide CCTV infrastructure.", icon: Home },
    { name: "Government", desc: "Centralised monitoring of critical sites.", icon: Landmark },
  ];

  return (
    <section className="py-24 bg-[#0A0F1A] bg-tech-grid relative border-b border-white/10" id="industries">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-6">
            <Building2 className="w-3 h-3 text-emerald-500" /> [ SECTOR_DEPLOYMENTS ]
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Built for critical security environments</h2>
          <p className="text-gray-400 text-lg font-mono">> Enterprise-grade monitoring for any industry.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {industries.map((ind, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-[#111827]/90 backdrop-blur-md border border-white/10 rounded-sm hover:border-emerald-500/30 transition-colors group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                <ind.icon className="w-5 h-5 text-gray-400 group-hover:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-mono uppercase text-white mb-1 tracking-wide">{ind.name}</h3>
                <p className="text-gray-500 text-xs font-mono">{ind.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AmcIntegration() {
  return (
    <section className="py-24 bg-[#050B14] bg-tech-grid relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4">
        <div className="bg-[#0A0F1A]/80 backdrop-blur-xl border border-digitech-red/30 rounded-sm p-8 md:p-12 shadow-[0_0_40px_rgba(229,57,53,0.05)]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 text-digitech-red text-[10px] font-mono uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3 text-red-500" /> [ SERVICE_INTEGRATION ]
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Turn your AMC into a measurable SLA</h2>
              <p className="text-gray-400 text-lg mb-8 font-mono">
                > Most maintenance contracts offer no proof they are honoured. With Digitech HMS connected to Digitech AMC, you get total transparency on our service delivery.
              </p>
              <div className="grid grid-cols-2 gap-6 font-mono">
                <div className="bg-[#111827] border border-white/10 p-4 rounded-sm">
                  <div className="text-3xl font-bold text-white mb-1">99.4%</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Guaranteed Uptime</div>
                </div>
                <div className="bg-[#111827] border border-white/10 p-4 rounded-sm">
                  <div className="text-3xl font-bold text-white mb-1">2.3h</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Avg Resolution Time</div>
                </div>
              </div>
            </div>
            <div className="bg-[#050B14] border border-white/10 rounded-sm p-6 relative font-mono">
              <div className="absolute top-0 right-0 w-4 h-4 border-b border-l border-white/20"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-t border-r border-white/20"></div>
              
              <div className="text-[10px] text-gray-500 mb-4 uppercase tracking-wider flex justify-between">
                <span>TARGET: ABC Industries</span>
                <span className="text-emerald-400 animate-pulse">LIVE_SYNC</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400">Site Availability</span>
                  <span className="text-emerald-400 font-bold">99.21%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400">Camera Uptime</span>
                  <span className="text-emerald-400 font-bold">99.46%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400">NVR Availability</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400">Network Availability</span>
                  <span className="text-emerald-400 font-bold">99.83%</span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-white font-bold tracking-widest">AMC SLA</span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest">✓ COMPLIANT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyROI() {
  return (
    <section className="py-24 bg-[#0A0F1A] border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Security & Privacy Banner */}
        <div className="bg-[#111827] border border-white/10 rounded-sm p-8 mb-24 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-tech-grid opacity-50"></div>
          <div className="relative z-10">
            <Lock className="w-10 h-10 text-digitech-red mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold font-mono text-white mb-4 uppercase tracking-wide">Your video stays on your premises.</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto font-mono text-sm">> Digitech HMS monitors health and status — not your surveillance footage. Built for high-security environments.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-2">
                <Video className="w-6 h-6 text-gray-500 line-through" />
                <span className="text-sm font-mono text-gray-400 uppercase tracking-wide">No Video Streaming</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" />
                <span className="text-sm font-mono text-gray-400 uppercase tracking-wide">Status Data Only</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-mono text-gray-400 uppercase tracking-wide">Secure Communication</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6">
              <BarChart3 className="w-3 h-3 text-blue-500" /> [ SYSTEM_VALUE_METRICS ]
            </div>
            <h2 className="text-3xl font-bold font-mono uppercase tracking-wide text-white mb-4">What does Digitech HMS save you?</h2>
            <p className="text-gray-400 font-mono text-sm">> The business value of continuous monitoring.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 font-mono">
            <div className="bg-[#111827] border border-red-500/20 rounded-sm p-6 relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500/50"></div>
              <h4 className="text-red-400 font-bold tracking-widest mb-6 flex items-center gap-2 uppercase"><ArrowRight className="w-4 h-4 rotate-90" /> Decreases</h4>
              <div className="space-y-2">
                <div className="bg-red-500/5 border border-red-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-red-400">↓</span> Emergency site visits</div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-red-400">↓</span> Security blind spots</div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-red-400">↓</span> Customer complaints</div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-red-400">↓</span> Unnoticed recording failures</div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-red-400">↓</span> AMC disputes</div>
              </div>
            </div>
            <div className="bg-[#111827] border border-emerald-500/20 rounded-sm p-6 relative shadow-[0_0_20px_rgba(16,185,129,0.05)]">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/80"></div>
              <h4 className="text-emerald-400 font-bold tracking-widest mb-6 flex items-center gap-2 uppercase"><ArrowRight className="w-4 h-4 -rotate-90" /> Increases</h4>
              <div className="space-y-2">
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-emerald-400">↑</span> Equipment availability</div>
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-emerald-400">↑</span> Engineer productivity</div>
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-emerald-400">↑</span> Security assurance</div>
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-sm p-3 text-gray-300 flex items-center gap-3 text-sm"><span className="text-emerald-400">↑</span> AMC value</div>
              </div>
            </div>
          </div>
        </div>
    function WaitlistCTA() {
  return (
    <section id="waitlist" className="py-24 bg-[#0A0F1A] border-t border-white/5 relative overflow-hidden bg-tech-grid">
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 text-emerald-500" /> [ EARLY_ACCESS ]
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 tracking-tight uppercase font-mono">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">DHMS</span> waitlist
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <form className="md:col-span-2 space-y-6" id="wl-form" noValidate>
              <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
                <div>
                  <label htmlFor="wl-name" className="block text-gray-400 mb-2 uppercase tracking-wide">Your name *</label>
                  <input id="wl-name" name="name" type="text" maxLength={120} autoComplete="name" required placeholder="Rajesh Kumar" className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="wl-phone" className="block text-gray-400 mb-2 uppercase tracking-wide">Phone number *</label>
                  <input id="wl-phone" name="phone" type="tel" maxLength={20} autoComplete="tel" required placeholder="98765 43210" className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="font-mono text-sm">
                <label htmlFor="wl-org" className="block text-gray-400 mb-2 uppercase tracking-wide">Business or organisation *</label>
                <input id="wl-org" name="organisation" type="text" maxLength={160} autoComplete="organization" required placeholder="Sunrise Public School" className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
                <div>
                  <label htmlFor="wl-city" className="block text-gray-400 mb-2 uppercase tracking-wide">City</label>
                  <input id="wl-city" name="city" type="text" maxLength={80} autoComplete="address-level2" placeholder="New Delhi" className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="wl-email" className="block text-gray-400 mb-2 uppercase tracking-wide">Email (optional)</label>
                  <input id="wl-email" name="email" type="email" maxLength={200} autoComplete="email" placeholder="you@company.com" className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
                <div>
                  <label htmlFor="wl-sites" className="block text-gray-400 mb-2 uppercase tracking-wide">Number of locations</label>
                  <select id="wl-sites" name="site_count" className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                    <option value="1">1 location</option>
                    <option value="2">2 &ndash; 4 locations</option>
                    <option value="5">5 &ndash; 10 locations</option>
                    <option value="11">11+ locations</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="wl-plan" className="block text-gray-400 mb-2 uppercase tracking-wide">Which plan interests you</label>
                  <select id="wl-plan" name="plan_interest" defaultValue="yearly" className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                    <option value="yearly">Yearly &mdash; ₹122,999 per site</option>
                    <option value="quarterly">Quarterly &mdash; ₹16,749 per site</option>
                    <option value="monthly">Monthly &mdash; ₹12,499 per site</option>
                    <option value="custom">Custom &mdash; five sites or more</option>
                  </select>
                </div>
              </div>

              <div className="font-mono text-sm">
                <label htmlFor="wl-message" className="block text-gray-400 mb-2 uppercase tracking-wide">Anything you would like us to know</label>
                <textarea id="wl-message" name="message" rows={3} maxLength={1000} placeholder="We have 40 cameras across two floors and a Hikvision recorder." className="w-full bg-[#111827] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"></textarea>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="wl-website">Leave this field empty</label>
                <input id="wl-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button className="bg-emerald-500 hover:bg-emerald-400 text-[#050B14] px-8 py-4 rounded-sm font-bold font-mono tracking-widest transition-colors mt-4 w-full md:w-auto" type="submit" id="wl-submit">
                [ SUBMIT_REQUEST ]
              </button>

              <p className="text-gray-500 text-sm mt-4">
                We will only use these details to contact you about DHMS. No marketing lists, and we do not pass anything to third parties.
              </p>
            </form>

            <aside className="md:pl-8 border-l border-white/5 space-y-8">
              <p className="text-gray-400 leading-relaxed">
                We are onboarding new sites in batches so that every installation gets proper attention. Leave your details and we will call you to walk through your setup and what it would cost — no obligation, and no automated sales calls.
              </p>
              <div>
                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2">Or simply call us</p>
                <a className="text-2xl font-bold text-white hover:text-digitech-red transition-colors" href="tel:+919999760222">+91 9999 760 222</a>
              </div>
              <div>
                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2">Email</p>
                <a className="text-xl font-bold text-white hover:text-digitech-red transition-colors break-all" href="mailto:info@digitechservices.net">info@digitechservices.net</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#050B14] py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="https://digitechhms.net/static/img/digitech-logo-light.png" alt="Digitech HMS" className="h-8 w-auto" />
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Enterprise-grade Security Infrastructure Health Monitoring Platform. Know before you need the footage.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#waitlist" className="hover:text-white transition-colors">Waitlist</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Industries</a></li>
              </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">About Digitech</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Digitech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-navy selection:bg-digitech-red selection:text-white">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <WhatWeMonitor />
      <HowItWorks />
      <BeforeAfter />
      <MultiSite />
      <Industries />
      <AmcIntegration />
      <PrivacyROI />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
