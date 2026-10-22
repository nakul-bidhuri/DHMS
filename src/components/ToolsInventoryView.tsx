'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Boxes,
  Wrench,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Trash2,
  Calendar,
  Tag,
  User,
  Filter,
  X,
  Send,
  Check,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import { 
  ROSTER_ENGINEERS, 
  getEngineerPhone, 
  DEFAULT_ENGINEER_PHONE,
  ADMIN_PHONE 
} from '@/lib/engineers';
import ToolsInventoryLogo from './ToolsInventoryLogo';

export { ROSTER_ENGINEERS };
export const ENGINEER_PHONE = DEFAULT_ENGINEER_PHONE;

export type ToolCategory = 
  | 'CCTV Tools' 
  | 'Fiber Tools' 
  | 'Power Tools' 
  | 'Network Testers' 
  | 'Safety & Access' 
  | 'Measuring & Splicing';

export interface ToolItem {
  id: string;
  toolName: string;
  assetTag: string;
  category: ToolCategory;
  assignedEngineer: string;
  engineerContact: string;
  issuedDate: string;
  expectedReturnDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  condition: 'Good' | 'Fair' | 'Needs Service' | 'Damaged';
  linkedTicket?: string;
  notes?: string;
}

// Initial realistic preloaded operational tools for CCTV & Telecom field engineers
const INITIAL_TOOLS: ToolItem[] = [
  {
    id: 'tool-1',
    toolName: 'Bosch Professional Rotary Hammer Drill (GBH 220)',
    assetTag: 'DT-TL-101',
    category: 'Power Tools',
    assignedEngineer: 'Abdul Latif',
    engineerContact: '8826447778',
    issuedDate: '2026-10-18',
    expectedReturnDate: '2026-10-22',
    status: 'Issued',
    condition: 'Good',
    linkedTicket: 'TKT-1002',
    notes: 'Issued with 6mm, 8mm concrete drill bit set and case.'
  },
  {
    id: 'tool-2',
    toolName: 'Core Alignment Fiber Optical Fusion Splicer (FS-60S)',
    assetTag: 'DT-TL-102',
    category: 'Fiber Tools',
    assignedEngineer: 'Shahrukh Khan',
    engineerContact: '7042871709',
    issuedDate: '2026-10-19',
    expectedReturnDate: '2026-10-23',
    status: 'Issued',
    condition: 'Good',
    linkedTicket: 'TKT-1003',
    notes: 'Fiber cleaver and electrode spare kit inside carry case.'
  },
  {
    id: 'tool-3',
    toolName: '4K CCTV IPC Field Camera Monitor & Tester (IPC-9800)',
    assetTag: 'DT-TL-103',
    category: 'CCTV Tools',
    assignedEngineer: 'Govind Kumar',
    engineerContact: '8130148238',
    issuedDate: '2026-10-16',
    expectedReturnDate: '2026-10-18',
    returnDate: '2026-10-18',
    status: 'Returned',
    condition: 'Good',
    linkedTicket: 'TKT-1001',
    notes: 'Returned in full working order. Battery 100%.'
  },
  {
    id: 'tool-4',
    toolName: 'RJ45 / RJ11 Heavy-Duty Ratchet Crimping Tool',
    assetTag: 'DT-TL-104',
    category: 'Network Testers',
    assignedEngineer: 'Sameer Saifi',
    engineerContact: '9311117493',
    issuedDate: '2026-10-20',
    expectedReturnDate: '2026-10-22',
    status: 'Issued',
    condition: 'Good',
    linkedTicket: 'TKT-1004',
    notes: 'Includes Cat6 cable stripper tool.'
  },
  {
    id: 'tool-5',
    toolName: '12-Foot Heavy Aluminum Telescopic Extension Ladder',
    assetTag: 'DT-TL-105',
    category: 'Safety & Access',
    assignedEngineer: 'Ankush Singh',
    engineerContact: '8802659421',
    issuedDate: '2026-10-12',
    expectedReturnDate: '2026-10-15',
    status: 'Overdue',
    condition: 'Fair',
    linkedTicket: 'TKT-1005',
    notes: 'Expected return was Oct 15. Reminder needed.'
  },
  {
    id: 'tool-6',
    toolName: 'Fluke 117 Electricians Digital Multimeter',
    assetTag: 'DT-TL-106',
    category: 'Measuring & Splicing',
    assignedEngineer: 'Afzal Digitech',
    engineerContact: '6398776924',
    issuedDate: '2026-10-14',
    expectedReturnDate: '2026-10-17',
    returnDate: '2026-10-17',
    status: 'Returned',
    condition: 'Good',
    linkedTicket: 'TKT-1006',
    notes: 'Returned with both probe leads intact.'
  },
  {
    id: 'tool-7',
    toolName: 'Visual Fault Locator (VFL 30mW) & Optical Power Meter',
    assetTag: 'DT-TL-107',
    category: 'Fiber Tools',
    assignedEngineer: 'Gurvinder Singh',
    engineerContact: '8802650942',
    issuedDate: '2026-10-21',
    expectedReturnDate: '2026-10-24',
    status: 'Issued',
    condition: 'Good',
    linkedTicket: 'TKT-1007',
    notes: 'Issued with SC/FC adaptors and fresh AA cells.'
  },
  {
    id: 'tool-8',
    toolName: 'Hikvision Coaxial BNC Compression Tool Kit',
    assetTag: 'DT-TL-108',
    category: 'CCTV Tools',
    assignedEngineer: 'Sonu Kumar',
    engineerContact: '9958028414',
    issuedDate: '2026-10-15',
    expectedReturnDate: '2026-10-18',
    returnDate: '2026-10-18',
    status: 'Returned',
    condition: 'Good',
    linkedTicket: 'TKT-1008',
    notes: 'Returned with RG6 wire cutter.'
  }
];

