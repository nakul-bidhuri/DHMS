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

      <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-500/10 border border-red-500/20 text-digitech-red text-xs font-mono uppercase tracking-wider mb-8 shadow-[0_0_10px_rgba(229,57,53,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-digitech-red animate-pulse-fast"></span>
            System Status: Active Monitoring
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
            Security Infrastructure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Telemetry & Health.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed font-light">
            Continuous 24x7 monitoring for your entire security network. Digitech HMS automatically detects offline cameras, NVR storage failures, and network switch latency—delivering root-cause diagnostics before critical incidents occur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#waitlist" className="bg-digitech-red hover:bg-red-700 text-white px-8 py-4 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)]">
              Request Platform Demo <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#waitlist" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all">
              <Activity className="w-5 h-5 text-gray-400" /> View Architecture
            </a>
          </div>
        </div>

        <div className="relative">
          {/* Old Dashboard Image */}
          <div className="rounded-md border border-white/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-digitech-red/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
            <img 
              src="https://digitechhms.net/static/img/shot-dashboard.webp" 
              alt="The DHMS dashboard: 17 monitored devices, 13 up, 3 down, 3 open incidents" 
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="py-24 bg-charcoal" id="product">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Your cameras are installed. <br/><span className="text-gray-400">But are they working?</span></h2>
          <p className="text-gray-400 text-lg">
            Your CCTV system can fail without anyone knowing. A single point of failure can compromise your entire security posture, and you often only find out when you need the footage most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Camera Failure", icon: Video, color: "text-red-400" },
            { title: "Recording Failure", icon: HardDrive, color: "text-red-400" },
            { title: "Network Failure", icon: WifiOff, color: "text-red-400" },
            { title: "Power Failure", icon: Zap, color: "text-red-400" },
          ].map((item, i) => (
            <div key={i} className="bg-navy border border-white/5 p-6 rounded-lg text-center flex flex-col items-center group hover:border-red-500/30 transition-colors">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500/10 transition-colors">
                <item.icon className={cn("w-6 h-6", item.color)} />
              </div>
              <h3 className="text-white font-medium">{item.title}</h3>
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
    <section className="py-24 bg-navy" id="features">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What does Digitech HMS monitor?</h2>
          <p className="text-gray-400 text-lg max-w-2xl">Complete visibility across every layer of your security infrastructure.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitors.map((module, i) => (
            <div key={i} className="bg-charcoal border border-white/5 rounded-xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                  <module.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{module.title}</h3>
              </div>
              <ul className="space-y-3">
                {module.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
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
    <section className="py-24 bg-charcoal relative overflow-hidden" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Digitech HMS?</h2>
          <p className="text-gray-400 text-lg">From detection to resolution — Digitech HMS gives you the complete picture.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="relative p-6 bg-navy rounded-lg border border-white/5 text-center">
              <div className="text-digitech-red font-mono text-xl font-bold mb-3">{step.num}</div>
              <h4 className="text-white font-semibold mb-2">{step.title}</h4>
              <p className="text-xs text-gray-400">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/20"></div>
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
    <section className="py-24 bg-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Cost of Blind Spots</h2>
          <p className="text-gray-400 text-lg">Don't wait for an incident to discover your security system has failed.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before */}
          <div className="bg-charcoal border border-white/5 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">❌</span>
              Without Digitech HMS
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-gray-500"></span></div>
                <div><div className="text-white font-medium">Camera fails</div><div className="text-sm text-gray-500">Hardware or network issue</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-400">Nobody notices</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-500"></span></div>
                <div><div className="text-red-400 font-medium">Incident occurs</div><div className="text-sm text-gray-500">Security breach or accident</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-400">Footage required</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-500"></span></div>
                <div><div className="text-white font-medium">Camera found offline</div><div className="text-sm text-gray-500">No recording available</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-400">Emergency site visit</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span></div>
                <div><div className="text-red-400 font-medium">Customer complaint</div><div className="text-sm text-red-500/70">Trust broken</div></div>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="bg-charcoal border border-digitech-red/30 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-digitech-red/5 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-semibold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">✓</span>
              With Digitech HMS
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span></div>
                <div><div className="text-emerald-400 font-medium">Camera working</div><div className="text-sm text-gray-500">Monitored 24x7</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-red-400">Camera failure detected instantly</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span></div>
                <div><div className="text-yellow-400 font-medium">Alert generated</div><div className="text-sm text-gray-500">Root cause identified</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-gray-400">Engineer assigned automatically</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span></div>
                <div><div className="text-blue-400 font-medium">Fault resolved</div><div className="text-sm text-gray-500">Proactive maintenance</div></div>
              </div>
              <div className="flex gap-4 items-start ml-3 pl-6 border-l border-white/10 pb-6 -mt-6 pt-6">
                <div className="text-emerald-400">Camera restored quickly</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><BarChart3 className="w-3 h-3 text-white" /></div>
                <div><div className="text-white font-medium">Incident recorded</div><div className="text-sm text-gray-500">SLA metric updated</div></div>
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
    <section className="py-24 bg-charcoal border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Multi-Site Monitoring</h2>
            <p className="text-gray-400 text-lg mb-8">
              One dashboard. Every location. Every device. Consolidate your security infrastructure health across all branches, factories, or campuses into a single, unified view.
            </p>
            <ul className="space-y-4">
              {[
                "Centralised health dashboard",
                "Site-wise availability metrics",
                "Global incident tracking",
                "Standardised reporting across regions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-digitech-red" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative p-8">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
            <div className="relative bg-navy border border-white/10 rounded-xl p-6 font-mono shadow-2xl">
              <div className="text-center mb-6 border-b border-white/10 pb-4">
                <div className="text-white font-bold text-xl">DIGITECH HMS</div>
                <div className="text-digitech-red text-sm">CENTRAL MONITORING</div>
              </div>
              <div className="text-center mb-6 text-gray-300">12 SITES MONITORED</div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded p-3">
                  <div className="text-white text-sm mb-1">Delhi</div>
                  <div className="text-emerald-400">99.2%</div>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="text-white text-sm mb-1">Gurgaon</div>
                  <div className="text-yellow-400">97.8%</div>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="text-white text-sm mb-1">Noida</div>
                  <div className="text-emerald-400">99.7%</div>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="text-white text-sm mb-1">Mumbai</div>
                  <div className="text-emerald-400">98.9%</div>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="text-white text-sm mb-1">Chennai</div>
                  <div className="text-emerald-400">99.5%</div>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="text-white text-sm mb-1">Jaipur</div>
                  <div className="text-red-400">96.8%</div>
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
    <section className="py-24 bg-navy" id="industries">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for critical security environments</h2>
          <p className="text-gray-400 text-lg">Enterprise-grade monitoring for any industry.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {industries.map((ind, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-charcoal border border-white/5 rounded-lg">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                <ind.icon className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{ind.name}</h3>
                <p className="text-gray-400 text-sm">{ind.desc}</p>
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
    <section className="py-24 bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-navy to-navy/50 border border-digitech-red/20 rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-6">
                Digitech AMC Integration
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Turn your AMC into a measurable SLA</h2>
              <p className="text-gray-300 text-lg mb-8">
                Most maintenance contracts offer no proof they are honoured. With Digitech HMS connected to Digitech AMC, you get total transparency on our service delivery.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">99.4%</div>
                  <div className="text-sm text-gray-400">Guaranteed Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">2.3h</div>
                  <div className="text-sm text-gray-400">Avg Resolution Time</div>
                </div>
              </div>
            </div>
            <div className="bg-[#0c1322] border border-white/10 rounded-xl p-6">
              <div className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Customer: ABC Industries</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-300">Site Availability</span>
                  <span className="text-emerald-400 font-mono">99.21%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-300">Camera Uptime</span>
                  <span className="text-emerald-400 font-mono">99.46%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-300">NVR Availability</span>
                  <span className="text-emerald-400 font-mono">100%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-300">Network Availability</span>
                  <span className="text-emerald-400 font-mono">99.83%</span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-white font-medium">AMC SLA</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">✓ COMPLIANT</span>
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
    <section className="py-24 bg-navy">
      <div className="container mx-auto px-4">
        {/* Security & Privacy Banner */}
        <div className="bg-charcoal border border-white/10 rounded-xl p-8 mb-24 text-center max-w-4xl mx-auto">
          <Lock className="w-12 h-12 text-digitech-red mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Your video stays on your premises.</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Digitech HMS monitors health and status — not your surveillance footage. Built for high-security environments.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2">
              <Video className="w-6 h-6 text-gray-500 line-through" />
              <span className="text-sm text-gray-300">No Video Streaming</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              <span className="text-sm text-gray-300">Status Data Only</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-300">Secure Communication</span>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">What does Digitech HMS save you?</h2>
            <p className="text-gray-400">The business value of continuous monitoring.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-red-400 font-semibold mb-6 flex items-center gap-2"><ArrowRight className="w-4 h-4 rotate-90" /> Reduces</h4>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-red-400">↓</span> Emergency site visits</div>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-red-400">↓</span> Security blind spots</div>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-red-400">↓</span> Customer complaints</div>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-red-400">↓</span> Unnoticed recording failures</div>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-red-400">↓</span> AMC disputes</div>
            </div>
            <div className="space-y-4">
              <h4 className="text-emerald-400 font-semibold mb-6 flex items-center gap-2"><ArrowRight className="w-4 h-4 -rotate-90" /> Increases</h4>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-emerald-400">↑</span> Equipment availability</div>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-emerald-400">↑</span> Engineer productivity</div>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-emerald-400">↑</span> Security assurance</div>
              <div className="bg-white/5 rounded-lg p-4 text-gray-300 flex items-center gap-3"><span className="text-emerald-400">↑</span> AMC value</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistCTA() {
  return (
    <section id="waitlist" className="py-24 bg-[#0A0F1A] border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 tracking-tight">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">DHMS</span> waitlist
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <form className="md:col-span-2 space-y-6" id="wl-form" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="wl-name" className="block text-sm font-medium text-gray-400 mb-2">Your name *</label>
                  <input id="wl-name" name="name" type="text" maxLength={120} autoComplete="name" required placeholder="Rajesh Kumar" className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors" />
                </div>
                <div>
                  <label htmlFor="wl-phone" className="block text-sm font-medium text-gray-400 mb-2">Phone number *</label>
                  <input id="wl-phone" name="phone" type="tel" maxLength={20} autoComplete="tel" required placeholder="98765 43210" className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors" />
                </div>
              </div>

              <div>
                <label htmlFor="wl-org" className="block text-sm font-medium text-gray-400 mb-2">Business or organisation *</label>
                <input id="wl-org" name="organisation" type="text" maxLength={160} autoComplete="organization" required placeholder="Sunrise Public School" className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="wl-city" className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  <input id="wl-city" name="city" type="text" maxLength={80} autoComplete="address-level2" placeholder="New Delhi" className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors" />
                </div>
                <div>
                  <label htmlFor="wl-email" className="block text-sm font-medium text-gray-400 mb-2">Email (optional)</label>
                  <input id="wl-email" name="email" type="email" maxLength={200} autoComplete="email" placeholder="you@company.com" className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="wl-sites" className="block text-sm font-medium text-gray-400 mb-2">Number of locations</label>
                  <select id="wl-sites" name="site_count" className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors">
                    <option value="1">1 location</option>
                    <option value="2">2 &ndash; 4 locations</option>
                    <option value="5">5 &ndash; 10 locations</option>
                    <option value="11">11+ locations</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="wl-plan" className="block text-sm font-medium text-gray-400 mb-2">Which plan interests you</label>
                  <select id="wl-plan" name="plan_interest" defaultValue="yearly" className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors">
                    <option value="yearly">Yearly &mdash; ₹22,999 per site</option>
                    <option value="quarterly">Quarterly &mdash; ₹6,749 per site</option>
                    <option value="monthly">Monthly &mdash; ₹2,499 per site</option>
                    <option value="custom">Custom &mdash; five sites or more</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="wl-message" className="block text-sm font-medium text-gray-400 mb-2">Anything you would like us to know</label>
                <textarea id="wl-message" name="message" rows={3} maxLength={1000} placeholder="We have 40 cameras across two floors and a Hikvision recorder." className="w-full bg-[#111827] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-digitech-red transition-colors"></textarea>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="wl-website">Leave this field empty</label>
                <input id="wl-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-sm font-semibold transition-colors mt-4" type="submit" id="wl-submit">
                Join the waitlist
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
