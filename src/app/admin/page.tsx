'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Inbox, 
  LayoutDashboard, 
  Wrench, 
  LifeBuoy, 
  Plus, 
  X, 
  Check, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  RefreshCw, 
  ExternalLink, 
  ChevronDown,
  Table,
  LayoutGrid,
  BarChart3,
  Users,
  Flame,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity
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

// Bold DIGITECH Logo only (matching user's request: no telemetry, no HMS)
function DigitechLogo() {
  return (
    <div className="flex items-center select-none py-1">
      <span className="text-2xl font-black tracking-tight text-white font-sans">
        DIGITECH<span className="text-[#E53935]">.</span>
      </span>
    </div>
  );
}

export default function AdminPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation & View State: 'inbox' | 'overview' | 'escalated' | 'support_esc'
  const [activeNav, setActiveNav] = useState<string>('inbox');
  const [viewMode, setViewMode] = useState<'inbox' | 'table'>('inbox');
  const [selectedTicketId, setSelectedTicketId] = useState<string | number | null>(null);

  // Filters State matching Image 2
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ id: string | number | null; saving: boolean; message: string | null }>({
    id: null,
    saving: false,
    message: null,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Complaints from Remote Cloud Database (Pure in-app reload without refreshing browser)
  const fetchComplaints = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/complaints', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = data.map((item: ComplaintItem) => ({
          ...item,
          priority: item.priority || (item.problem?.toLowerCase().includes('offline') ? 'P1' : 'P2'),
          channel: item.channel || (item.contactNumber ? 'WhatsApp' : 'Email'),
          status: item.status || 'Open',
        }));
        setComplaints(normalized);
        if (normalized.length > 0 && !selectedTicketId) {
          setSelectedTicketId(normalized[0].id);
        }
        if (isManual) {
          showToast(`Refreshed! ${normalized.length} complaints loaded from database.`);
        }
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
      if (isManual) showToast('Failed to refresh complaints from server.');
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
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
        setSaveStatus({ id, saving: false, message: 'Saved successfully!' });
        showToast('Complaint updated and saved to database!');
        setTimeout(() => {
          setSaveStatus(prev => prev.id === id ? { ...prev, message: null } : prev);
        }, 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ id, saving: false, message: 'Failed to save.' });
      showToast('Error saving changes to database.');
    }
  };

  // Status Matcher
  const matchesStatus = (ticketStatus: string | undefined, filter: string) => {
    if (filter === 'All') return true;
    const s = (ticketStatus || '').toLowerCase();
    
    switch (filter) {
      case 'Open':
        return s === 'open' || s === 'pending' || s === 'u/p' || s === 'under observation' || s === '';
      case 'Awaiting approval':
        return s.includes('approval') || s === 'for approval';
      case 'Awaiting customer':
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
        const itemC = (item.channel || '').toLowerCase();
        if (channelFilter === 'WhatsApp' && !itemC.includes('whatsapp')) return false;
        if (channelFilter === 'Email' && !itemC.includes('email') && !itemC.includes('gmail')) return false;
      }

      // 4. Sidebar Nav Filter Shortcuts
      if (activeNav === 'escalated') {
        if ((item.priority || 'P2') !== 'P1' && !item.status?.toLowerCase().includes('escalat')) return false;
      } else if (activeNav === 'support_esc') {
        if (!item.status?.toLowerCase().includes('approval') && !item.status?.toLowerCase().includes('customer')) return false;
      }

      // 5. Search query
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
  }, [complaints, statusFilter, priorityFilter, channelFilter, activeNav, searchQuery]);

  // Selected Ticket
  const selectedTicket = useMemo(() => {
    return complaints.find(c => c.id === selectedTicketId) || (filteredComplaints.length > 0 ? filteredComplaints[0] : null);
  }, [complaints, selectedTicketId, filteredComplaints]);

  // Overview Statistics
  const stats = useMemo(() => {
    const total = complaints.length;
    const openCount = complaints.filter(c => matchesStatus(c.status, 'Open')).length;
    const p1Count = complaints.filter(c => (c.priority || 'P2') === 'P1').length;
    const approvalCount = complaints.filter(c => matchesStatus(c.status, 'Awaiting approval')).length;
    const resolvedCount = complaints.filter(c => matchesStatus(c.status, 'Resolved') || matchesStatus(c.status, 'Closed')).length;

    // By System Type
    const typeCounts: Record<string, number> = {};
    complaints.forEach(c => {
      const t = c.complaintType || 'CCTV';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    // By Engineer
    const engineerCounts: Record<string, number> = {};
    complaints.forEach(c => {
      if (c.engineer1) engineerCounts[c.engineer1] = (engineerCounts[c.engineer1] || 0) + 1;
      if (c.engineer2) engineerCounts[c.engineer2] = (engineerCounts[c.engineer2] || 0) + 1;
    });

    return { total, openCount, p1Count, approvalCount, resolvedCount, typeCounts, engineerCounts };
  }, [complaints]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'All') count++;
    if (priorityFilter !== 'All') count++;
    if (channelFilter !== 'All') count++;
    return count;
  }, [statusFilter, priorityFilter, channelFilter]);

  // Status visual dot & label helper
  const renderStatusDot = (statusText?: string) => {
    const s = (statusText || 'Open').toLowerCase();
    let dotColor = 'bg-blue-500';
    let label = statusText || 'Open';

    if (s.includes('complete') || s.includes('resolved')) {
      dotColor = 'bg-emerald-500';
      label = 'Resolved';
    } else if (s.includes('approval')) {
      dotColor = 'bg-amber-500';
      label = 'Awaiting approval';
    } else if (s.includes('customer')) {
      dotColor = 'bg-red-500';
      label = 'Awaiting customer';
    } else if (s.includes('escalat')) {
      dotColor = 'bg-rose-600';
      label = 'Escalated';
    } else if (s.includes('closed') || s.includes('invoice')) {
      dotColor = 'bg-gray-400';
      label = 'Closed';
    } else {
      dotColor = 'bg-blue-500';
      label = 'Open';
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-medium">
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
        <span>{label}</span>
      </span>
    );
  };

  // Priority badge helper
  const renderPriorityBadge = (p?: string) => {
    const priority = p || 'P2';
    switch (priority) {
      case 'P1':
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-bold text-red-600 bg-red-50 border border-red-200">P1</span>;
      case 'P2':
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200">P2</span>;
      case 'P3':
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200">P3</span>;
      case 'P4':
      default:
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-medium text-gray-600 bg-gray-100 border border-gray-200">P4</span>;
    }
  };

  // Channel badge helper (Email or WhatsApp with icons)
  const renderChannelBadge = (ch?: string) => {
    const channel = ch || 'WhatsApp';
    if (channel.toLowerCase().includes('whatsapp')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-medium">
          <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>WhatsApp</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-medium">
        <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
        </svg>
        <span>Email</span>
      </span>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-800 font-sans">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#160826] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-red-500/40 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR: Deep Plum Theme (Matching Image 1)       */}
      {/* ======================================================== */}
      <aside className="w-60 flex-shrink-0 bg-[#160826] text-white flex flex-col justify-between select-none border-r border-[#2d124d]">
        <div className="p-4 space-y-4">
          
          {/* Logo with Name: Bold DIGITECH only as requested */}
          <div className="pt-1 pb-2 border-b border-white/10">
            <DigitechLogo />
          </div>

          {/* Org Selector / Subtitle */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
            <span className="font-medium truncate">Digitech Operations</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* "+ Compose" Button (Matching Image 1 in Crimson) */}
          <a
            href="/support"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#be123c] hover:to-[#9f1239] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Compose</span>
          </a>

          {/* Navigation Menu (Matching Image 1 options) */}
          <nav className="space-y-0.5 pt-2 text-xs">
            {/* Overview Option (Now fully working!) */}
            <button
              onClick={() => {
                setActiveNav('overview');
                setViewMode('inbox');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                activeNav === 'overview' ? 'bg-[#be123c] text-white font-bold shadow' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-gray-300" />
              <span>Overview</span>
            </button>

            {/* Inbox with Badge */}
            <button
              onClick={() => {
                setActiveNav('inbox');
                setStatusFilter('All');
                setPriorityFilter('All');
                setChannelFilter('All');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                activeNav === 'inbox' ? 'bg-[#2a0e4a] text-white font-bold border-l-4 border-l-rose-500' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4 text-rose-400" />
                <span>Inbox</span>
              </div>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#be123c] text-white">
                {complaints.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('escalated');
                setPriorityFilter('P1');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                activeNav === 'escalated' ? 'bg-white/15 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4 text-rose-400" />
              <span>Tech Escalations</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('support_esc');
                setStatusFilter('Awaiting approval');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                activeNav === 'support_esc' ? 'bg-white/15 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LifeBuoy className="w-4 h-4 text-amber-400" />
              <span>Support Escalations</span>
            </button>

            <a
              href="/support"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <span>Client Portal</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer: Channels Details (9999760222 & vineet@digitechservices.net) */}
        <div className="p-3 m-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Connected Channels
          </div>
          <a
            href="https://wa.me/919999760222"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-[11px]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono">WhatsApp: 9999760222</span>
          </a>
          <a
            href="mailto:vineet@digitechservices.net"
            className="flex items-center gap-2 text-rose-300 hover:text-rose-200 text-[11px] truncate"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="truncate">vineet@digitechservices.net</span>
          </a>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. OVERVIEW DASHBOARD VIEW (When activeNav === 'overview') */}
      {/* ======================================================== */}
      {activeNav === 'overview' ? (
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-y-auto">
          {/* Overview Top Header */}
          <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Operations Overview</h1>
              <p className="text-xs text-gray-500">Live complaint telemetry, resolution metrics, and dispatch workload</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Pure in-app reload button */}
              <button
                onClick={() => fetchComplaints(true)}
                disabled={isRefreshing}
                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-2 shadow-sm transition-all"
                title="Reload Complaints Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
                <span>Reload Data</span>
              </button>
              <button
                onClick={() => setActiveNav('inbox')}
                className="px-4 py-2 rounded-xl bg-[#be123c] hover:bg-[#9f1239] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Open Inbox ({complaints.length})</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-w-7xl">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Complaints</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900">{stats.total}</div>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">All registered tickets</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active / Open</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600">{stats.openCount}</div>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Awaiting action/engineer</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Critical (P1)</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600">{stats.p1Count}</div>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Immediate dispatch required</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600">{stats.resolvedCount}</div>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Completed & closed tickets</p>
              </div>
            </div>

            {/* Middle Section: Systems Breakdown & Engineer Workload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complaints by System */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-600" />
                  <span>Complaints by System Type</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.typeCounts).map(([type, count]) => {
                    const pct = Math.round((count / (stats.total || 1)) * 100);
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-gray-700">{type}</span>
                          <span className="text-gray-500 font-mono">{count} tickets ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full bg-rose-600 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engineer Workload */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Engineer Assignment Distribution</span>
                </h3>
                <div className="space-y-2.5">
                  {['Abdul', 'Sharukh', 'Govind', 'Himanshu', 'Ashish', 'Zubair'].map(eng => {
                    const count = stats.engineerCounts[eng] || 0;
                    return (
                      <div key={eng} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                        <span className="font-semibold text-gray-800">{eng}</span>
                        <span className="px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-blue-100 text-blue-700">
                          {count} assigned
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Tickets Table in Overview */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Recent Complaint Activity</span>
                </h3>
                <button
                  onClick={() => setActiveNav('inbox')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <span>View All in Inbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Ticket #</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Client</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Priority</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {complaints.slice(0, 5).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2.5 font-mono font-bold text-blue-600">{item.ticketNo}</td>
                        <td className="py-2.5 text-gray-500">{item.date}</td>
                        <td className="py-2.5 font-semibold text-gray-800">{item.clientName}</td>
                        <td className="py-2.5 text-gray-600">{item.complaintType}</td>
                        <td className="py-2.5">{renderPriorityBadge(item.priority)}</td>
                        <td className="py-2.5">{renderStatusDot(item.status)}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedTicketId(item.id);
                              setActiveNav('inbox');
                            }}
                            className="text-xs font-bold text-rose-600 hover:underline"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'table' ? (

        // ========================================================
        // 3. FULL-WIDTH SPREADSHEET GRID VIEW (Fixed & Clean!)    
        // ========================================================
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
          
          {/* Top Bar for Table View */}
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-gray-900">Complaints Full Data Grid</h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-gray-100 text-gray-700">
                {filteredComplaints.length} records
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Pure in-app reload button */}
              <button
                onClick={() => fetchComplaints(true)}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 flex items-center gap-1.5 shadow-sm"
                title="Reload Complaints Data without refreshing page"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
                <span>Reload</span>
              </button>

              {/* Switch back to Inbox View */}
              <button
                onClick={() => setViewMode('inbox')}
                className="px-3 py-1.5 rounded-lg bg-[#be123c] text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Switch to Inbox View</span>
              </button>
            </div>
          </div>

          {/* Full-width Responsive Table */}
          <div className="flex-1 overflow-auto p-4">
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th colSpan={10} className="bg-amber-100 text-amber-900 border-b border-r border-amber-200 py-2.5 px-4 text-center font-bold text-xs uppercase tracking-wider">
                      STEP -01- (Client Call Registration Details)
                    </th>
                    <th colSpan={13} className="bg-emerald-100 text-emerald-900 border-b border-emerald-200 py-2.5 px-4 text-center font-bold text-xs uppercase tracking-wider">
                      STEP -02- (Engineer Assignment & Resolution Status)
                    </th>
                  </tr>
                  <tr className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <th className="py-2.5 px-3 border-r">S.No</th>
                    <th className="py-2.5 px-3 border-r">Date</th>
                    <th className="py-2.5 px-3 border-r">Ticket No</th>
                    <th className="py-2.5 px-3 border-r">Priority</th>
                    <th className="py-2.5 px-3 border-r">Client Name</th>
                    <th className="py-2.5 px-3 border-r">Email</th>
                    <th className="py-2.5 px-3 border-r">Contact Person</th>
                    <th className="py-2.5 px-3 border-r">Phone</th>
                    <th className="py-2.5 px-3 border-r">Type</th>
                    <th className="py-2.5 px-3 border-r">Problem</th>
                    <th className="py-2.5 px-3 border-r">Assigned Date</th>
                    <th className="py-2.5 px-3 border-r">Engineer 01</th>
                    <th className="py-2.5 px-3 border-r">Engineer 02</th>
                    <th className="py-2.5 px-3 border-r">Finding</th>
                    <th className="py-2.5 px-3 border-r">Action Taken</th>
                    <th className="py-2.5 px-3 border-r">Remarks</th>
                    <th className="py-2.5 px-3 border-r">Status</th>
                    <th className="py-2.5 px-3 border-r">Final Status</th>
                    <th className="py-2.5 px-3 text-center bg-gray-50 sticky right-0">Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredComplaints.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3 border-r text-gray-500">{idx + 1}</td>
                      <td className="py-2 px-3 border-r text-gray-700 font-mono">{item.date}</td>
                      <td className="py-2 px-3 border-r font-mono font-bold text-blue-600">{item.ticketNo}</td>
                      <td className="py-2 px-3 border-r">{renderPriorityBadge(item.priority)}</td>
                      <td className="py-2 px-3 border-r font-semibold text-gray-900">{item.clientName}</td>
                      <td className="py-2 px-3 border-r text-gray-600">{item.clientEmail}</td>
                      <td className="py-2 px-3 border-r text-gray-800">{item.contactPerson}</td>
                      <td className="py-2 px-3 border-r font-mono text-gray-800">{item.contactNumber}</td>
                      <td className="py-2 px-3 border-r text-gray-700">{item.complaintType}</td>
                      <td className="py-2 px-3 border-r text-gray-600 max-w-xs truncate">{item.problem}</td>

                      <td className="py-1 px-2 border-r">
                        <input 
                          type="date" 
                          className="border border-gray-300 rounded p-1 text-xs text-black" 
                          value={item.assignedDate || ''} 
                          onChange={e => updateComplaint(item.id, 'assignedDate', e.target.value)} 
                        />
                      </td>
                      <td className="py-1 px-2 border-r">
                        <select 
                          className="border border-gray-300 rounded p-1 text-xs text-black bg-white" 
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
                      <td className="py-1 px-2 border-r">
                        <select 
                          className="border border-gray-300 rounded p-1 text-xs text-black bg-white" 
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
                      <td className="py-1 px-2 border-r">
                        <input 
                          type="text" 
                          placeholder="Findings..." 
                          className="border border-gray-300 rounded p-1 text-xs text-black w-28" 
                          value={item.finding || ''} 
                          onChange={e => updateComplaint(item.id, 'finding', e.target.value)} 
                        />
                      </td>
                      <td className="py-1 px-2 border-r">
                        <input 
                          type="text" 
                          placeholder="Action taken..." 
                          className="border border-gray-300 rounded p-1 text-xs text-black w-28" 
                          value={item.actionTaken || ''} 
                          onChange={e => updateComplaint(item.id, 'actionTaken', e.target.value)} 
                        />
                      </td>
                      <td className="py-1 px-2 border-r">
                        <select 
                          className="border border-gray-300 rounded p-1 text-xs text-black bg-white" 
                          value={item.remarks || ''} 
                          onChange={e => updateComplaint(item.id, 'remarks', e.target.value)}
                        >
                          <option value="">Select</option>
                          <option>U/W</option>
                          <option>U/AMC</option>
                          <option>Chargeable</option>
                        </select>
                      </td>
                      <td className="py-1 px-2 border-r">
                        <select 
                          className="border border-gray-300 rounded p-1 text-xs text-black bg-white" 
                          value={item.status || 'Open'} 
                          onChange={e => updateComplaint(item.id, 'status', e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="Awaiting approval">Awaiting approval</option>
                          <option value="Awaiting customer">Awaiting customer</option>
                          <option value="Escalated">Escalated</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-1 px-2 border-r">
                        <select 
                          className="border border-gray-300 rounded p-1 text-xs text-black bg-white" 
                          value={item.finalStatus || ''} 
                          onChange={e => updateComplaint(item.id, 'finalStatus', e.target.value)}
                        >
                          <option value="">Final Status</option>
                          <option>Complete</option>
                          <option>Quotation sent</option>
                          <option>Invoice raise</option>
                        </select>
                      </td>
                      <td className="py-1 px-3 text-center bg-white sticky right-0">
                        <button 
                          onClick={() => saveComplaint(item.id)} 
                          disabled={saveStatus.saving && saveStatus.id === item.id}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors shadow-sm disabled:opacity-50"
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
        </div>

      ) : (

        // ========================================================
        // 4. INBOX FEED + WORKSPACE VIEW (Matching Reference)      
        // ========================================================
        <div className="flex-1 flex overflow-hidden">
          
          {/* Middle Column: Inbox Feed */}
          <div className="w-[340px] lg:w-[380px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white">
            
            {/* Header: Title, Count, Filter Button, View Toggle, Reload */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Inbox</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#be123c] text-white">
                  {filteredComplaints.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Pure in-app reload button */}
                <button
                  onClick={() => fetchComplaints(true)}
                  disabled={isRefreshing}
                  className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Reload Complaints Data without refreshing page"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
                </button>

                {/* View Mode Toggle: Card vs Full Grid */}
                <button
                  onClick={() => setViewMode(viewMode === 'inbox' ? 'table' : 'inbox')}
                  className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Toggle Full Grid View"
                >
                  {viewMode === 'inbox' ? <Table className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                </button>

                {/* FILTER BUTTON WITH FUNNEL ICON (Matching Image 1) */}
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className={`p-1.5 rounded-lg transition-all relative ${
                    activeFiltersCount > 0 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Open Filters"
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search Conversations Input */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Channel Dropdown Filter */}
            <div className="px-4 pb-3">
              <div className="relative">
                <select
                  value={channelFilter}
                  onChange={e => setChannelFilter(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-rose-500 pr-8 cursor-pointer"
                >
                  <option value="All">Channel: All channels</option>
                  <option value="Email">Channel: Email (Gmail)</option>
                  <option value="WhatsApp">Channel: WhatsApp</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active Filter Tags Indicator */}
            {(statusFilter !== 'All' || priorityFilter !== 'All' || channelFilter !== 'All') && (
              <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-gray-500 font-medium">Filters:</span>
                  <span className="font-semibold text-rose-600 truncate">
                    {[statusFilter !== 'All' && statusFilter, priorityFilter !== 'All' && priorityFilter, channelFilter !== 'All' && channelFilter].filter(Boolean).join(' • ')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setStatusFilter('All');
                    setPriorityFilter('All');
                    setChannelFilter('All');
                  }}
                  className="text-gray-400 hover:text-rose-600 text-[11px] font-bold underline"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-rose-500" />
                  <span>Loading conversations...</span>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="font-medium text-gray-600">No conversations found</p>
                  <p className="text-[11px] text-gray-400 mt-1">Try resetting the status or channel filter.</p>
                </div>
              ) : (
                filteredComplaints.map(item => {
                  const isSelected = selectedTicket?.id === item.id;
                  const isUnresolved = !item.status?.toLowerCase().includes('complete') && !item.status?.toLowerCase().includes('closed');

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTicketId(item.id)}
                      className={`p-3.5 cursor-pointer transition-all ${
                        isSelected ? 'bg-slate-50 border-l-4 border-l-[#be123c]' : 'hover:bg-gray-50/80 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          {isUnresolved && (
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block flex-shrink-0"></span>
                          )}
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {item.clientName || 'Demo Client'}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono flex-shrink-0">
                          {item.date || 'Today'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-2 font-normal leading-relaxed">
                        {item.problem || 'No description provided.'}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-2">
                          {renderPriorityBadge(item.priority)}
                          {renderChannelBadge(item.channel)}
                        </div>
                        {renderStatusDot(item.status)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Ticket Workspace */}
          <div className="flex-1 flex flex-col bg-[#fcfcfd] overflow-hidden">
            {!selectedTicket ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4 border border-gray-200">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-800 mb-1">Select a conversation</h2>
                <p className="text-xs text-gray-500">Choose from the queue to begin</p>
              </div>
            ) : (
              <div className="h-full flex flex-col overflow-y-auto">
                
                {/* Top Workspace Bar */}
                <div className="p-6 border-b border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                        {selectedTicket.ticketNo || `TKT-${selectedTicket.id}`}
                      </span>
                      {renderPriorityBadge(selectedTicket.priority)}
                      {renderStatusDot(selectedTicket.status)}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedTicket.clientName}</h2>
                    <p className="text-xs text-gray-500">
                      Registered on {selectedTicket.date} &bull; Type: <span className="font-medium text-gray-800">{selectedTicket.complaintType || 'CCTV'}</span>
                    </p>
                  </div>

                  {/* Actions: WhatsApp, Email, Save */}
                  <div className="flex items-center gap-2">
                    {selectedTicket.contactNumber && (
                      <a
                        href={`https://wa.me/91${selectedTicket.contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${selectedTicket.clientName}, this is Digitech HMS regarding your complaint ${selectedTicket.ticketNo} (${selectedTicket.problem}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${selectedTicket.clientEmail || 'vineet@digitechservices.net'}?cc=vineet@digitechservices.net&subject=Digitech%20HMS%20Update%20Ticket%20${selectedTicket.ticketNo}`}
                      className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span>Email</span>
                    </a>

                    <button
                      onClick={() => saveComplaint(selectedTicket.id)}
                      disabled={saveStatus.saving && saveStatus.id === selectedTicket.id}
                      className="px-4 py-1.5 rounded-lg bg-[#be123c] hover:bg-[#9f1239] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Form Panels: Step 1 (Client Record) & Step 2 (Engineer Resolution) */}
                <div className="p-6 space-y-6">
                  
                  {/* Step 1: Client Information */}
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                          1
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          Client Call Registration Details
                        </h3>
                      </div>
                      <span className="text-[11px] text-gray-400">Step -01-</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="text-gray-500 block mb-1">Client Name</label>
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 font-semibold">
                          {selectedTicket.clientName || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-500 block mb-1">Email Address</label>
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 truncate">
                          {selectedTicket.clientEmail || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-500 block mb-1">Contact Person</label>
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
                          {selectedTicket.contactPerson || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-500 block mb-1">Contact Phone</label>
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-mono">
                          {selectedTicket.contactNumber || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="md:col-span-1">
                        <label className="text-gray-500 block mb-1">Site Address</label>
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{selectedTicket.address || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-gray-500 block mb-1">Problem / Complaint</label>
                        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed min-h-[60px]">
                          {selectedTicket.problem || 'No description provided.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Engineer Assignment & Action */}
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          2
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          Engineer Assignment & Attend Status
                        </h3>
                      </div>
                      <span className="text-[11px] text-gray-400">Step -02-</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Priority</label>
                        <select
                          value={selectedTicket.priority || 'P2'}
                          onChange={e => updateComplaint(selectedTicket.id, 'priority', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="P1">P1 - Critical</option>
                          <option value="P2">P2 - High</option>
                          <option value="P3">P3 - Medium</option>
                          <option value="P4">P4 - Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Status</label>
                        <select
                          value={selectedTicket.status || 'Open'}
                          onChange={e => updateComplaint(selectedTicket.id, 'status', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="Open">Open</option>
                          <option value="Awaiting approval">Awaiting approval</option>
                          <option value="Awaiting customer">Awaiting customer</option>
                          <option value="Escalated">Escalated</option>
                          <option value="Under observation">Under observation</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Assigned Date</label>
                        <input
                          type="date"
                          value={selectedTicket.assignedDate || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'assignedDate', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Final Status</label>
                        <select
                          value={selectedTicket.finalStatus || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'finalStatus', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="">Select Final Status</option>
                          <option value="Complete">Complete</option>
                          <option value="Quotation sent">Quotation sent</option>
                          <option value="Invoice raise">Invoice raise</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Engineer 01</label>
                        <select
                          value={selectedTicket.engineer1 || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'engineer1', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
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

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Engineer 02</label>
                        <select
                          value={selectedTicket.engineer2 || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'engineer2', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
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

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Remarks</label>
                        <select
                          value={selectedTicket.remarks || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'remarks', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="">Select</option>
                          <option>U/W</option>
                          <option>U/AMC</option>
                          <option>Chargeable</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Rectification Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Hardware replacement"
                          value={selectedTicket.rectificationType || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'rectificationType', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Finding / Observation / Reason</label>
                        <input
                          type="text"
                          placeholder="Findings..."
                          value={selectedTicket.finding || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'finding', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Solution Provided / Action Taken</label>
                        <input
                          type="text"
                          placeholder="Actions taken..."
                          value={selectedTicket.actionTaken || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'actionTaken', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Used Material</label>
                        <input
                          type="text"
                          placeholder="Material used during servicing..."
                          value={selectedTicket.usedMaterial || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'usedMaterial', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Required Material</label>
                        <input
                          type="text"
                          placeholder="Spare parts required for next visit..."
                          value={selectedTicket.requiredMaterial || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'requiredMaterial', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => saveComplaint(selectedTicket.id)}
                        disabled={saveStatus.saving && saveStatus.id === selectedTicket.id}
                        className="px-6 py-2 rounded-lg bg-[#be123c] hover:bg-[#9f1239] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. FILTERS MODAL (Matching Image 2 uploaded by user)     */}
      {/* ======================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Filters</h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* SECTION 1: STATUS (Matching Image 2 with colored dots) */}
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  STATUS
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {/* All */}
                  <button
                    onClick={() => setStatusFilter('All')}
                    className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                      statusFilter === 'All'
                        ? 'bg-rose-50 text-rose-600 border border-rose-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    All
                  </button>

                  {/* Open (Blue dot) */}
                  <button
                    onClick={() => setStatusFilter('Open')}
                    className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      statusFilter === 'Open'
                        ? 'bg-blue-50 text-blue-700 border border-blue-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Open</span>
                  </button>

                  {/* Awaiting approval (Orange dot) */}
                  <button
                    onClick={() => setStatusFilter('Awaiting approval')}
                    className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      statusFilter === 'Awaiting approval'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Awaiting approval</span>
                  </button>

                  {/* Awaiting customer (Red dot) */}
                  <button
                    onClick={() => setStatusFilter('Awaiting customer')}
                    className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      statusFilter === 'Awaiting customer'
                        ? 'bg-red-50 text-red-700 border border-red-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Awaiting customer</span>
                  </button>

                  {/* Escalated (Crimson dot) */}
                  <button
                    onClick={() => setStatusFilter('Escalated')}
                    className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      statusFilter === 'Escalated'
                        ? 'bg-rose-50 text-rose-700 border border-rose-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    <span>Escalated</span>
                  </button>

                  {/* Resolved (Green dot) */}
                  <button
                    onClick={() => setStatusFilter('Resolved')}
                    className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      statusFilter === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Resolved</span>
                  </button>

                  {/* Closed (Gray dot) */}
                  <button
                    onClick={() => setStatusFilter('Closed')}
                    className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      statusFilter === 'Closed'
                        ? 'bg-gray-100 text-gray-800 border border-gray-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    <span>Closed</span>
                  </button>
                </div>
              </div>

              {/* SECTION 2: PRIORITY (Matching Image 2 with colored dots) */}
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  PRIORITY
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setPriorityFilter('All')}
                    className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                      priorityFilter === 'All'
                        ? 'bg-rose-50 text-rose-600 border border-rose-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    All
                  </button>

                  <button
                    onClick={() => setPriorityFilter('P1')}
                    className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      priorityFilter === 'P1'
                        ? 'bg-red-50 text-red-700 border border-red-300 font-bold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span>P1</span>
                  </button>

                  <button
                    onClick={() => setPriorityFilter('P2')}
                    className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      priorityFilter === 'P2'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300 font-bold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>P2</span>
                  </button>

                  <button
                    onClick={() => setPriorityFilter('P3')}
                    className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      priorityFilter === 'P3'
                        ? 'bg-blue-50 text-blue-700 border border-blue-300 font-bold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>P3</span>
                  </button>

                  <button
                    onClick={() => setPriorityFilter('P4')}
                    className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      priorityFilter === 'P4'
                        ? 'bg-gray-100 text-gray-800 border border-gray-300 font-medium'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    <span>P4</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: CHANNEL (Only Email and WhatsApp as requested!) */}
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  CHANNEL
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setChannelFilter('All')}
                    className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                      channelFilter === 'All'
                        ? 'bg-rose-50 text-rose-600 border border-rose-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    All
                  </button>

                  {/* Email with Gmail icon */}
                  <button
                    onClick={() => setChannelFilter('Email')}
                    className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      channelFilter === 'Email'
                        ? 'bg-red-50 text-red-700 border border-red-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                    </svg>
                    <span>Email</span>
                  </button>

                  {/* WhatsApp with icon */}
                  <button
                    onClick={() => setChannelFilter('WhatsApp')}
                    className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      channelFilter === 'WhatsApp'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setChannelFilter('All');
                }}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#be123c] hover:bg-[#9f1239] text-white text-xs font-bold shadow-md shadow-rose-900/20 transition-all"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
