'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Inbox, 
  Filter, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Save, 
  RefreshCw, 
  Layers, 
  ExternalLink, 
  Shield, 
  ArrowUpRight, 
  SlidersHorizontal, 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  Calendar, 
  Wrench, 
  FileText, 
  Send, 
  Table, 
  LayoutGrid, 
  X, 
  MessageCircle,
  Building,
  MapPin,
  Flame,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface ComplaintItem {
  id: number | string;
  date?: string;
  complaintType?: string;
  ticketNo?: string;
  clientName?: string;
  clientEmail?: string;
  address?: string;
  contactPerson?: string;
  contactNumber?: string;
  priority?: string;
  channel?: string;
  assignedDate?: string;
  engineer1?: string;
  engineer2?: string;
  problem?: string;
  finding?: string;
  actionTaken?: string;
  materials?: string;
  rectificationType?: string;
  usedMaterial?: string;
  requiredMaterial?: string;
  remarks?: string;
  status?: string;
  finalStatus?: string;
  [key: string]: string | number | undefined;
}

export default function AdminPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation & View State
  const [activeNav, setActiveNav] = useState<'inbox' | 'all' | 'escalated' | 'approval' | 'resolved'>('inbox');
  const [viewMode, setViewMode] = useState<'inbox' | 'table'>('inbox');
  const [selectedTicketId, setSelectedTicketId] = useState<string | number | null>(null);

  // Filters requested by user:
  // 1. Status: All, Open, Awaiting Approval, Awaiting Customer, Escalated, Resolved, Closed
  // 2. Priority: All, P1, P2, P3, P4
  // 3. Channel: All, WhatsApp, Gmail, Web Portal
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');

  // Notification / Save state
  const [saveStatus, setSaveStatus] = useState<{ id: string | number | null; saving: boolean; message: string | null }>({
    id: null,
    saving: false,
    message: null,
  });

  const fetchComplaints = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/complaints', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Normalize priority & channel defaults if missing
        const normalized = data.map((item: ComplaintItem) => ({
          ...item,
          priority: item.priority || (item.problem?.toLowerCase().includes('offline') ? 'P1' : 'P2'),
          channel: item.channel || 'Web Portal',
          status: item.status || 'Open',
        }));
        setComplaints(normalized);
        if (!selectedTicketId && normalized.length > 0) {
          setSelectedTicketId(normalized[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Update a single field in local state
  const updateComplaint = (id: number | string, field: string, value: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Save complaint to cloud database
  const saveComplaint = async (id: number | string) => {
    const complaintToSave = complaints.find(c => c.id === id);
    if (!complaintToSave) return;
    
    setSaveStatus({ id, saving: true, message: null });
    try {
      const res = await fetch('/api/complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintToSave)
      });
      if (res.ok) {
        setSaveStatus({ id, saving: false, message: 'Ticket updated successfully!' });
        setTimeout(() => {
          setSaveStatus(prev => prev.id === id ? { ...prev, message: null } : prev);
        }, 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ id, saving: false, message: 'Failed to save changes.' });
    }
  };

  // Normalized Status matcher
  const matchesStatus = (ticketStatus: string | undefined, filter: string) => {
    if (filter === 'All') return true;
    const s = (ticketStatus || '').toLowerCase();
    
    switch (filter) {
      case 'Open':
        return s === 'open' || s === 'pending' || s === 'u/p' || s === 'under observation' || s === '';
      case 'Awaiting Approval':
        return s.includes('approval') || s === 'for approval';
      case 'Awaiting Customer':
        return s.includes('customer') || s.includes('quotation');
      case 'Escalated':
        return s.includes('escalat') || s.includes('repair') || s.includes('urgent');
      case 'Resolved':
        return s.includes('resolved') || s.includes('complete') || s === 'completed';
      case 'Closed':
        return s.includes('closed') || s.includes('invoice');
      default:
        return s === filter.toLowerCase();
    }
  };

  // Quick navigation filter presets
  const handleNavClick = (nav: 'inbox' | 'all' | 'escalated' | 'approval' | 'resolved') => {
    setActiveNav(nav);
    if (nav === 'inbox') {
      setStatusFilter('All');
      setPriorityFilter('All');
    } else if (nav === 'all') {
      setStatusFilter('All');
      setPriorityFilter('All');
      setChannelFilter('All');
    } else if (nav === 'escalated') {
      setPriorityFilter('P1');
      setStatusFilter('All');
    } else if (nav === 'approval') {
      setStatusFilter('Awaiting Approval');
      setPriorityFilter('All');
    } else if (nav === 'resolved') {
      setStatusFilter('Resolved');
      setPriorityFilter('All');
    }
  };

  // Filter complaints based on Search, Status, Priority, Channel
  const filteredComplaints = useMemo(() => {
    return complaints.filter(item => {
      // 1. Status Filter
      if (!matchesStatus(item.status, statusFilter)) return false;

      // 2. Priority Filter
      if (priorityFilter !== 'All') {
        const itemP = item.priority || 'P2';
        if (itemP !== priorityFilter) return false;
      }

      // 3. Channel Filter
      if (channelFilter !== 'All') {
        const itemC = (item.channel || 'Web Portal').toLowerCase();
        if (channelFilter === 'WhatsApp' && !itemC.includes('whatsapp')) return false;
        if (channelFilter === 'Gmail' && !itemC.includes('gmail') && !itemC.includes('email')) return false;
        if (channelFilter === 'Web Portal' && !itemC.includes('portal') && !itemC.includes('web')) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchPool = [
          item.ticketNo,
          item.clientName,
          item.clientEmail,
          item.contactPerson,
          item.contactNumber,
          item.address,
          item.problem,
          item.complaintType,
          item.engineer1,
          item.engineer2,
          item.finding,
          item.actionTaken,
          item.status,
          item.finalStatus,
        ].map(v => v?.toString().toLowerCase() || '').join(' ');

        if (!searchPool.includes(q)) return false;
      }

      return true;
    });
  }, [complaints, statusFilter, priorityFilter, channelFilter, searchQuery]);

  // Selected ticket object
  const selectedTicket = useMemo(() => {
    return complaints.find(c => c.id === selectedTicketId) || (filteredComplaints.length > 0 ? filteredComplaints[0] : null);
  }, [complaints, selectedTicketId, filteredComplaints]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = complaints.length;
    const openCount = complaints.filter(c => matchesStatus(c.status, 'Open')).length;
    const p1Count = complaints.filter(c => (c.priority || 'P2') === 'P1').length;
    const approvalCount = complaints.filter(c => matchesStatus(c.status, 'Awaiting Approval')).length;
    const resolvedCount = complaints.filter(c => matchesStatus(c.status, 'Resolved') || matchesStatus(c.status, 'Closed')).length;
    return { total, openCount, p1Count, approvalCount, resolvedCount };
  }, [complaints]);

  // Priority badge helper
  const getPriorityBadge = (p?: string) => {
    const priority = p || 'P2';
    switch (priority) {
      case 'P1':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-950/80 text-red-400 border border-red-700/50"><Flame className="w-3 h-3" /> P1 Critical</span>;
      case 'P2':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-700/50">P2 High</span>;
      case 'P3':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-sky-950/80 text-sky-400 border border-sky-700/50">P3 Medium</span>;
      case 'P4':
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-normal bg-slate-800 text-slate-400 border border-slate-700">P4 Low</span>;
    }
  };

  // Status badge helper
  const getStatusBadge = (s?: string) => {
    const status = s || 'Open';
    const lower = status.toLowerCase();
    if (lower.includes('complete') || lower.includes('resolved')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-600/40"><CheckCircle2 className="w-3 h-3" /> {status}</span>;
    }
    if (lower.includes('approval')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-600/40"><Clock className="w-3 h-3" /> Awaiting Approval</span>;
    }
    if (lower.includes('customer')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-600/40"><HelpCircle className="w-3 h-3" /> Awaiting Customer</span>;
    }
    if (lower.includes('escalat') || lower.includes('repair')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-600/50"><AlertTriangle className="w-3 h-3" /> Escalated</span>;
    }
    if (lower.includes('closed') || lower.includes('invoice')) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">Closed</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/40"><Clock className="w-3 h-3" /> {status || 'Open'}</span>;
  };

  // Channel helper
  const getChannelBadge = (ch?: string) => {
    const channel = ch || 'Web Portal';
    if (channel.toLowerCase().includes('whatsapp')) {
      return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400"><MessageCircle className="w-3 h-3 text-emerald-500" /> WhatsApp</span>;
    }
    if (channel.toLowerCase().includes('gmail') || channel.toLowerCase().includes('email')) {
      return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400"><Mail className="w-3 h-3 text-red-500" /> Gmail</span>;
    }
    return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400"><Shield className="w-3 h-3 text-cyan-400" /> Portal</span>;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] text-slate-100 font-sans">
      
      {/* ======================================================== */}
      {/* 1. LEFT NAVIGATION SIDEBAR                               */}
      {/* ======================================================== */}
      <aside className="w-64 flex-shrink-0 bg-[#070d1e] border-r border-white/10 flex flex-col justify-between select-none">
        <div>
          {/* Logo & App Title */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <div className="relative flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-slate-900 border border-red-500/30">
              <img 
                src="https://digitechhms.net/static/img/digitech-logo-light.png" 
                alt="Digitech HMS Logo" 
                className="h-7 w-auto object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide text-white">Digitech HMS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">v2.4</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Service Desk Console</p>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">HMS Cloud Live</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">24x7 Active</span>
          </div>

          {/* Navigation Section */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Operations Hub
            </div>

            {/* Primary Inbox Option (Requested by user) */}
            <button
              onClick={() => handleNavClick('inbox')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeNav === 'inbox' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                activeNav === 'inbox' ? 'bg-black/30 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {stats.openCount}
              </span>
            </button>

            {/* All Complaints */}
            <button
              onClick={() => handleNavClick('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeNav === 'all' 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>All Complaints</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{stats.total}</span>
            </button>

            {/* Escalated P1 */}
            <button
              onClick={() => handleNavClick('escalated')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeNav === 'escalated' 
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-600/40' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Escalated (P1)</span>
              </div>
              {stats.p1Count > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[10px] font-bold">
                  {stats.p1Count}
                </span>
              )}
            </button>

            {/* Awaiting Approval */}
            <button
              onClick={() => handleNavClick('approval')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeNav === 'approval' 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Awaiting Approval</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{stats.approvalCount}</span>
            </button>

            {/* Resolved / Closed */}
            <button
              onClick={() => handleNavClick('resolved')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeNav === 'resolved' 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Resolved & Closed</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{stats.resolvedCount}</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* SUPPORT CHANNELS PANEL (WhatsApp & Gmail as requested)   */}
          {/* ======================================================== */}
          <div className="p-3 mx-3 mt-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Support Channels</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </div>

            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/919999760222?text=Hello%20Digitech%20HMS%20Helpdesk%2C%20I%20have%20an%20inquiry%20regarding%20complaints." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/30 text-emerald-300 transition-all group"
              title="Open WhatsApp Helpdesk (9999760222)"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">WhatsApp Hotline</div>
                  <div className="text-[10px] text-emerald-400 font-mono">9999760222</div>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Gmail Link */}
            <a 
              href="mailto:vineet@digitechservices.net?subject=Digitech%20HMS%20Service%20Ticket" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-600/30 text-red-300 transition-all group"
              title="Send Email to vineet@digitechservices.net"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400" />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold text-white leading-tight">Support Email</div>
                  <div className="text-[10px] text-red-300 truncate max-w-[120px]">vineet@digitech...</div>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Client Registration Portal Link */}
            <a 
              href="/support" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-cyan-400" /> Client Portal (/support)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Open</span>
            </a>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-red-950">
              DH
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Digitech Admin Desk</p>
              <p className="text-[10px] text-slate-400 truncate">vineet@digitechservices.net</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE AREA                                   */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 flex-shrink-0 border-b border-white/10 bg-[#070d1e]/90 backdrop-blur-md px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>Complaint Management Inbox</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10 font-mono">
                  {filteredComplaints.length} tickets
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Review client requests, assign engineers, and update ticket progress</p>
            </div>
          </div>

          {/* Search, Views & Refresh Controls */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-64 md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, client, phone, engineer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/80 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle: Inbox Card vs Full Grid */}
            <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-lg">
              <button
                onClick={() => setViewMode('inbox')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === 'inbox' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Modern Inbox / Split Workspace View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inbox View</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === 'table' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Full Grid View (Step 1 & Step 2 Side-by-Side)"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Spreadsheet Grid</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchComplaints(true)}
              disabled={isRefreshing}
              className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Refresh Data from Cloud"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-red-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* 3. MULTI-LEVEL FILTER SYSTEM (Requested by user)          */}
        {/* ======================================================== */}
        <section className="px-6 py-3 border-b border-white/10 bg-[#050b18] flex flex-wrap items-center justify-between gap-3 text-xs select-none">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter 1: Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-red-500" /> Status:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {[
                  'All',
                  'Open',
                  'Awaiting Approval',
                  'Awaiting Customer',
                  'Escalated',
                  'Resolved',
                  'Closed'
                ].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      statusFilter === st 
                        ? 'bg-red-600 text-white font-semibold shadow-sm' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-4 w-px bg-white/10 hidden md:block"></div>

            {/* Filter 2: Priority Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-500" /> Priority:
              </span>
              <div className="flex items-center gap-1">
                {['All', 'P1', 'P2', 'P3', 'P4'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                      priorityFilter === p 
                        ? p === 'P1' ? 'bg-red-600 text-white' :
                          p === 'P2' ? 'bg-amber-600 text-white' :
                          p === 'P3' ? 'bg-sky-600 text-white' :
                          p === 'P4' ? 'bg-slate-700 text-white' :
                          'bg-white/20 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-4 w-px bg-white/10 hidden md:block"></div>

            {/* Filter 3: Channel Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-400" /> Channel:
              </span>
              <div className="flex items-center gap-1">
                {['All', 'WhatsApp', 'Gmail', 'Web Portal'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(ch)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      channelFilter === ch 
                        ? 'bg-emerald-600 text-white font-semibold' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Filters Option if any active */}
          {(statusFilter !== 'All' || priorityFilter !== 'All' || channelFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
                setChannelFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-red-400 hover:text-red-300 underline font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </section>

        {/* ======================================================== */}
        {/* 4. WORKSPACE CONTENT: INBOX SPLIT VIEW OR TABLE VIEW      */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-hidden relative">
          
          {loading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-red-500" />
              <p className="text-sm font-medium">Loading complaints database...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-500">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No complaints found</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                No tickets matched your current filter criteria. Try adjusting the status, priority, or search query.
              </p>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setChannelFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'inbox' ? (
            
            // ========================================================
            // A) MODERN APP INBOX SPLIT-VIEW (Requested by user)     
            // ========================================================
            <div className="h-full flex divide-x divide-white/10 overflow-hidden">
              
              {/* Ticket Cards List (Left Column) */}
              <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col bg-[#050b18] overflow-y-auto divide-y divide-white/5">
                {filteredComplaints.map(item => {
                  const isSelected = selectedTicket?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTicketId(item.id)}
                      className={`p-4 cursor-pointer transition-all border-l-4 ${
                        isSelected 
                          ? 'bg-[#0f172a] border-l-red-500 shadow-inner' 
                          : 'hover:bg-white/[0.03] border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            {item.ticketNo || `TKT-${item.id}`}
                          </span>
                          {getPriorityBadge(item.priority)}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.date || 'Today'}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white truncate mb-1">
                        {item.clientName || 'Unnamed Client'}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-2.5 font-normal leading-relaxed">
                        {item.problem || 'No problem description provided.'}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex items-center gap-2">
                          {getChannelBadge(item.channel)}
                        </div>
                      </div>

                      {/* Assigned Engineer preview if present */}
                      {(item.engineer1 || item.engineer2) && (
                        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-slate-500" />
                          <span>Assigned: <strong className="text-slate-200">{[item.engineer1, item.engineer2].filter(Boolean).join(', ')}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected Ticket Workspace (Right Column) */}
              {selectedTicket ? (
                <div className="flex-1 flex flex-col overflow-y-auto bg-[#020617] p-6 lg:p-8">
                  
                  {/* Top Ticket Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xl font-bold font-mono text-cyan-400">
                          {selectedTicket.ticketNo || `TKT-${selectedTicket.id}`}
                        </span>
                        {getPriorityBadge(selectedTicket.priority)}
                        {getStatusBadge(selectedTicket.status)}
                      </div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {selectedTicket.clientName}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Registered on {selectedTicket.date} &bull; Type: <strong className="text-slate-200">{selectedTicket.complaintType || 'CCTV'}</strong>
                      </p>
                    </div>

                    {/* Quick Communication Actions (WhatsApp & Gmail directly from ticket) */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* WhatsApp to Client */}
                      {selectedTicket.contactNumber && (
                        <a
                          href={`https://wa.me/91${selectedTicket.contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${selectedTicket.clientName}, this is Digitech HMS regarding your service ticket ${selectedTicket.ticketNo} (${selectedTicket.problem}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                          title="Message Client directly on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Client</span>
                        </a>
                      )}

                      {/* Gmail to Client / Cc Admin */}
                      <a
                        href={`mailto:${selectedTicket.clientEmail || 'vineet@digitechservices.net'}?cc=vineet@digitechservices.net&subject=${encodeURIComponent(
                          `Digitech HMS Update: Ticket ${selectedTicket.ticketNo} - ${selectedTicket.clientName}`
                        )}&body=${encodeURIComponent(
                          `Dear ${selectedTicket.clientName},\n\nRegarding your complaint (${selectedTicket.ticketNo}):\nProblem: ${selectedTicket.problem}\nStatus: ${selectedTicket.status}\nAssigned Engineer: ${selectedTicket.engineer1 || 'Assigned shortly'}\n\nThank you,\nDigitech HMS Support Team`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-600/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                        title="Send Email update via Gmail"
                      >
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span>Send Email</span>
                      </a>

                      {/* Big Save Button */}
                      <button
                        onClick={() => saveComplaint(selectedTicket.id)}
                        disabled={saveStatus.saving && saveStatus.id === selectedTicket.id}
                        className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-red-950 disabled:opacity-50"
                      >
                        {saveStatus.saving && saveStatus.id === selectedTicket.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>

                  {/* Save Status Banner Notification */}
                  {saveStatus.message && saveStatus.id === selectedTicket.id && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{saveStatus.message}</span>
                    </div>
                  )}

                  {/* Two Major Step Sections: Step 01 Client Record & Step 02 Engineer Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    
                    {/* ======================================================== */}
                    {/* STEP 01 - CLIENT REGISTRATION DATA (Read-Only)          */}
                    {/* ======================================================== */}
                    <div className="rounded-xl bg-[#090f22] border border-white/10 p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                            01
                          </span>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Client Registration Details
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Step -01-</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">Client / Company Name</label>
                          <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-semibold">
                            {selectedTicket.clientName || 'N/A'}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">Client Email Address</label>
                          <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-200 truncate flex items-center justify-between">
                            <span>{selectedTicket.clientEmail || 'N/A'}</span>
                            {selectedTicket.clientEmail && (
                              <a href={`mailto:${selectedTicket.clientEmail}`} className="text-red-400 hover:text-red-300">
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">Contact Person</label>
                          <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-200">
                            {selectedTicket.contactPerson || 'N/A'}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-400 block mb-1">Contact Number</label>
                          <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-200 font-mono flex items-center justify-between">
                            <span>{selectedTicket.contactNumber || 'N/A'}</span>
                            {selectedTicket.contactNumber && (
                              <a 
                                href={`tel:${selectedTicket.contactNumber}`} 
                                className="text-emerald-400 hover:text-emerald-300"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">Site / Facility Address</label>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-200 text-xs flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{selectedTicket.address || 'N/A'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">Problem / Complaint Description</label>
                        <div className="p-3 rounded-lg bg-black/50 border border-white/10 text-slate-100 text-xs leading-relaxed whitespace-pre-wrap min-h-[90px]">
                          {selectedTicket.problem || 'No description provided.'}
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* STEP 02 - ADMIN & ENGINEER ATTEND STATUS (Editable)     */}
                    {/* ======================================================== */}
                    <div className="rounded-xl bg-[#0a1128] border border-white/10 p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                            02
                          </span>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Engineer Assignment & Action
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">Step -02-</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Priority Selector */}
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Ticket Priority</label>
                          <select
                            value={selectedTicket.priority || 'P2'}
                            onChange={e => updateComplaint(selectedTicket.id, 'priority', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="P1">P1 - Critical (Immediate Dispatch)</option>
                            <option value="P2">P2 - High Priority</option>
                            <option value="P3">P3 - Medium Priority</option>
                            <option value="P4">P4 - Low Priority</option>
                          </select>
                        </div>

                        {/* Status Selector */}
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Ticket Status</label>
                          <select
                            value={selectedTicket.status || 'Open'}
                            onChange={e => updateComplaint(selectedTicket.id, 'status', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="Open">Open</option>
                            <option value="Awaiting Approval">Awaiting Approval</option>
                            <option value="Awaiting Customer">Awaiting Customer</option>
                            <option value="Escalated">Escalated</option>
                            <option value="Under observation">Under observation</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        {/* Assigned Date */}
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Assigned Date</label>
                          <input
                            type="date"
                            value={selectedTicket.assignedDate || ''}
                            onChange={e => updateComplaint(selectedTicket.id, 'assignedDate', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>

                        {/* Final Status */}
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Final Status</label>
                          <select
                            value={selectedTicket.finalStatus || ''}
                            onChange={e => updateComplaint(selectedTicket.id, 'finalStatus', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="">Select Final Status</option>
                            <option value="Complete">Complete</option>
                            <option value="Quotation sent">Quotation sent</option>
                            <option value="Invoice raise">Invoice raise</option>
                          </select>
                        </div>

                        {/* Assigned Engineer 1 */}
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Assigned to Engineer 01</label>
                          <select
                            value={selectedTicket.engineer1 || ''}
                            onChange={e => updateComplaint(selectedTicket.id, 'engineer1', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="">Select Engineer</option>
                            <option>Abdul</option>
                            <option>Sharukh</option>
                            <option>Govind</option>
                            <option>Himanshu</option>
                            <option>Ashish</option>
                            <option>Zubair</option>
                            <option>Other</option>
                          </select>
                        </div>

                        {/* Assigned Engineer 2 */}
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Assigned to Engineer 02</label>
                          <select
                            value={selectedTicket.engineer2 || ''}
                            onChange={e => updateComplaint(selectedTicket.id, 'engineer2', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="">Select Engineer</option>
                            <option>Abdul</option>
                            <option>Sharukh</option>
                            <option>Govind</option>
                            <option>Himanshu</option>
                            <option>Ashish</option>
                            <option>Zubair</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Observations / Findings */}
                      <div>
                        <label className="text-[11px] font-medium text-slate-300 block mb-1">Finding / Observation / Reason</label>
                        <input
                          type="text"
                          placeholder="e.g. Connector loose, power surge on switch, firmware crash..."
                          value={selectedTicket.finding || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'finding', e.target.value)}
                          className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Solution Provided / Action Taken */}
                      <div>
                        <label className="text-[11px] font-medium text-slate-300 block mb-1">Solution Provided / Action Taken</label>
                        <input
                          type="text"
                          placeholder="e.g. Replaced RJ45 connector, patched firmware, aligned camera lens..."
                          value={selectedTicket.actionTaken || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'actionTaken', e.target.value)}
                          className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Material & Remarks Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Used Material</label>
                          <input
                            type="text"
                            placeholder="Material used..."
                            value={selectedTicket.usedMaterial || ''}
                            onChange={e => updateComplaint(selectedTicket.id, 'usedMaterial', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Required Material</label>
                          <input
                            type="text"
                            placeholder="Spare needed..."
                            value={selectedTicket.requiredMaterial || ''}
                            onChange={e => updateComplaint(selectedTicket.id, 'requiredMaterial', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Remarks</label>
                          <select
                            value={selectedTicket.remarks || ''}
                            onChange={e => updateComplaint(selectedTicket.id, 'remarks', e.target.value)}
                            className="w-full bg-[#050b18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="">Select</option>
                            <option>U/W</option>
                            <option>U/AMC</option>
                            <option>Chargeable</option>
                          </select>
                        </div>
                      </div>

                      {/* Explicit Save Action Card */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Click Save to persist changes to the cloud database.
                        </span>
                        <button
                          onClick={() => saveComplaint(selectedTicket.id)}
                          disabled={saveStatus.saving && saveStatus.id === selectedTicket.id}
                          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-950 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

          ) : (

            // ========================================================
            // B) FULL SPREADSHEET GRID VIEW (Redesigned with dark UI)  
            // ========================================================
            <div className="h-full w-full overflow-auto p-4 bg-[#020617]">
              <div className="rounded-xl border border-white/10 overflow-hidden bg-[#070d1e] shadow-2xl">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr>
                      <th colSpan={10} className="bg-amber-950/60 text-amber-300 border-b border-r border-amber-700/40 py-2.5 px-4 text-center font-bold text-xs uppercase tracking-wider">
                        STEP -01- (Call Registration Details)
                      </th>
                      <th colSpan={14} className="bg-emerald-950/60 text-emerald-300 border-b border-emerald-700/40 py-2.5 px-4 text-center font-bold text-xs uppercase tracking-wider">
                        STEP -02- (Call Attend Status & Resolution)
                      </th>
                    </tr>
                    <tr className="bg-black/60 text-slate-300 font-semibold border-b border-white/10">
                      {/* Step 1 Headers */}
                      <th className="py-2.5 px-3 border-r border-white/10 bg-[#070d1e] sticky left-0 z-20">S.No</th>
                      <th className="py-2.5 px-3 border-r border-white/10 bg-[#070d1e] sticky left-[50px] z-20">Date</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Type</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Ticket No</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Priority</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Client Name</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Client Email</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Address</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Contact Person</th>
                      <th className="py-2.5 px-3 border-r border-white/20">Contact Number</th>

                      {/* Step 2 Headers */}
                      <th className="py-2.5 px-3 border-r border-white/10">Assigned Date</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Engineer 01</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Engineer 02</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Problem Reason</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Finding / Observation</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Action Taken</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Used Material</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Required Material</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Remarks</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Status</th>
                      <th className="py-2.5 px-3 border-r border-white/10">Final Status</th>
                      <th className="py-2.5 px-3 sticky right-0 z-20 bg-[#070d1e] text-center">Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredComplaints.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2 px-3 border-r border-white/10 sticky left-0 z-10 bg-[#070d1e] font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 border-r border-white/10 sticky left-[50px] z-10 bg-[#070d1e] font-mono text-slate-300">{item.date}</td>
                        <td className="py-2 px-3 border-r border-white/10 text-slate-300">{item.complaintType}</td>
                        <td className="py-2 px-3 border-r border-white/10 font-mono font-bold text-cyan-400">{item.ticketNo}</td>
                        <td className="py-2 px-3 border-r border-white/10">{getPriorityBadge(item.priority)}</td>
                        <td className="py-2 px-3 border-r border-white/10 font-semibold text-white">{item.clientName}</td>
                        <td className="py-2 px-3 border-r border-white/10 text-slate-300">{item.clientEmail}</td>
                        <td className="py-2 px-3 border-r border-white/10 text-slate-400 truncate max-w-[150px]">{item.address}</td>
                        <td className="py-2 px-3 border-r border-white/10 text-slate-300">{item.contactPerson}</td>
                        <td className="py-2 px-3 border-r border-white/20 font-mono text-slate-300">{item.contactNumber}</td>

                        {/* Step 2 Inputs */}
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <input 
                            type="date" 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white"
                            value={item.assignedDate || ''} 
                            onChange={e => updateComplaint(item.id, 'assignedDate', e.target.value)} 
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <select 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white"
                            value={item.engineer1 || ''} 
                            onChange={e => updateComplaint(item.id, 'engineer1', e.target.value)}
                          >
                            <option value="">Select</option>
                            <option>Abdul</option>
                            <option>Sharukh</option>
                            <option>Govind</option>
                            <option>Himanshu</option>
                            <option>Ashish</option>
                            <option>Zubair</option>
                            <option>Other</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <select 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white"
                            value={item.engineer2 || ''} 
                            onChange={e => updateComplaint(item.id, 'engineer2', e.target.value)}
                          >
                            <option value="">Select</option>
                            <option>Abdul</option>
                            <option>Sharukh</option>
                            <option>Govind</option>
                            <option>Himanshu</option>
                            <option>Ashish</option>
                            <option>Zubair</option>
                            <option>Other</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <input 
                            type="text" 
                            placeholder="Reason..." 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white w-28"
                            value={item.problem || ''} 
                            onChange={e => updateComplaint(item.id, 'problem', e.target.value)} 
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <input 
                            type="text" 
                            placeholder="Finding..." 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white w-28"
                            value={item.finding || ''} 
                            onChange={e => updateComplaint(item.id, 'finding', e.target.value)} 
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <input 
                            type="text" 
                            placeholder="Action..." 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white w-28"
                            value={item.actionTaken || ''} 
                            onChange={e => updateComplaint(item.id, 'actionTaken', e.target.value)} 
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <input 
                            type="text" 
                            placeholder="Used..." 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white w-20"
                            value={item.usedMaterial || ''} 
                            onChange={e => updateComplaint(item.id, 'usedMaterial', e.target.value)} 
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <input 
                            type="text" 
                            placeholder="Req..." 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white w-20"
                            value={item.requiredMaterial || ''} 
                            onChange={e => updateComplaint(item.id, 'requiredMaterial', e.target.value)} 
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <select 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white"
                            value={item.remarks || ''} 
                            onChange={e => updateComplaint(item.id, 'remarks', e.target.value)}
                          >
                            <option value="">Select</option>
                            <option>U/W</option>
                            <option>U/AMC</option>
                            <option>Chargeable</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <select 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white"
                            value={item.status || 'Open'} 
                            onChange={e => updateComplaint(item.id, 'status', e.target.value)}
                          >
                            <option value="Open">Open</option>
                            <option value="Awaiting Approval">Awaiting Approval</option>
                            <option value="Awaiting Customer">Awaiting Customer</option>
                            <option value="Escalated">Escalated</option>
                            <option value="Under observation">Under observation</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-2 border-r border-white/10">
                          <select 
                            className="bg-[#030712] border border-white/15 rounded p-1 text-xs text-white"
                            value={item.finalStatus || ''} 
                            onChange={e => updateComplaint(item.id, 'finalStatus', e.target.value)}
                          >
                            <option value="">Final Status</option>
                            <option>Complete</option>
                            <option>Quotation sent</option>
                            <option>Invoice raise</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-3 sticky right-0 z-10 bg-[#070d1e] text-center">
                          <button 
                            onClick={() => saveComplaint(item.id)} 
                            disabled={saveStatus.saving && saveStatus.id === item.id}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-xs transition-colors shadow disabled:opacity-50"
                          >
                            {saveStatus.saving && saveStatus.id === item.id ? 'Saving...' : 'Save'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
