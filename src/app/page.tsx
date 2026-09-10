import { 
  ShieldAlert, Activity, MonitorPlay, Network, Server, HardDrive, ShieldCheck, CheckCircle2, ArrowRight, Video,
  Zap, Lock, PlayCircle, BarChart3, AlertTriangle, Clock, MapPin, Building2, Briefcase, GraduationCap, Hospital,
  Home, Landmark, WifiOff
} from "lucide-react";

import { cn } from "@/lib/utils";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="https://digitechhms.net/static/img/digitech-logo-light.png" alt="Digitech HMS" className="h-8 w-auto" />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#industries" className="hover:text-white transition-colors">Industries</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm font-medium text-white hover:text-gray-300 transition-colors">
            Login
          </button>
          <button className="bg-digitech-red hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Request Demo
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy"></div>
      
      <div className="container relative mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-digitech-red text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="flex h-2 w-2 rounded-full bg-digitech-red animate-pulse"></span>
            Enterprise Health Monitoring
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Security Infrastructure <br />
            <span className="text-gray-400">Telemetry & Health Monitoring.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
            Continuously monitor your entire security network 24x7. Digitech HMS automatically detects offline cameras, NVR storage failures, and switch latency, delivering root-cause diagnostics before an incident exposes a blind spot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-digitech-red hover:bg-red-700 text-white px-8 py-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors">
              Request Demo <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors">
              <PlayCircle className="w-5 h-5" /> See How It Works
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Dashboard Preview Graphic */}
          <div className="rounded-xl border border-white/10 bg-[#0c1322] shadow-2xl p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-digitech-red/0 via-digitech-red to-digitech-red/0 opacity-50"></div>
            
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-white font-semibold">DIGITECH HMS</h3>
                <p className="text-xs text-gray-500">Live Infrastructure Status</p>
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-emerald-400">98.7%</h3>
                <p className="text-xs text-gray-500">Site Health Score</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded p-3 border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Cameras</div>
                <div className="text-xl font-semibold text-white">1,248</div>
                <div className="w-full bg-white/10 h-1.5 rounded mt-2"><div className="bg-emerald-500 h-1.5 rounded" style={{width: '99%'}}></div></div>
              </div>
              <div className="bg-white/5 rounded p-3 border border-white/5">
                <div className="text-xs text-gray-400 mb-1">NVRs</div>
                <div className="text-xl font-semibold text-white">42</div>
                <div className="w-full bg-white/10 h-1.5 rounded mt-2"><div className="bg-emerald-500 h-1.5 rounded" style={{width: '97%'}}></div></div>
              </div>
              <div className="bg-white/5 rounded p-3 border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Switches</div>
                <div className="text-xl font-semibold text-white">76</div>
                <div className="w-full bg-white/10 h-1.5 rounded mt-2"><div className="bg-emerald-500 h-1.5 rounded" style={{width: '99%'}}></div></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Active Incidents (3)</span>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded p-3 flex justify-between items-start">
                <div>
                  <div className="text-red-400 text-sm font-medium">Recording Stopped</div>
                  <div className="text-xs text-gray-400">Camera CAM-023 • NVR-04</div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 02:17 PM</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 flex justify-between items-start">
                <div>
                  <div className="text-yellow-400 text-sm font-medium">Network Latency High</div>
                  <div className="text-xs text-gray-400">Switch SW-East-02</div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 01:45 PM</div>
              </div>
            </div>
            
            {/* Overlay network lines effect */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" aria-hidden="true">
               <path d="M 0 50 Q 150 50 150 150 T 300 150" fill="none" stroke="#E53935" strokeWidth="2" className="animate-dash" strokeDasharray="10 10" />
            </svg>
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

function PricingCTA() {
  return (
    <section className="py-24 bg-charcoal" id="pricing">
      <div className="container mx-auto px-4">
        
        {/* Supported Brands */}
        <div className="mb-24 text-center border-b border-white/5 pb-16">
          <h3 className="text-xl font-medium text-white mb-8">Works with the security equipment you already have</h3>
          <div className="flex flex-wrap justify-center gap-8 text-gray-400 font-medium">
            <span>Hikvision</span>
            <span>•</span>
            <span>Dahua</span>
            <span>•</span>
            <span>CP PLUS</span>
            <span>•</span>
            <span>Axis</span>
            <span>•</span>
            <span>Honeywell</span>
            <span>•</span>
            <span>Bosch</span>
            <span>•</span>
            <span>Uniview</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Plans designed for every deployment</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { name: "Essential", desc: "For smaller sites" },
            { name: "Professional", desc: "For commercial sites" },
            { name: "Enterprise", desc: "For multi-site deployments" },
            { name: "Managed HMS", desc: "HMS + Digitech AMC + on-site support", highlighted: true }
          ].map((plan, i) => (
            <div key={i} className={cn("p-6 rounded-xl border flex flex-col justify-between", plan.highlighted ? "border-digitech-red bg-digitech-red/5 relative" : "border-white/10 bg-navy")}>
              {plan.highlighted && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-digitech-red text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>}
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-8">{plan.desc}</p>
              </div>
              <button className={cn("w-full py-2 rounded font-medium transition-colors", plan.highlighted ? "bg-digitech-red text-white hover:bg-red-700" : "bg-white/10 text-white hover:bg-white/20")}>
                Request Pricing
              </button>
            </div>
          ))}
        </div>

        {/* Assessment CTA */}
        <div className="bg-gradient-to-r from-navy to-charcoal border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">How healthy is your CCTV system?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Let Digitech HMS check your existing security infrastructure with a Free Site Health Assessment.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-navy px-8 py-4 rounded-md font-bold hover:bg-gray-200 transition-colors">
              Get A Site Health Assessment
            </button>
            <button className="bg-digitech-red text-white px-8 py-4 rounded-md font-bold hover:bg-red-700 transition-colors">
              Request A Demo
            </button>
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
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
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
      <PricingCTA />
      <Footer />
    </main>
  );
}
