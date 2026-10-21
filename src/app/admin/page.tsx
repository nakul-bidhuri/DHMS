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
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  RefreshCw, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  Activity,
  ShieldAlert,
  Table, 
  LayoutGrid, 
  Layers,
  Boxes,
  ArrowRightLeft,
  UserX,
  AlertOctagon,
  RotateCw,
  Sparkles,
  Send,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import ToolsInventoryView, { ROSTER_ENGINEERS, ENGINEER_PHONE } from '@/components/ToolsInventoryView';

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
  engineer1Status?: 'assigned' | 'quitted' | 'completed';
  engineer1QuitReason?: string;
  engineer2?: string;
  engineer2Status?: 'assigned' | 'quitted' | 'completed';
  engineer2QuitReason?: string;
  adminEscalated?: boolean;
  escalationNotes?: string;
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
  [key: string]: string | number | boolean | undefined;
}

// Digitech Logo Component using official logo.png from website
function DigitechLogo() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center select-none py-1">
      {!imgError ? (
        <img 
          src="/digitech-logo.png" 
          alt="Digitech" 
          onError={() => setImgError(true)}
          className="h-8 w-auto max-w-[170px] object-contain"
        />
      ) : (
        <span className="text-2xl font-black tracking-tight text-white font-sans">
          DIGITECH<span className="text-[#E53935]">.</span>
        </span>
      )}
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
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pure in-app reload without refreshing browser
  const fetchComplaints = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/complaints?_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = data.map((item: ComplaintItem) => ({
          ...item,
          priority: item.priority || (item.problem?.toLowerCase().includes('offline') ? 'P1' : 'P2'),
          channel: item.channel || (item.contactNumber ? 'WhatsApp' : 'Email'),
          status: item.status || 'Open',
        }));
        setComplaints(normalized);
        if (normalized.length > 0) {
          setSelectedTicketId(prev => (prev && normalized.some(n => n.id === prev)) ? prev : normalized[0].id);
        }
        if (isManual) {
          showToast(`Refreshed! ${normalized.length} complaints loaded.`);
        }
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
      if (isManual) showToast('Failed to reload complaints from server.');
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
        showToast('Complaint updated & saved to database!');
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

  // 2-Tier Automated Quit & Round-Robin Escalation State
  const [quitModalEng1, setQuitModalEng1] = useState<{ isOpen: boolean; ticket: ComplaintItem | null; reason: string }>({
    isOpen: false,
    ticket: null,
    reason: ''
  });

  const [quitModalEng2, setQuitModalEng2] = useState<{ isOpen: boolean; ticket: ComplaintItem | null; reason: string }>({
    isOpen: false,
    ticket: null,
    reason: ''
  });

  // Calculate Next Engineer via Round-Robin from ROSTER_ENGINEERS
  const getNextRoundRobinEngineer = (currentEngineer: string): string => {
    const idx = ROSTER_ENGINEERS.indexOf(currentEngineer as any);
    if (idx === -1) return ROSTER_ENGINEERS[0];
    return ROSTER_ENGINEERS[(idx + 1) % ROSTER_ENGINEERS.length];
  };

  // Generate WhatsApp Dispatch URL to universal engineer number: 8920458516
  const getEngineerWhatsAppUrl = (
    engineerName: string, 
    ticket: ComplaintItem, 
    actionType: 'NEW' | 'HANDOVER' | 'ADMIN'
  ) => {
    let title = '🚨 *DIGITECH HMS: SERVICE TASK ASSIGNMENT*';
    if (actionType === 'HANDOVER') title = '🔄 *DIGITECH HMS: RE-ASSIGNED DISPATCH (ROUND-ROBIN)*';
    if (actionType === 'ADMIN') title = '⚠️ *DIGITECH HMS: ADMIN ESCALATION ALERT (CRITICAL P1)*';

    const msg = [
      title,
      '------------------------------------',
      `👨‍🔧 *Engineer:* ${engineerName}`,
      `📱 *Universal Dispatch:* +91 ${ENGINEER_PHONE}`,
      `🎫 *Ticket No:* ${ticket.ticketNo || `TKT-${ticket.id}`}`,
      `⚡ *Priority:* ${ticket.priority || 'P2'}`,
      `🏢 *Client:* ${ticket.clientName || 'N/A'}`,
      `📍 *Site Address:* ${ticket.address || 'N/A'}`,
      `👤 *Contact:* ${ticket.contactPerson || 'N/A'} (${ticket.contactNumber || 'N/A'})`,
      `⚠️ *Reported Problem:* ${ticket.problem || 'N/A'}`,
      ticket.engineer1QuitReason ? `\n📝 *Prev Engineer (${ticket.engineer1}) Quit Reason:*\n${ticket.engineer1QuitReason}` : '',
      ticket.engineer2QuitReason ? `\n⚠️ *Engineer 2 (${ticket.engineer2}) Quit Reason:*\n${ticket.engineer2QuitReason}` : '',
      '------------------------------------',
      'Please confirm receipt and update field attendance upon arrival.'
    ].filter(Boolean).join('\n');

    return `https://wa.me/91${ENGINEER_PHONE}?text=${encodeURIComponent(msg)}`;
  };

  // Step 1: Engineer 1 Quits -> System automatically assigns Engineer 2 via Round-Robin
  const handleEngineer1Quit = async () => {
    const ticket = quitModalEng1.ticket;
    if (!ticket) return;

    const currentEng1 = ticket.engineer1 || 'Abdul';
    const nextEng2 = getNextRoundRobinEngineer(currentEng1);
    const reason = quitModalEng1.reason.trim() || 'Engineer unable to resolve issue on site.';

    const updatedTicket: ComplaintItem = {
      ...ticket,
      engineer1Status: 'quitted',
      engineer1QuitReason: reason,
      engineer2: nextEng2,
      engineer2Status: 'assigned',
      remarks: ticket.remarks ? `${ticket.remarks} | Eng 1 (${currentEng1}) quit: ${reason}` : `Eng 1 (${currentEng1}) quit: ${reason}`
    };

    setComplaints(prev => prev.map(c => c.id === ticket.id ? updatedTicket : c));
    setQuitModalEng1({ isOpen: false, ticket: null, reason: '' });

    try {
      await fetch('/api/complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTicket)
      });
      showToast(`Engineer 1 quit recorded. Auto assigned to ${nextEng2} via Round-Robin!`);
    } catch (e) {
      console.error(e);
      showToast('Error saving handover to server.');
    }
  };

  // Step 2: Engineer 2 Quits -> Automatically escalate to Admin with P1 Critical Priority
  const handleEngineer2Quit = async () => {
    const ticket = quitModalEng2.ticket;
    if (!ticket) return;

    const currentEng2 = ticket.engineer2 || 'Sharukh';
    const reason = quitModalEng2.reason.trim() || 'Second engineer unable to resolve. Technical blocker encountered.';

    const updatedTicket: ComplaintItem = {
      ...ticket,
      engineer2Status: 'quitted',
      engineer2QuitReason: reason,
      adminEscalated: true,
      status: 'Escalated',
      priority: 'P1',
      remarks: ticket.remarks ? `${ticket.remarks} | Eng 2 (${currentEng2}) quit: ${reason} [ESCALATED TO ADMIN]` : `Eng 2 (${currentEng2}) quit: ${reason} [ESCALATED TO ADMIN]`
    };

    setComplaints(prev => prev.map(c => c.id === ticket.id ? updatedTicket : c));
    setQuitModalEng2({ isOpen: false, ticket: null, reason: '' });

    try {
      await fetch('/api/complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTicket)
      });
      showToast(`⚠️ Task Escalated to Admin! Priority raised to P1.`);
    } catch (e) {
      console.error(e);
      showToast('Error saving escalation to server.');
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

  // Overview Statistics (For Dashboard & Needs Attention Action Center)
  const stats = useMemo(() => {
    const total = complaints.length;
    const openCount = complaints.filter(c => matchesStatus(c.status, 'Open')).length;
    const awaitingApprovalCount = complaints.filter(c => matchesStatus(c.status, 'Awaiting approval')).length;
    const awaitingCustomerCount = complaints.filter(c => matchesStatus(c.status, 'Awaiting customer')).length;
    const escalatedCount = complaints.filter(c => (c.priority || '') === 'P1' || matchesStatus(c.status, 'Escalated')).length;
    const resolvedCount = complaints.filter(c => matchesStatus(c.status, 'Resolved') || matchesStatus(c.status, 'Closed')).length;
    const unassignedCount = complaints.filter(c => !c.engineer1 && !matchesStatus(c.status, 'Resolved') && !matchesStatus(c.status, 'Closed')).length;
    
    let emailCount = 0;
    let whatsappCount = 0;
    complaints.forEach(c => {
      const ch = (c.channel || '').toLowerCase();
      if (ch.includes('whatsapp')) whatsappCount++;
      else emailCount++;
    });

    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

    return { 
      total, 
      openCount, 
      awaitingApprovalCount, 
      awaitingCustomerCount, 
      escalatedCount, 
      resolvedCount, 
      unassignedCount, 
      emailCount, 
      whatsappCount, 
      resolutionRate 
    };
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
        <div className="fixed top-4 right-4 z-50 bg-[#160826] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-red-500/40 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR: Deep Plum Theme (Matching Image 1)       */}
      {/* ======================================================== */}
      <aside className="w-60 flex-shrink-0 bg-[#160826] text-white flex flex-col justify-between select-none border-r border-[#2d124d]">
        <div className="p-4 space-y-4">
          
          {/* Logo with Name: Original official logo from older site */}
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

          {/* Navigation Menu */}
          <nav className="space-y-0.5 pt-2 text-xs">
            {/* Overview Option (Matching Screenshot 2) */}
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

            {/* Tools & Equipment Inventory (Positioned directly below Support Escalation) */}
            <button
              onClick={() => {
                setActiveNav('tools');
                setViewMode('inbox');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${
                activeNav === 'tools' ? 'bg-[#be123c] text-white font-bold shadow' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>Tools & Equipment</span>
              </div>
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
      {/* VIEW SWITCHER: TOOLS | OVERVIEW | TABLE | INBOX          */}
      {/* ======================================================== */}
      {activeNav === 'tools' ? (
        <ToolsInventoryView complaintTickets={complaints} />
      ) : activeNav === 'overview' ? (
        <div className="flex-1 flex flex-col bg-[#f4f7f9] overflow-y-auto font-sans">
          
          {/* Overview Top Header */}
          <div className="px-8 pt-7 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Operations Command
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
                Digitech Operations Overview
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Dispatch Desk Online</span>
              </div>
              <button
                onClick={() => fetchComplaints(true)}
                disabled={isRefreshing}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                title="Reload Complaints Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
                <span>Reload</span>
              </button>
            </div>
          </div>

          {/* Top 4 Metric KPI Cards */}
          <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Complaints</p>
                <p className="text-2xl font-black text-gray-900 mt-0.5 font-mono">{stats.total}</p>
                <span className="text-[10px] text-gray-500">All registered service calls</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Inbox className="w-5 h-5 text-slate-700" />
              </div>
            </div>

            {/* Card 2: Open Queue */}
            <div 
              onClick={() => {
                setStatusFilter('Open');
                setActiveNav('inbox');
              }}
              className="bg-white rounded-2xl p-4 border border-blue-200/80 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all"
            >
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Active Open Queue</p>
                <p className="text-2xl font-black text-blue-700 mt-0.5 font-mono">{stats.openCount}</p>
                <span className="text-[10px] text-blue-500 font-medium">Pending field attendance</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Card 3: Critical (P1) */}
            <div 
              onClick={() => {
                setPriorityFilter('P1');
                setActiveNav('inbox');
              }}
              className="bg-white rounded-2xl p-4 border border-rose-200/80 shadow-sm flex items-center justify-between cursor-pointer hover:border-rose-400 transition-all"
            >
              <div>
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Critical Escalations</p>
                <p className="text-2xl font-black text-rose-700 mt-0.5 font-mono">{stats.escalatedCount}</p>
                <span className="text-[10px] text-rose-500 font-medium">P1 emergency priority</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
            </div>

            {/* Card 4: Resolution Rate */}
            <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Resolution Rate</p>
                <p className="text-2xl font-black text-emerald-700 mt-0.5 font-mono">{stats.resolutionRate}%</p>
                <span className="text-[10px] text-emerald-600 font-medium">{stats.resolvedCount} completed calls</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Main Content: Left Operations Hub + Right Telemetry */}
          <div className="flex-1 px-8 pb-8 flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Area: NEEDS ATTENTION Hub + RECENT Activities */}
            <div className="flex-1 w-full space-y-6">
              
              {/* NEEDS ATTENTION ACTION CENTER */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Operational Queues &bull; Needs Attention
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {stats.awaitingApprovalCount + stats.escalatedCount + stats.openCount} items
                  </span>
                </div>

                <div className="divide-y divide-gray-100 text-xs">
                  {/* Item 1: Awaiting approval */}
                  <div 
                    onClick={() => {
                      setStatusFilter('Awaiting approval');
                      setActiveNav('inbox');
                    }}
                    className="p-4 hover:bg-amber-50/40 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 font-mono">{stats.awaitingApprovalCount}</span>
                          <span className="font-semibold text-gray-800">Awaiting approval</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">Quotations and service reports pending client sign-off</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-600 transition-colors" />
                  </div>

                  {/* Item 2: Escalated */}
                  <div 
                    onClick={() => {
                      setPriorityFilter('P1');
                      setActiveNav('inbox');
                    }}
                    className="p-4 hover:bg-rose-50/40 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0 animate-pulse"></span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-rose-700 font-mono">{stats.escalatedCount}</span>
                          <span className="font-semibold text-gray-800">Escalated & Critical</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">High priority system down incidents requiring prompt dispatch</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-600 transition-colors" />
                  </div>

                  {/* Item 3: SLA breached / Open > 24h */}
                  <div 
                    onClick={() => {
                      setStatusFilter('Open');
                      setActiveNav('inbox');
                    }}
                    className="p-4 hover:bg-red-50/40 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-red-700 font-mono">{stats.openCount}</span>
                          <span className="font-semibold text-gray-800">SLA Watchlist (&gt;24h)</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">Complaints logged and in service queue beyond standard TAT</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-600 transition-colors" />
                  </div>

                  {/* Item 4: Open conversations */}
                  <div 
                    onClick={() => {
                      setStatusFilter('All');
                      setActiveNav('inbox');
                    }}
                    className="p-4 hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-blue-700 font-mono">{stats.openCount + stats.awaitingApprovalCount}</span>
                          <span className="font-semibold text-gray-800">Active Open Calls</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">Currently active conversations and tickets across channels</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>

                  {/* Item 5: Unassigned to Engineers */}
                  <div 
                    onClick={() => {
                      setViewMode('table');
                    }}
                    className="p-4 hover:bg-amber-50/40 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-700 font-mono">{stats.unassignedCount}</span>
                          <span className="font-semibold text-gray-800">Unassigned to Engineers</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">New complaints waiting for engineer assignment in data grid</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600 group-hover:underline flex items-center gap-1">
                      Assign in Grid &rarr;
                    </span>
                  </div>
                </div>
              </div>

              {/* RECENT REGISTRATIONS FEED */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span>Recent Complaint Registrations</span>
                  <button
                    onClick={() => setActiveNav('inbox')}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 capitalize tracking-normal flex items-center gap-1"
                  >
                    <span>View all inbox</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {complaints.length === 0 ? (
                    <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
                      No complaints registered yet.
                    </div>
                  ) : (
                    complaints.slice(0, 5).map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedTicketId(item.id);
                          setActiveNav('inbox');
                        }}
                        className="p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-gray-200/90 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-900 truncate">
                              {item.clientName}
                            </h4>
                            <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {item.ticketNo}
                            </span>
                            {renderPriorityBadge(item.priority)}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {item.problem || 'No description provided.'}
                          </p>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-0.5">
                            <span>{item.complaintType || 'CCTV'}</span>
                            <span>&bull;</span>
                            <span>{item.channel || 'WhatsApp'}</span>
                            <span>&bull;</span>
                            <span className="font-medium text-gray-600">{item.status || 'Open'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 text-right">
                          <span className="text-xs font-semibold text-gray-500 font-mono">
                            {item.date || 'Today'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Side: Operations Telemetry & Channel Dispatch Center */}
            <div className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 space-y-6">
              
              {/* SECTION: TODAY'S TELEMETRY */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  <span>Operations Dispatch</span>
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Logged Calls</span>
                    <span className="font-bold text-gray-900 font-mono">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Field Resolutions</span>
                    <span className="font-bold text-gray-900 font-mono">{stats.resolvedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Pending Manager Review</span>
                    <span className="font-bold text-gray-900 font-mono">{stats.awaitingApprovalCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Target TAT</span>
                    <span className="font-bold text-emerald-600 font-mono">&lt; 2 Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Desk Status</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      100% Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* SECTION: CONNECTED CHANNELS */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">
                  Communication Channels
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">Email Dispatch</div>
                        <div className="text-[10px] text-gray-400">vineet@digitechservices.net</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {stats.emailCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-800">WhatsApp Dispatch</div>
                        <div className="text-[10px] text-gray-400">9999760222</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {stats.whatsappCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* SECTION: FIELD ENGINEERS */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Field Engineers Roster
                </h3>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {['Sharukh', 'Abdul', 'Govind', 'Himanshu', 'Ashish', 'Zubair'].map(eng => (
                    <span key={eng} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {eng}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      ) : viewMode === 'table' ? (

        // ========================================================
        // 3. FULL DATA GRID: 100% HORIZONTALLY SCROLLABLE EXCEL   
        // (Fixes column overlap completely with 2600px width!)     
        // ========================================================
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden font-sans">
          
          {/* Top Bar for Table View */}
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-gray-900">Complaints Full Data Grid</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-700">
                {filteredComplaints.length} records
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Pure in-app reload button */}
              <button
                onClick={() => fetchComplaints(true)}
                disabled={isRefreshing}
                className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm transition-all"
                title="Reload Complaints Data without refreshing page"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
                <span>Reload</span>
              </button>

              {/* Switch back to Inbox View */}
              <button
                onClick={() => setViewMode('inbox')}
                className="px-3.5 py-1.5 rounded-lg bg-[#be123c] hover:bg-[#9f1239] text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Switch to Inbox View</span>
              </button>
            </div>
          </div>

          {/* Full-width Horizontally Scrollable Container (Min-w 2600px guarantees zero overlap!) */}
          <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
            <div className="min-w-[2600px] rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-xs text-left whitespace-nowrap border-collapse">
                <thead>
                  <tr>
                    <th colSpan={10} className="bg-amber-100 text-amber-900 border-b border-r border-amber-300 py-3 px-4 text-center font-bold text-xs uppercase tracking-wider">
                      STEP -01- (CLIENT CALL REGISTRATION DETAILS)
                    </th>
                    <th colSpan={13} className="bg-emerald-100 text-emerald-900 border-b border-emerald-300 py-3 px-4 text-center font-bold text-xs uppercase tracking-wider">
                      STEP -02- (CALL ATTEND STATUS & RESOLUTION)
                    </th>
                  </tr>
                  <tr className="bg-gray-100 text-gray-800 font-semibold border-b border-gray-300">
                    {/* Step 1 Columns */}
                    <th className="py-2.5 px-3 border-r border-gray-200 w-14 text-center">S.No</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[120px]">Date</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[130px]">Ticket No</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[90px]">Priority</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[160px]">Client Name</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[170px]">Email</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[150px]">Contact Person</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[130px]">Phone</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[140px]">Type</th>
                    <th className="py-2.5 px-3 border-r border-gray-300 min-w-[240px]">Problem Description</th>

                    {/* Step 2 Columns */}
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[150px]">Assigned Date</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[140px]">Engineer 01</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[140px]">Engineer 02</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[180px]">Finding / Observation</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[180px]">Action Taken</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[150px]">Used Material</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[150px]">Required Material</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[130px]">Remarks</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[180px] font-bold text-gray-900 bg-gray-50">Call Status</th>
                    <th className="py-2.5 px-3 border-r border-gray-200 min-w-[190px] font-bold text-gray-900 bg-gray-50">Final Status</th>
                    <th className="py-2.5 px-4 text-center min-w-[120px] font-bold text-gray-900 bg-gray-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComplaints.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-3 border-r border-gray-200 text-gray-500 text-center font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200 text-gray-700 font-mono">{item.date}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200 font-mono font-bold text-blue-600">{item.ticketNo}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200">{renderPriorityBadge(item.priority)}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200 font-semibold text-gray-900">{item.clientName}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200 text-gray-600">{item.clientEmail}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200 text-gray-800">{item.contactPerson}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200 font-mono text-gray-800">{item.contactNumber}</td>
                      <td className="py-2.5 px-3 border-r border-gray-200 text-gray-700">{item.complaintType}</td>
                      <td className="py-2.5 px-3 border-r border-gray-300 text-gray-600">{item.problem}</td>

                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[150px]">
                        <input 
                          type="date" 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black" 
                          value={item.assignedDate || ''} 
                          onChange={e => updateComplaint(item.id, 'assignedDate', e.target.value)} 
                        />
                      </td>
                      {/* Engineer 1 */}
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[170px]">
                        <div className="flex items-center gap-1">
                          <select 
                            className={`w-full border rounded p-1.5 text-xs bg-white ${
                              item.engineer1Status === 'quitted' ? 'border-red-400 bg-red-50 text-red-800 font-bold' : 'border-gray-300 text-black'
                            }`}
                            value={item.engineer1 || ''} 
                            onChange={e => updateComplaint(item.id, 'engineer1', e.target.value)}
                          >
                            <option value="">Select Engineer</option>
                            {ROSTER_ENGINEERS.map(eng => (
                              <option key={eng} value={eng}>{eng}</option>
                            ))}
                          </select>
                          {item.engineer1 && (
                            <a
                              href={getEngineerWhatsAppUrl(item.engineer1, item, 'NEW')}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Dispatch to ${item.engineer1} on WhatsApp (+91 ${ENGINEER_PHONE})`}
                              className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 flex-shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        {item.engineer1Status === 'quitted' && (
                          <div className="text-[10px] text-red-600 font-bold mt-0.5 truncate" title={item.engineer1QuitReason}>
                            Quitted: {item.engineer1QuitReason || 'Unable to solve'}
                          </div>
                        )}
                      </td>

                      {/* Engineer 2 (Round-Robin) */}
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[170px]">
                        <div className="flex items-center gap-1">
                          <select 
                            className={`w-full border rounded p-1.5 text-xs bg-white ${
                              item.engineer2Status === 'quitted' ? 'border-red-400 bg-red-50 text-red-800 font-bold' : 'border-gray-300 text-black'
                            }`}
                            value={item.engineer2 || ''} 
                            onChange={e => updateComplaint(item.id, 'engineer2', e.target.value)}
                          >
                            <option value="">Select Engineer</option>
                            {ROSTER_ENGINEERS.map(eng => (
                              <option key={eng} value={eng}>{eng}</option>
                            ))}
                          </select>
                          {item.engineer2 && (
                            <a
                              href={getEngineerWhatsAppUrl(item.engineer2, item, item.engineer1Status === 'quitted' ? 'HANDOVER' : 'NEW')}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Dispatch to ${item.engineer2} on WhatsApp (+91 ${ENGINEER_PHONE})`}
                              className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 flex-shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        {item.engineer2Status === 'quitted' && (
                          <div className="text-[10px] text-red-600 font-bold mt-0.5">
                            Quitted &bull; Escalated to Admin
                          </div>
                        )}
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[180px]">
                        <input 
                          type="text" 
                          placeholder="Findings..." 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black" 
                          value={item.finding || ''} 
                          onChange={e => updateComplaint(item.id, 'finding', e.target.value)} 
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[180px]">
                        <input 
                          type="text" 
                          placeholder="Action taken..." 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black" 
                          value={item.actionTaken || ''} 
                          onChange={e => updateComplaint(item.id, 'actionTaken', e.target.value)} 
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[150px]">
                        <input 
                          type="text" 
                          placeholder="Used material..." 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black" 
                          value={item.usedMaterial || ''} 
                          onChange={e => updateComplaint(item.id, 'usedMaterial', e.target.value)} 
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[150px]">
                        <input 
                          type="text" 
                          placeholder="Required material..." 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black" 
                          value={item.requiredMaterial || ''} 
                          onChange={e => updateComplaint(item.id, 'requiredMaterial', e.target.value)} 
                        />
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[130px]">
                        <select 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black bg-white" 
                          value={item.remarks || ''} 
                          onChange={e => updateComplaint(item.id, 'remarks', e.target.value)}
                        >
                          <option value="">Select Remarks</option>
                          <option>U/W</option>
                          <option>U/AMC</option>
                          <option>Chargeable</option>
                        </select>
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[180px]">
                        <select 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black bg-white" 
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
                      <td className="py-1.5 px-2 border-r border-gray-200 min-w-[190px]">
                        <select 
                          className="w-full border border-gray-300 rounded p-1.5 text-xs text-black bg-white" 
                          value={item.finalStatus || ''} 
                          onChange={e => updateComplaint(item.id, 'finalStatus', e.target.value)}
                        >
                          <option value="">Select Final Status</option>
                          <option value="Complete">Complete</option>
                          <option value="Quotation sent">Quotation sent</option>
                          <option value="Invoice raise">Invoice raise</option>
                        </select>
                      </td>
                      <td className="py-1.5 px-3 text-center min-w-[120px] bg-white">
                        <button 
                          onClick={() => saveComplaint(item.id)} 
                          disabled={saveStatus.saving && saveStatus.id === item.id}
                          className="w-full bg-[#be123c] hover:bg-[#9f1239] text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
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
                          `Hello ${selectedTicket.clientName}, this is Digitech regarding your complaint ${selectedTicket.ticketNo} (${selectedTicket.problem}).`
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
                      href={`mailto:${selectedTicket.clientEmail || 'vineet@digitechservices.net'}?cc=vineet@digitechservices.net&subject=Digitech%20Update%20Ticket%20${selectedTicket.ticketNo}`}
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

                    {/* Level-3 Admin Escalation Notice Banner */}
                    {(selectedTicket.adminEscalated || selectedTicket.engineer2Status === 'quitted') && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md flex items-start gap-3 border border-red-300 animate-pulse">
                        <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs tracking-wider uppercase bg-black/25 px-2 py-0.5 rounded">
                              LEVEL-3 CRITICAL ESCALATION TO ADMIN
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-white text-red-700">
                              P1 URGENT
                            </span>
                          </div>
                          <p className="text-xs text-red-100 mt-1.5 leading-relaxed">
                            Both <strong>Engineer 1 ({selectedTicket.engineer1 || 'Assigned'})</strong> and <strong>Engineer 2 ({selectedTicket.engineer2 || 'Assigned'})</strong> quitted this task. The ticket has been automatically elevated to <strong>P1 Critical</strong> and routed to <strong>Tech Escalations</strong> for Admin intervention.
                          </p>
                          {selectedTicket.engineer2QuitReason && (
                            <div className="mt-2 p-2 rounded-lg bg-black/30 text-[11px] font-mono text-red-100 border border-white/10">
                              <strong>Engineer 2 Quitting Blocker:</strong> {selectedTicket.engineer2QuitReason}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ticket Status Meta Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Priority</label>
                        <select
                          value={selectedTicket.priority || 'P2'}
                          onChange={e => updateComplaint(selectedTicket.id, 'priority', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold"
                        >
                          <option value="P1">P1 - Critical (Urgent)</option>
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
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold"
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
                    </div>

                    {/* ======================================================== */}
                    {/* 2-TIER FIELD ENGINEER WORKFLOW CARDS                     */}
                    {/* ======================================================== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      
                      {/* CARD 1: ENGINEER 01 (PRIMARY SITE LEAD) */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        selectedTicket.engineer1Status === 'quitted'
                          ? 'border-red-200 bg-red-50/50'
                          : selectedTicket.engineer1
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-gray-200 bg-gray-50/50'
                      }`}>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200/70">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-xs text-gray-800">
                              Engineer 01 (Primary Lead)
                            </span>
                          </div>

                          {selectedTicket.engineer1Status === 'quitted' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">
                              ❌ Quitted Task
                            </span>
                          ) : selectedTicket.engineer1 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                              🟢 Assigned
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              ⚪ Unassigned
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="text-gray-500 text-[11px] block mb-1">Select Engineer</label>
                            <select
                              value={selectedTicket.engineer1 || ''}
                              onChange={e => updateComplaint(selectedTicket.id, 'engineer1', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white text-gray-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                            >
                              <option value="">Select Field Engineer</option>
                              {ROSTER_ENGINEERS.map(eng => (
                                <option key={eng} value={eng}>{eng}</option>
                              ))}
                            </select>
                          </div>

                          <div className="p-2 rounded-lg bg-white border border-gray-200 flex items-center justify-between text-[11px]">
                            <span className="text-gray-500">Universal Contact:</span>
                            <span className="font-mono font-bold text-gray-800">+91 {ENGINEER_PHONE}</span>
                          </div>

                          {/* Quitted Notice if Engineer 1 has quitted */}
                          {selectedTicket.engineer1Status === 'quitted' && (
                            <div className="p-2.5 rounded-lg bg-red-100/70 border border-red-200 text-red-900 text-[11px] space-y-1">
                              <div className="font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                <span>Quit Handover Recorded:</span>
                              </div>
                              <p className="italic text-red-800">
                                &ldquo;{selectedTicket.engineer1QuitReason || 'Engineer unable to solve problem.'}&rdquo;
                              </p>
                              <div className="text-[10px] text-red-700 font-medium">
                                Handed over to: <strong>{selectedTicket.engineer2 || 'Next Engineer'}</strong>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {selectedTicket.engineer1 && (
                              <a
                                href={getEngineerWhatsAppUrl(selectedTicket.engineer1, selectedTicket, 'NEW')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Dispatch Job (WhatsApp)</span>
                              </a>
                            )}

                            {selectedTicket.engineer1 && selectedTicket.engineer1Status !== 'quitted' && (
                              <button
                                type="button"
                                onClick={() => setQuitModalEng1({ isOpen: true, ticket: selectedTicket, reason: '' })}
                                className="py-1.5 px-3 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 transition-all"
                                title="Click if Engineer 1 is unable to solve and quits"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                                <span>Engineer Quits / Handover</span>
                              </button>
                            )}

                            {selectedTicket.engineer1Status === 'quitted' && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateComplaint(selectedTicket.id, 'engineer1Status', 'assigned');
                                  updateComplaint(selectedTicket.id, 'engineer1QuitReason', '');
                                  showToast('Engineer 1 status reset.');
                                }}
                                className="py-1 px-2.5 rounded text-[10px] text-gray-500 hover:text-gray-800 underline"
                              >
                                Reset Eng 1 Status
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CARD 2: ENGINEER 02 (ROUND-ROBIN SECONDARY) */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        selectedTicket.engineer2Status === 'quitted'
                          ? 'border-red-300 bg-red-50/70 ring-1 ring-red-300'
                          : selectedTicket.engineer2
                          ? 'border-blue-200 bg-blue-50/20'
                          : 'border-dashed border-gray-300 bg-gray-50/30'
                      }`}>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200/70">
                          <div className="flex items-center gap-2">
                            <RotateCw className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-xs text-gray-800">
                              Engineer 02 (Round-Robin Handover)
                            </span>
                          </div>

                          {selectedTicket.engineer2Status === 'quitted' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">
                              ❌ Quitted & Admin Escalated
                            </span>
                          ) : selectedTicket.engineer2 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300">
                              🔄 Round-Robin Assigned
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                              Standby (if Eng 1 quits)
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="text-gray-500 text-[11px] block mb-1">
                              Engineer 02 Name
                            </label>
                            <select
                              value={selectedTicket.engineer2 || ''}
                              onChange={e => updateComplaint(selectedTicket.id, 'engineer2', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white text-gray-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                            >
                              <option value="">Awaiting Round-Robin Assignment</option>
                              {ROSTER_ENGINEERS.map(eng => (
                                <option key={eng} value={eng}>{eng}</option>
                              ))}
                            </select>
                          </div>

                          <div className="p-2 rounded-lg bg-white border border-gray-200 flex items-center justify-between text-[11px]">
                            <span className="text-gray-500">Universal Contact:</span>
                            <span className="font-mono font-bold text-gray-800">+91 {ENGINEER_PHONE}</span>
                          </div>

                          {/* Notice / Status */}
                          {selectedTicket.engineer2Status === 'quitted' ? (
                            <div className="p-2.5 rounded-lg bg-red-100 border border-red-300 text-red-900 text-[11px] space-y-1">
                              <div className="font-bold flex items-center gap-1">
                                <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                                <span>Engineer 2 Also Quitted:</span>
                              </div>
                              <p className="italic text-red-800">
                                &ldquo;{selectedTicket.engineer2QuitReason || 'Technical blocker encountered.'}&rdquo;
                              </p>
                              <div className="text-[10px] font-bold text-red-700 uppercase">
                                ⚠️ Escalated to Admin (Level-3 P1 Intervention)
                              </div>
                            </div>
                          ) : !selectedTicket.engineer2 ? (
                            <div className="p-2 rounded-lg bg-gray-100/70 border border-gray-200 text-gray-500 text-[11px]">
                              ℹ️ Round-Robin backup automatically activates with next available engineer if Engineer 1 cannot resolve on site.
                            </div>
                          ) : null}

                          {/* Action Buttons for Engineer 2 */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {selectedTicket.engineer2 && (
                              <a
                                href={getEngineerWhatsAppUrl(
                                  selectedTicket.engineer2, 
                                  selectedTicket, 
                                  selectedTicket.engineer1Status === 'quitted' ? 'HANDOVER' : 'NEW'
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Dispatch Job (WhatsApp)</span>
                              </a>
                            )}

                            {selectedTicket.engineer2 && selectedTicket.engineer2Status !== 'quitted' && (
                              <button
                                type="button"
                                onClick={() => setQuitModalEng2({ isOpen: true, ticket: selectedTicket, reason: '' })}
                                className="py-1.5 px-3 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] flex items-center gap-1 transition-all"
                                title="Click if Engineer 2 is also unable to solve and quits -> Escalates to Admin"
                              >
                                <UserX className="w-3.5 h-3.5 text-red-600" />
                                <span>Engineer 2 Quits &rarr; Escalate to Admin</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Remarks / Warranty</label>
                        <select
                          value={selectedTicket.remarks || ''}
                          onChange={e => updateComplaint(selectedTicket.id, 'remarks', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="">Select Remarks</option>
                          <option>U/W</option>
                          <option>U/AMC</option>
                          <option>Chargeable</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Rectification Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Hardware replacement, Cable rewire..."
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
              
              {/* SECTION 1: STATUS */}
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  STATUS
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
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

              {/* SECTION 2: PRIORITY */}
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

              {/* SECTION 3: CHANNEL */}
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

      {/* ======================================================== */}
      {/* 6. MODAL: ENGINEER 1 QUIT -> ROUND-ROBIN HANDOVER        */}
      {/* ======================================================== */}
      {quitModalEng1.isOpen && quitModalEng1.ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-700 text-white">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-200" />
                <div>
                  <h2 className="text-base font-bold">Engineer 1 Quits: Round-Robin Handover</h2>
                  <p className="text-[11px] text-amber-100">Step 1 of 2: Automatic handover to next field engineer</p>
                </div>
              </div>
              <button
                onClick={() => setQuitModalEng1({ isOpen: false, ticket: null, reason: '' })}
                className="p-1 rounded-lg text-amber-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              {/* Ticket & Engineer Details */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                    {quitModalEng1.ticket.ticketNo || `TKT-${quitModalEng1.ticket.id}`}
                  </span>
                  <span className="text-amber-800 font-semibold">{quitModalEng1.ticket.clientName}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-gray-500 block">Current Engineer 1:</span>
                    <strong className="text-red-700 font-bold text-xs">{quitModalEng1.ticket.engineer1 || 'Abdul'} (Quitting)</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Next Round-Robin Assignee:</span>
                    <strong className="text-emerald-700 font-bold text-xs">
                      🔄 {getNextRoundRobinEngineer(quitModalEng1.ticket.engineer1 || 'Abdul')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Quit Reason Input */}
              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Why is {quitModalEng1.ticket.engineer1 || 'Engineer 1'} unable to resolve this task? *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the diagnosis, physical obstacles, missing specialized gear, or cable path blocker..."
                  value={quitModalEng1.reason}
                  onChange={e => setQuitModalEng1({ ...quitModalEng1, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  This note will be logged in ticket remarks and forwarded to the next engineer via WhatsApp (+91 {ENGINEER_PHONE}).
                </p>
              </div>

              {/* Informational Box */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-[11px] flex items-start gap-2">
                <RotateCw className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  The system will automatically assign <strong>{getNextRoundRobinEngineer(quitModalEng1.ticket.engineer1 || 'Abdul')}</strong> as Engineer 2 and generate a WhatsApp dispatch message with full diagnostic context.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuitModalEng1({ isOpen: false, ticket: null, reason: '' })}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEngineer1Quit}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Confirm Handover to {getNextRoundRobinEngineer(quitModalEng1.ticket.engineer1 || 'Abdul')}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL: ENGINEER 2 QUIT -> ESCALATE TO ADMIN           */}
      {/* ======================================================== */}
      {quitModalEng2.isOpen && quitModalEng2.ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-600 to-rose-700 text-white">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-200" />
                <div>
                  <h2 className="text-base font-bold">Engineer 2 Quits: Level-3 Escalation to Admin</h2>
                  <p className="text-[11px] text-red-100">Step 2 of 2: Automatic critical routing to Admin</p>
                </div>
              </div>
              <button
                onClick={() => setQuitModalEng2({ isOpen: false, ticket: null, reason: '' })}
                className="p-1 rounded-lg text-red-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              {/* Critical Notice */}
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-red-700 font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span className="uppercase text-[11px] tracking-wider">Critical 2-Tier Escalation Triggered</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-[11px]">
                  Both <strong>Engineer 1 ({quitModalEng2.ticket.engineer1 || 'First Engineer'})</strong> and <strong>Engineer 2 ({quitModalEng2.ticket.engineer2 || 'Second Engineer'})</strong> have quitted this task.
                </p>
                <p className="text-red-700 font-bold text-[11px]">
                  &bull; Ticket Status will change to: <span className="bg-red-100 px-1.5 py-0.5 rounded">Escalated</span><br />
                  &bull; Priority will be raised to: <span className="bg-red-100 px-1.5 py-0.5 rounded">P1 Critical</span><br />
                  &bull; Ticket will be flagged under Admin Tech Escalations.
                </p>
              </div>

              {/* Quit Reason Input */}
              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Why is Engineer 2 ({quitModalEng2.ticket.engineer2 || 'Engineer 2'}) unable to complete the service? *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify critical component failures, customer refusal, hazardous conditions, or major site rewiring needed..."
                  value={quitModalEng2.reason}
                  onChange={e => setQuitModalEng2({ ...quitModalEng2, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuitModalEng2({ isOpen: false, ticket: null, reason: '' })}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEngineer2Quit}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Confirm Escalation to Admin (P1)</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