const STORAGE_KEY = 'digitech_tools_inventory_v1';

export default function ToolsInventoryView({
  complaintTickets = []
}: {
  complaintTickets?: { id: string | number; ticketNo?: string; clientName?: string }[];
}) {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [engineerFilter, setEngineerFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [returnModalTarget, setReturnModalTarget] = useState<ToolItem | null>(null);
  const [returnCondition, setReturnCondition] = useState<'Good' | 'Fair' | 'Needs Service' | 'Damaged'>('Good');
  const [returnRemarks, setReturnRemarks] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load from localStorage or fallback
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check for overdue status based on date
          const today = new Date().toISOString().split('T')[0];
          const updated = parsed.map((item: ToolItem) => {
            if (item.status === 'Issued' && item.expectedReturnDate < today) {
              return { ...item, status: 'Overdue' as const };
            }
            return item;
          });
          setTools(updated);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored tools, using default', e);
    }
    setTools(INITIAL_TOOLS);
  }, []);

  // Save to localStorage whenever tools state changes
  const saveTools = (newTools: ToolItem[]) => {
    setTools(newTools);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTools));
    } catch (e) {
      console.error('Failed to save tools to storage', e);
    }
  };

  // New Tool Form State
  const [newToolForm, setNewToolForm] = useState({
    toolName: '',
    assetTag: '',
    category: 'CCTV Tools' as ToolCategory,
    assignedEngineer: 'Abdul Latif',
    expectedReturnDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    linkedTicket: '',
    notes: ''
  });

  // Handle Tool Issue Submission
  const handleIssueTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolForm.toolName.trim()) {
      alert('Please enter a tool name');
      return;
    }

    const tag = newToolForm.assetTag.trim() || `DT-TL-${Math.floor(100 + Math.random() * 900)}`;
    const phone = getEngineerPhone(newToolForm.assignedEngineer);
    const newTool: ToolItem = {
      id: `tool-${Date.now()}`,
      toolName: newToolForm.toolName.trim(),
      assetTag: tag,
      category: newToolForm.category,
      assignedEngineer: newToolForm.assignedEngineer,
      engineerContact: phone,
      issuedDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: newToolForm.expectedReturnDate,
      status: 'Issued',
      condition: 'Good',
      linkedTicket: newToolForm.linkedTicket || 'General Service',
      notes: newToolForm.notes
    };

    const updated = [newTool, ...tools];
    saveTools(updated);
    setIsIssueModalOpen(false);
    showToast(`Tool ${tag} issued to ${newTool.assignedEngineer}!`);

    // Reset form
    setNewToolForm({
      toolName: '',
      assetTag: '',
      category: 'CCTV Tools',
      assignedEngineer: 'Abdul Latif',
      expectedReturnDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      linkedTicket: '',
      notes: ''
    });
  };

  // Confirm Return
  const handleConfirmReturn = () => {
    if (!returnModalTarget) return;

    const today = new Date().toISOString().split('T')[0];
    const updated = tools.map(item => {
      if (item.id === returnModalTarget.id) {
        return {
          ...item,
          status: 'Returned' as const,
          returnDate: today,
          condition: returnCondition,
          notes: returnRemarks ? `${item.notes ? item.notes + ' | ' : ''}Return Note: ${returnRemarks}` : item.notes
        };
      }
      return item;
    });

    saveTools(updated);
    showToast(`Tool ${returnModalTarget.assetTag} successfully marked as Returned!`);
    setReturnModalTarget(null);
    setReturnRemarks('');
  };

  // Delete tool
  const handleDeleteTool = (id: string, tag: string) => {
    if (confirm(`Are you sure you want to remove tool ${tag} from the inventory?`)) {
      const updated = tools.filter(t => t.id !== id);
      saveTools(updated);
      showToast(`Tool ${tag} removed.`);
    }
  };

  // Quick Preset Selector for common tools
  const handleSelectPreset = (name: string, category: ToolCategory) => {
    setNewToolForm(prev => ({
      ...prev,
      toolName: name,
      category
    }));
  };

  // Statistics
  const stats = useMemo(() => {
    const total = tools.length;
    const issued = tools.filter(t => t.status === 'Issued').length;
    const overdue = tools.filter(t => t.status === 'Overdue').length;
    const returned = tools.filter(t => t.status === 'Returned').length;
    return { total, issued, overdue, returned };
  }, [tools]);

  // Filtered tools list
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      if (statusFilter !== 'All' && tool.status !== statusFilter) return false;
      if (engineerFilter !== 'All' && tool.assignedEngineer !== engineerFilter) return false;
      if (categoryFilter !== 'All' && tool.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pool = [
          tool.toolName,
          tool.assetTag,
          tool.category,
          tool.assignedEngineer,
          tool.linkedTicket,
          tool.condition,
          tool.notes
        ].map(v => v?.toLowerCase() || '').join(' ');
        if (!pool.includes(q)) return false;
      }
      return true;
    });
  }, [tools, statusFilter, engineerFilter, categoryFilter, searchQuery]);

  // WhatsApp reminder message builder routed to engineer's individual mobile number
  const getToolWhatsAppUrl = (tool: ToolItem) => {
    const phone = getEngineerPhone(tool.assignedEngineer);
    const msg = [
      `*========================================*`,
      `*DIGITECH SERVICES | TOOL RETURN NOTICE*`,
      `*========================================*`,
      ``,
      `*Asset Tag:* [${tool.assetTag}]`,
      `*Equipment:* ${tool.toolName}`,
      `*Category:* ${tool.category}`,
      ``,
      `*-- [CUSTODY DETAILS] --*`,
      `*Assigned Engineer:* ${tool.assignedEngineer}`,
      `*Contact Line:* +91 ${phone}`,
      `*Issued Date:* ${tool.issuedDate}`,
      `*Return Due Date:* ${tool.expectedReturnDate} ${tool.status === 'Overdue' ? '*[OVERDUE]*' : ''}`,
      tool.linkedTicket ? `*Linked Ticket:* ${tool.linkedTicket}` : '',
      ``,
      `*-- [DIRECTIVE] --*`,
      `>> Please return this equipment to the Digitech tool locker.`,
      `>> If in active field use, please report extension request.`,
      ``,
      `*========================================*`,
      `*DIGITECH HMS ASSET MANAGEMENT*`,
      `*========================================*`
    ].filter(Boolean).join('\n');

    return `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-y-auto font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#160826] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="px-8 pt-7 pb-4 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Operations & Logistics
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Field Asset & Equipment Locker
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-3">
            <ToolsInventoryLogo className="w-8 h-8" />
            <span>Tools & Equipment Inventory</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Record manual tools, camera monitors, fusion splicers, ladders, and drills handed over to engineers with return tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Asset Locker Online &bull; Direct WhatsApp Tracking</span>
          </div>

          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#be123c] hover:to-[#9f1239] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-950/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Issue Tool to Engineer</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">

        {/* KPI Metric Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Tracked Tools</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5 font-mono">{stats.total}</p>
              <span className="text-[10px] text-gray-500">In company inventory</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Boxes className="w-5 h-5 text-slate-700" />
            </div>
          </div>

          {/* Card 2: Currently Issued (In Field) */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'Issued' ? 'All' : 'Issued')}
            className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              statusFilter === 'Issued' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-amber-200 hover:border-amber-400'
            }`}
          >
            <div>
              <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Issued (In Field)</p>
              <p className="text-2xl font-black text-amber-700 mt-0.5 font-mono">{stats.issued}</p>
              <span className="text-[10px] text-amber-600 font-medium">Currently with engineers</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
          </div>

          {/* Card 3: Overdue Returns */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'Overdue' ? 'All' : 'Overdue')}
            className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              statusFilter === 'Overdue' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-rose-200 hover:border-rose-400'
            }`}
          >
            <div>
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Overdue Returns</p>
              <p className="text-2xl font-black text-rose-700 mt-0.5 font-mono">{stats.overdue}</p>
              <span className="text-[10px] text-rose-600 font-medium">Action / Reminder required</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>

          {/* Card 4: Returned in Locker */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'Returned' ? 'All' : 'Returned')}
            className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              statusFilter === 'Returned' ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-emerald-200 hover:border-emerald-400'
            }`}
          >
            <div>
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Returned in Locker</p>
              <p className="text-2xl font-black text-emerald-700 mt-0.5 font-mono">{stats.returned}</p>
              <span className="text-[10px] text-emerald-600 font-medium">Ready for next assignment</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

        </div>

        {/* Search, Filter Bar, and Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tool name, asset tag, engineer, or ticket..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Filters: Status, Engineer, Category */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Issued">Issued (In Field)</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned</option>
            </select>

            {/* Engineer Filter */}
            <select
              value={engineerFilter}
              onChange={e => setEngineerFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            >
              <option value="All">All Engineers</option>
              {ROSTER_ENGINEERS.map(eng => (
                <option key={eng} value={eng}>{eng}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="CCTV Tools">CCTV Tools</option>
              <option value="Fiber Tools">Fiber Tools</option>
              <option value="Power Tools">Power Tools</option>
              <option value="Network Testers">Network Testers</option>
              <option value="Safety & Access">Safety & Access</option>
              <option value="Measuring & Splicing">Measuring & Splicing</option>
            </select>

            {(statusFilter !== 'All' || engineerFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setEngineerFilter('All');
                  setCategoryFilter('All');
                  setSearchQuery('');
                }}
                className="px-2.5 py-2 text-xs text-rose-600 hover:text-rose-800 font-medium underline"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Tools Inventory Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">Equipment Logs & Return Status</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-700">
                {filteredTools.length} tools
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Single-page asset tracking &bull; Direct engineer WhatsApp routing
            </span>
          </div>

          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse text-xs table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-[34%]">Equipment & Asset</th>
                  <th className="py-3.5 px-4 w-[22%]">Assigned Engineer</th>
                  <th className="py-3.5 px-4 w-[15%]">Schedule & Due</th>
                  <th className="py-3.5 px-4 w-[14%]">Condition & Status</th>
                  <th className="py-3.5 px-4 w-[15%] text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <ToolsInventoryLogo className="w-10 h-10 mx-auto mb-2 opacity-60" variant="monochrome" />
                      <p className="font-semibold text-gray-600">No tools found matching your filters</p>
                      <p className="text-xs text-gray-400 mt-1">Try clearing your search query or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredTools.map(item => {
                    const isOverdue = item.status === 'Overdue';
                    const isIssued = item.status === 'Issued';
                    const isReturned = item.status === 'Returned';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Col 1: Equipment & Asset */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-start gap-2.5">
                            <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-300 font-mono font-bold text-gray-900 text-[11px] flex-shrink-0 mt-0.5">
                              {item.assetTag}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-gray-900 text-xs leading-snug break-words">
                                {item.toolName}
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                  {item.category}
                                </span>
                                {item.linkedTicket && (
                                  <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                    {item.linkedTicket}
                                  </span>
                                )}
                              </div>
                              {item.notes && (
                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 italic">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Col 2: Assigned Engineer */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0 border border-rose-200">
                              {item.assignedEngineer[0]}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 truncate">{item.assignedEngineer}</div>
                              <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                                +91 {item.engineerContact || getEngineerPhone(item.assignedEngineer)}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                Issued: <span className="font-mono text-gray-600">{item.issuedDate}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Col 3: Schedule & Due */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-mono font-semibold text-gray-900 text-xs">
                            {item.expectedReturnDate}
                          </div>
                          {isOverdue && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 mt-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Overdue Return
                            </span>
                          )}
                          {isReturned && (
                            <span className="text-[10px] text-gray-500 block mt-0.5">
                              Returned on: <span className="font-mono text-gray-700">{item.returnDate}</span>
                            </span>
                          )}
                          {isIssued && !isOverdue && (
                            <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                              Active in field
                            </span>
                          )}
                        </td>

                        {/* Col 4: Condition & Status */}
                        <td className="py-3.5 px-4 align-top space-y-1.5">
                          <div>
                            {isIssued && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Issued
                              </span>
                            )}
                            {isOverdue && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300 inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                Overdue
                              </span>
                            )}
                            {isReturned && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Returned
                              </span>
                            )}
                          </div>
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.condition === 'Good'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.condition === 'Fair'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : item.condition === 'Needs Service'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {item.condition}
                            </span>
                          </div>
                        </td>

                        {/* Col 5: Actions */}
                        <td className="py-3.5 px-4 align-top text-right pr-5">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {!isReturned && (
                              <a
                                href={getToolWhatsAppUrl(item)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Send WhatsApp Return Notice to ${item.assignedEngineer} (+91 ${item.engineerContact || getEngineerPhone(item.assignedEngineer)})`}
                                className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all flex items-center gap-1 font-bold text-[11px] shadow-sm"
                              >
                                <Send className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>
                            )}

                            {!isReturned ? (
                              <button
                                onClick={() => {
                                  setReturnModalTarget(item);
                                  setReturnCondition('Good');
                                  setReturnRemarks('');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-sm flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Return</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setNewToolForm({
                                    toolName: item.toolName,
                                    assetTag: item.assetTag,
                                    category: item.category,
                                    assignedEngineer: item.assignedEngineer,
                                    expectedReturnDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
                                    linkedTicket: '',
                                    notes: 'Re-issued from inventory.'
                                  });
                                  setIsIssueModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] transition-colors border border-gray-200 flex items-center gap-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
                                <span>Re-Issue</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTool(item.id, item.assetTag)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ISSUE TOOL TO ENGINEER                          */}
      {/* ======================================================== */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-900 to-[#160826] text-white">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold tracking-tight">Issue Operational Tool to Engineer</h2>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueTool} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Common Equipment Presets */}
              <div>
                <label className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] block mb-1.5">
                  Quick Tool Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: '4K CCTV Field Camera Monitor (IPC)', cat: 'CCTV Tools' as ToolCategory },
                    { name: 'Fiber Optical Fusion Splicer Kit', cat: 'Fiber Tools' as ToolCategory },
                    { name: 'Rotary Hammer Drill Machine 220V', cat: 'Power Tools' as ToolCategory },
                    { name: '12-Foot Telescopic Ladder', cat: 'Safety & Access' as ToolCategory },
                    { name: 'Cat6 RJ45 Ratchet Crimper', cat: 'Network Testers' as ToolCategory },
                    { name: 'Fluke Digital Multimeter', cat: 'Measuring & Splicing' as ToolCategory },
                    { name: 'Optical Power Meter & VFL', cat: 'Fiber Tools' as ToolCategory },
                  ].map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset.name, preset.cat)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-gray-700 border border-gray-200 text-[11px] transition-colors"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tool Name */}
                <div className="sm:col-span-2">
                  <label className="text-gray-700 font-bold block mb-1">Tool / Equipment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bosch Hammer Drill, CCTV Tester, Fusion Splicer..."
                    value={newToolForm.toolName}
                    onChange={e => setNewToolForm({ ...newToolForm, toolName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Asset Tag */}
                <div>
                  <label className="text-gray-700 font-bold block mb-1">Asset Tag (Leave blank for auto)</label>
                  <input
                    type="text"
                    placeholder="e.g. DT-TL-110"
                    value={newToolForm.assetTag}
                    onChange={e => setNewToolForm({ ...newToolForm, assetTag: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-gray-700 font-bold block mb-1">Category</label>
                  <select
                    value={newToolForm.category}
                    onChange={e => setNewToolForm({ ...newToolForm, category: e.target.value as ToolCategory })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="CCTV Tools">CCTV Tools</option>
                    <option value="Fiber Tools">Fiber Tools</option>
                    <option value="Power Tools">Power Tools</option>
                    <option value="Network Testers">Network Testers</option>
                    <option value="Safety & Access">Safety & Access</option>
                    <option value="Measuring & Splicing">Measuring & Splicing</option>
                  </select>
                </div>

                {/* Assigned Engineer */}
                <div>
                  <label className="text-gray-700 font-bold block mb-1">Handed Over To Engineer *</label>
                  <select
                    value={newToolForm.assignedEngineer}
                    onChange={e => setNewToolForm({ ...newToolForm, assignedEngineer: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold"
                  >
                    {ROSTER_ENGINEERS.map(eng => (
                      <option key={eng} value={eng}>{eng}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Direct Contact Line: <strong className="text-gray-700 font-mono">+91 {getEngineerPhone(newToolForm.assignedEngineer)}</strong>
                  </p>
                </div>

                {/* Expected Return Date */}
                <div>
                  <label className="text-gray-700 font-bold block mb-1">Expected Return Date *</label>
                  <input
                    type="date"
                    required
                    value={newToolForm.expectedReturnDate}
                    onChange={e => setNewToolForm({ ...newToolForm, expectedReturnDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Linked Ticket */}
                <div className="sm:col-span-2">
                  <label className="text-gray-700 font-bold block mb-1">Linked Complaint Ticket (Optional)</label>
                  {complaintTickets.length > 0 ? (
                    <select
                      value={newToolForm.linkedTicket}
                      onChange={e => setNewToolForm({ ...newToolForm, linkedTicket: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="">General Service / Routine</option>
                      {complaintTickets.map(c => (
                        <option key={c.id} value={c.ticketNo || `TKT-${c.id}`}>
                          {c.ticketNo || `TKT-${c.id}`} - {c.clientName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. TKT-1002"
                      value={newToolForm.linkedTicket}
                      onChange={e => setNewToolForm({ ...newToolForm, linkedTicket: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  )}
                </div>

                {/* Handover Notes */}
                <div className="sm:col-span-2">
                  <label className="text-gray-700 font-bold block mb-1">Handover Notes / Accessories</label>
                  <input
                    type="text"
                    placeholder="e.g. Includes extra battery pack, charger, and plastic storage case."
                    value={newToolForm.notes}
                    onChange={e => setNewToolForm({ ...newToolForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#be123c] hover:bg-[#9f1239] text-white font-bold text-xs shadow-md shadow-rose-950/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Handover to {newToolForm.assignedEngineer}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CONFIRM RETURN OF EQUIPMENT                     */}
      {/* ======================================================== */}
      {returnModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <h2 className="text-base font-bold">Mark Tool as Returned</h2>
              </div>
              <button
                onClick={() => setReturnModalTarget(null)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              {/* Summary Card */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {returnModalTarget.assetTag}
                  </span>
                  <span className="text-gray-500 font-medium">{returnModalTarget.category}</span>
                </div>
                <div className="font-bold text-sm text-gray-900">{returnModalTarget.toolName}</div>
                <div className="text-gray-600 flex items-center gap-1">
                  <span>Issued to:</span>
                  <strong className="text-gray-900">{returnModalTarget.assignedEngineer}</strong>
                  <span className="text-gray-400">({returnModalTarget.issuedDate})</span>
                </div>
              </div>

              {/* Returned Condition */}
              <div>
                <label className="text-gray-700 font-bold block mb-1.5">
                  Inspection Condition upon Return *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Good', 'Fair', 'Needs Service', 'Damaged'] as const).map(cond => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setReturnCondition(cond)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        returnCondition === cond
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {cond === 'Good' && '🟢 Good (Ready for Field)'}
                      {cond === 'Fair' && '🔵 Fair (Operational)'}
                      {cond === 'Needs Service' && '🟡 Needs Calibration / Service'}
                      {cond === 'Damaged' && '🔴 Damaged / Missing Parts'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Return Remarks / Inspection Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. All drill bits returned, cleaned, and checked."
                  value={returnRemarks}
                  onChange={e => setReturnRemarks(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReturnModalTarget(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReturn}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirm Return to Locker</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
