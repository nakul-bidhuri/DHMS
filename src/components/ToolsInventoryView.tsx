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
  RotateCw,
  Trash2,
  Calendar,
  Tag,
  User,
  Filter,
  X,
  Send,
  Check,
  ShieldAlert,
  ArrowRightLeft,
  ExternalLink,
  Layers,
  HardDrive
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

export interface SiteEquipmentItem {
  id: string;
  ticketId: string | number;
  ticketNo?: string;
  clientName?: string;
  address?: string;
  equipmentName: string;
  serialNumber?: string;
  actionNeeded: 'repair' | 'replace';
  faultDescription: string;
  dateBroughtBack: string;
  officeStatus: 'sitting_in_office' | 'at_service_center' | 'ready_for_reinstall' | 'reinstalled';
  serviceCenterRef?: string;
  notes?: string;
  hasTemporaryDevice: boolean;
  tempDeviceName?: string;
  tempDeviceSerial?: string;
  tempDeviceDeployedDate?: string;
  tempDeviceRecoveryStatus: 'deployed' | 'recovered';
  tempDeviceRecoveryDate?: string;
  engineer1?: string;
  engineer2?: string;
  roundRobinEngineer?: string;
}

export interface ToolsInventoryViewProps {
  complaintTickets?: any[];
  onUpdateComplaint?: (id: string | number, field: string, value: any) => void;
  onSelectTicket?: (id: string | number) => void;
  onSaveComplaint?: (id: string | number, updatedTicket?: any) => Promise<void>;
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
  complaintTickets = [],
  onUpdateComplaint,
  onSelectTicket,
  onSaveComplaint
}: ToolsInventoryViewProps) {
  // Navigation: Dual Tabs ('tools' = Company Tools Locker, 'backlog' = Site Equipment Repair & Replacement Backlog)
  const [activeTab, setActiveTab] = useState<'tools' | 'backlog'>('tools');

  // --- COMPANY TOOLS STATE ---
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [engineerFilter, setEngineerFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals state for Company Tools
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

  // Load tools from localStorage or fallback
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
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

  const saveTools = (newTools: ToolItem[]) => {
    setTools(newTools);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTools));
    } catch (e) {
      console.error('Failed to save tools to storage', e);
    }
  };

  // --- SITE EQUIPMENT BACKLOG AGGREGATION ---
  const allSiteEquipments: SiteEquipmentItem[] = useMemo(() => {
    const list: SiteEquipmentItem[] = [];
    complaintTickets.forEach(ticket => {
      if (Array.isArray(ticket.siteEquipments)) {
        ticket.siteEquipments.forEach((eq: any) => {
          list.push({
            ...eq,
            ticketId: ticket.id,
            ticketNo: ticket.ticketNo || `TKT-${ticket.id}`,
            clientName: ticket.clientName || 'Client',
            address: ticket.address || 'Site Address',
            engineer1: ticket.engineer1,
            engineer2: ticket.engineer2,
            roundRobinEngineer: ticket.roundRobinEngineer
          });
        });
      }
    });
    return list;
  }, [complaintTickets]);

  // Backlog Statistics
  const backlogStats = useMemo(() => {
    const total = allSiteEquipments.length;
    const sittingCount = allSiteEquipments.filter(e => e.officeStatus === 'sitting_in_office').length;
    const serviceCenterCount = allSiteEquipments.filter(e => e.officeStatus === 'at_service_center').length;
    const readyCount = allSiteEquipments.filter(e => e.officeStatus === 'ready_for_reinstall').length;
    const reinstalledCount = allSiteEquipments.filter(e => e.officeStatus === 'reinstalled').length;
    const activeStandbyCount = allSiteEquipments.filter(e => e.hasTemporaryDevice && e.tempDeviceRecoveryStatus === 'deployed').length;
    const recoveredStandbyCount = allSiteEquipments.filter(e => e.hasTemporaryDevice && e.tempDeviceRecoveryStatus === 'recovered').length;

    return {
      total,
      sittingCount,
      serviceCenterCount,
      readyCount,
      reinstalledCount,
      activeStandbyCount,
      recoveredStandbyCount
    };
  }, [allSiteEquipments]);

  // Backlog Filtering State
  const [backlogSearch, setBacklogSearch] = useState('');
  const [backlogActionFilter, setBacklogActionFilter] = useState<'All' | 'repair' | 'replace'>('All');
  const [backlogStatusFilter, setBacklogStatusFilter] = useState<string>('All');
  const [backlogStandbyFilter, setBacklogStandbyFilter] = useState<string>('All');

  // Filtered Backlog List
  const filteredBacklog = useMemo(() => {
    return allSiteEquipments.filter(item => {
      if (backlogActionFilter !== 'All' && item.actionNeeded !== backlogActionFilter) return false;
      if (backlogStatusFilter !== 'All' && item.officeStatus !== backlogStatusFilter) return false;
      if (backlogStandbyFilter !== 'All') {
        if (backlogStandbyFilter === 'deployed' && (!item.hasTemporaryDevice || item.tempDeviceRecoveryStatus !== 'deployed')) return false;
        if (backlogStandbyFilter === 'recovered' && (!item.hasTemporaryDevice || item.tempDeviceRecoveryStatus !== 'recovered')) return false;
        if (backlogStandbyFilter === 'none' && item.hasTemporaryDevice) return false;
      }
      if (backlogSearch.trim()) {
        const q = backlogSearch.toLowerCase();
        const pool = [
          item.ticketNo,
          item.clientName,
          item.address,
          item.equipmentName,
          item.serialNumber,
          item.faultDescription,
          item.tempDeviceName,
          item.tempDeviceSerial,
          item.serviceCenterRef,
          item.engineer1,
          item.engineer2
        ].map(v => v?.toString().toLowerCase() || '').join(' ');
        if (!pool.includes(q)) return false;
      }
      return true;
    });
  }, [allSiteEquipments, backlogActionFilter, backlogStatusFilter, backlogStandbyFilter, backlogSearch]);

  // Backlog status update handler
  const handleUpdateBacklogStatus = async (
    ticketId: string | number,
    equipmentId: string,
    newStatus: 'sitting_in_office' | 'at_service_center' | 'ready_for_reinstall' | 'reinstalled'
  ) => {
    const targetTicket = complaintTickets.find(t => t.id === ticketId);
    if (!targetTicket) return;
    const current = targetTicket.siteEquipments || [];
    const updated = current.map((eq: SiteEquipmentItem) =>
      eq.id === equipmentId ? { ...eq, officeStatus: newStatus } : eq
    );
    const updatedTicket = { ...targetTicket, siteEquipments: updated };
    if (onUpdateComplaint) {
      onUpdateComplaint(ticketId, 'siteEquipments', updated);
    }
    if (onSaveComplaint) {
      await onSaveComplaint(ticketId, updatedTicket);
    }
    showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
  };

  // Backlog Standby unit recovery handler
  const handleRecoverStandbyInBacklog = async (ticketId: string | number, equipmentId: string) => {
    const targetTicket = complaintTickets.find(t => t.id === ticketId);
    if (!targetTicket) return;
    const current = targetTicket.siteEquipments || [];
    const today = new Date().toISOString().split('T')[0];
    const updated = current.map((eq: SiteEquipmentItem) =>
      eq.id === equipmentId ? { ...eq, tempDeviceRecoveryStatus: 'recovered' as const, tempDeviceRecoveryDate: today } : eq
    );
    const updatedTicket = { ...targetTicket, siteEquipments: updated };
    if (onUpdateComplaint) {
      onUpdateComplaint(ticketId, 'siteEquipments', updated);
    }
    if (onSaveComplaint) {
      await onSaveComplaint(ticketId, updatedTicket);
    }
    showToast(`Standby unit marked as recovered back to office locker!`);
  };

  // Backlog Delete handler
  const handleDeleteBacklogEquipment = async (ticketId: string | number, equipmentId: string) => {
    if (!confirm('Are you sure you want to delete this site equipment record?')) return;
    const targetTicket = complaintTickets.find(t => t.id === ticketId);
    if (!targetTicket) return;
    const current = targetTicket.siteEquipments || [];
    const updated = current.filter((eq: SiteEquipmentItem) => eq.id !== equipmentId);
    const updatedTicket = { ...targetTicket, siteEquipments: updated };
    if (onUpdateComplaint) {
      onUpdateComplaint(ticketId, 'siteEquipments', updated);
    }
    if (onSaveComplaint) {
      await onSaveComplaint(ticketId, updatedTicket);
    }
    showToast('Equipment record removed.');
  };

  // Modal: Add Site Equipment from Central Backlog View
  const [isAddBacklogModalOpen, setIsAddBacklogModalOpen] = useState(false);
  const [backlogFormTicketId, setBacklogFormTicketId] = useState<string | number>(
    complaintTickets.length > 0 ? complaintTickets[0].id : ''
  );
  const [backlogEquipmentForm, setBacklogEquipmentForm] = useState<{
    equipmentName: string;
    serialNumber: string;
    actionNeeded: 'repair' | 'replace';
    faultDescription: string;
    dateBroughtBack: string;
    officeStatus: 'sitting_in_office' | 'at_service_center' | 'ready_for_reinstall' | 'reinstalled';
    serviceCenterRef: string;
    notes: string;
    hasTemporaryDevice: boolean;
    tempDeviceName: string;
    tempDeviceSerial: string;
    tempDeviceDeployedDate: string;
    tempDeviceRecoveryStatus: 'deployed' | 'recovered';
  }>({
    equipmentName: '',
    serialNumber: '',
    actionNeeded: 'repair',
    faultDescription: '',
    dateBroughtBack: new Date().toISOString().split('T')[0],
    officeStatus: 'sitting_in_office',
    serviceCenterRef: '',
    notes: '',
    hasTemporaryDevice: true,
    tempDeviceName: '',
    tempDeviceSerial: '',
    tempDeviceDeployedDate: new Date().toISOString().split('T')[0],
    tempDeviceRecoveryStatus: 'deployed'
  });

  const handleSaveBacklogEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetTicket = complaintTickets.find(t => t.id === backlogFormTicketId);
    if (!targetTicket) {
      alert('Please select a valid complaint ticket.');
      return;
    }
    if (!backlogEquipmentForm.equipmentName.trim()) {
      alert('Please enter equipment name.');
      return;
    }

    const current = targetTicket.siteEquipments || [];
    const newItem: SiteEquipmentItem = {
      id: `eq-${Date.now()}`,
      ticketId: targetTicket.id,
      ticketNo: targetTicket.ticketNo || `TKT-${targetTicket.id}`,
      clientName: targetTicket.clientName,
      address: targetTicket.address,
      ...backlogEquipmentForm
    };

    const updated = [newItem, ...current];
    const updatedTicket = { ...targetTicket, siteEquipments: updated };

    if (onUpdateComplaint) {
      onUpdateComplaint(targetTicket.id, 'siteEquipments', updated);
    }
    if (onSaveComplaint) {
      await onSaveComplaint(targetTicket.id, updatedTicket);
    }

    setIsAddBacklogModalOpen(false);
    showToast(`Logged ${newItem.equipmentName} for ${targetTicket.ticketNo}!`);

    // Reset form
    setBacklogEquipmentForm({
      equipmentName: '',
      serialNumber: '',
      actionNeeded: 'repair',
      faultDescription: '',
      dateBroughtBack: new Date().toISOString().split('T')[0],
      officeStatus: 'sitting_in_office',
      serviceCenterRef: '',
      notes: '',
      hasTemporaryDevice: true,
      tempDeviceName: '',
      tempDeviceSerial: '',
      tempDeviceDeployedDate: new Date().toISOString().split('T')[0],
      tempDeviceRecoveryStatus: 'deployed'
    });
  };

  // WhatsApp Message Builder for Site Equipment
  const getBacklogWhatsAppUrl = (item: SiteEquipmentItem) => {
    const engName = item.engineer1 || 'Lead Engineer';
    const phone = getEngineerPhone(engName);
    const lines = [
      `*========================================*`,
      `*DIGITECH SERVICES | SITE HARDWARE DIRECTIVE*`,
      `*========================================*`,
      ``,
      `*Ticket ID:* ${item.ticketNo}`,
      `*Client:* ${item.clientName}`,
      `*Site Address:* ${item.address}`,
      ``,
      `*-- [EQUIPMENT DETAILS] --*`,
      `*Device:* ${item.equipmentName}`,
      item.serialNumber ? `*Serial No:* ${item.serialNumber}` : '',
      `*Action Needed:* ${item.actionNeeded === 'repair' ? 'REPAIR' : 'REPLACEMENT'}`,
      `*Office Status:* ${item.officeStatus.toUpperCase().replace(/_/g, ' ')}`,
      item.serviceCenterRef ? `*Service Ref:* ${item.serviceCenterRef}` : '',
      ``,
      item.hasTemporaryDevice ? [
        `*-- [STANDBY LOANER AT SITE] --*`,
        `*Temporary Device:* ${item.tempDeviceName || 'Loaner Unit'}`,
        item.tempDeviceSerial ? `*Standby S/N:* ${item.tempDeviceSerial}` : '',
        `*Recovery Status:* ${item.tempDeviceRecoveryStatus === 'deployed' ? 'STILL ON SITE (MUST BE RECOVERED)' : 'RECOVERED TO OFFICE'}`
      ].filter(Boolean).join('\n') : '',
      ``,
      `*-- [OPERATIONAL DIRECTIVE] --*`,
      item.officeStatus === 'ready_for_reinstall' 
        ? `>> Collect repaired/replaced unit from Digitech office.\n>> Reinstall at client site and RECOVER temporary standby unit [${item.tempDeviceName || 'loaner unit'}] back to office!`
        : item.officeStatus === 'sitting_in_office'
        ? `>> Hardware is sitting in office backlog. Please prioritize bench testing or dispatch to vendor service center.`
        : `>> Coordinate hardware swap & site attendance with client.`,
      ``,
      `*========================================*`,
      `*DIGITECH HMS ASSET MANAGEMENT*`,
      `*========================================*`
    ].filter(Boolean);
    return `https://wa.me/91${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // --- NEW TOOL FORM STATE ---
  const [newToolForm, setNewToolForm] = useState({
    toolName: '',
    assetTag: '',
    category: 'CCTV Tools' as ToolCategory,
    assignedEngineer: 'Abdul Latif',
    expectedReturnDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    linkedTicket: '',
    notes: ''
  });

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
    setReturnModalTarget(null);
    setReturnRemarks('');
    showToast(`Tool ${returnModalTarget.assetTag} marked as returned in good order!`);
  };

  // Filtered Company Tools List
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
          tool.assignedEngineer,
          tool.linkedTicket,
          tool.notes,
          tool.category
        ].map(v => v?.toLowerCase() || '').join(' ');
        if (!pool.includes(q)) return false;
      }
      return true;
    });
  }, [tools, statusFilter, engineerFilter, categoryFilter, searchQuery]);

  // Tools KPI Statistics
  const stats = useMemo(() => {
    const total = tools.length;
    const issued = tools.filter(t => t.status === 'Issued').length;
    const overdue = tools.filter(t => t.status === 'Overdue').length;
    const returned = tools.filter(t => t.status === 'Returned').length;
    return { total, issued, overdue, returned };
  }, [tools]);

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
            <span>Tools & Equipment Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage company tool issuance to technicians and track customer hardware brought back for repair/replacement with standby device logging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'tools' ? (
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#be123c] hover:to-[#9f1239] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-950/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Issue Tool to Engineer</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (complaintTickets.length > 0) {
                  setBacklogFormTicketId(complaintTickets[0].id);
                }
                setIsAddBacklogModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Log Equipment Brought from Site</span>
            </button>
          )}
        </div>
      </div>

      {/* DUAL TAB SWITCHER */}
      <div className="px-8 bg-white border-b border-gray-200 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('tools')}
          className={`py-3.5 px-2 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'tools'
              ? 'border-[#be123c] text-[#be123c]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Company Tools Locker</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gray-100 text-gray-700">
            {tools.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backlog')}
          className={`py-3.5 px-2 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'backlog'
              ? 'border-[#be123c] text-[#be123c]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Site Equipment: Repair & Replacement Backlog</span>
          {backlogStats.sittingCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse">
              {backlogStats.sittingCount} in office
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gray-100 text-gray-700">
              {allSiteEquipments.length}
            </span>
          )}
          {backlogStats.activeStandbyCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
              {backlogStats.activeStandbyCount} standby deployed
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COMPANY TOOLS LOCKER                              */}
      {/* ======================================================== */}
      {activeTab === 'tools' ? (
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

          {/* Search, Filter Bar */}
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

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
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
                                  <p className="text-[11px] text-gray-500 italic mt-1 line-clamp-1">
                                    &ldquo;{item.notes}&rdquo;
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Assigned Engineer */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="space-y-0.5">
                              <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-gray-400" />
                                <span>{item.assignedEngineer}</span>
                              </div>
                              <div className="font-mono text-[11px] text-emerald-700 font-semibold pl-5">
                                +91 {item.engineerContact}
                              </div>
                            </div>
                          </td>

                          {/* Col 3: Schedule & Due */}
                          <td className="py-3.5 px-4 align-top font-mono text-xs">
                            <div className="space-y-1">
                              <div className="text-gray-500 text-[11px]">
                                Out: <span className="text-gray-800 font-medium">{item.issuedDate}</span>
                              </div>
                              <div className="text-gray-500 text-[11px]">
                                Due: <span className={`font-bold ${isOverdue ? 'text-rose-600' : 'text-gray-800'}`}>
                                  {item.expectedReturnDate}
                                </span>
                              </div>
                              {item.returnDate && (
                                <div className="text-emerald-700 text-[10px] font-bold">
                                  Returned: {item.returnDate}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Col 4: Condition & Status */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="space-y-1.5">
                              <div>
                                {isIssued && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    <span>Issued</span>
                                  </span>
                                )}
                                {isOverdue && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                                    <span>Overdue</span>
                                  </span>
                                )}
                                {isReturned && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Returned</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500">
                                Cond: <strong className="text-gray-700">{item.condition}</strong>
                              </div>
                            </div>
                          </td>

                          {/* Col 5: Actions */}
                          <td className="py-3.5 px-4 pr-5 align-top text-right">
                            <div className="flex flex-col items-end gap-1.5">
                              {(isIssued || isOverdue) && (
                                <>
                                  <button
                                    onClick={() => {
                                      setReturnModalTarget(item);
                                      setReturnCondition('Good');
                                      setReturnRemarks('');
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                                  >
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>Return</span>
                                  </button>

                                  <a
                                    href={getToolWhatsAppUrl(item)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                                    title={`Send Return Notice to ${item.assignedEngineer} (+91 ${item.engineerContact})`}
                                  >
                                    <Send className="w-3 h-3 text-emerald-600" />
                                    <span>WhatsApp Reminder</span>
                                  </a>
                                </>
                              )}

                              {isReturned && (
                                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>In Locker</span>
                                </span>
                              )}
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
      ) : (
        /* ======================================================== */
        /* TAB 2: SITE EQUIPMENT REPAIR & REPLACEMENT BACKLOG       */
        /* ======================================================== */
        <div className="p-8 space-y-6">

          {/* KPI Metric Summary Strip for Backlog & Standby Tracker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Sitting in Office Backlog (High Attention Alert) */}
            <div 
              onClick={() => setBacklogStatusFilter(backlogStatusFilter === 'sitting_in_office' ? 'All' : 'sitting_in_office')}
              className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
                backlogStatusFilter === 'sitting_in_office' 
                  ? 'border-red-500 ring-2 ring-red-200' 
                  : backlogStats.sittingCount > 0 
                  ? 'border-red-300 bg-red-50/20 hover:border-red-400' 
                  : 'border-gray-200'
              }`}
            >
              <div>
                <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                  <span>Sitting in Office (Backlog)</span>
                  {backlogStats.sittingCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </p>
                <p className="text-2xl font-black text-red-700 mt-0.5 font-mono">{backlogStats.sittingCount}</p>
                <span className="text-[10px] text-red-600 font-medium">Pending action &bull; causing clutter</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>

            {/* Card 2: At Service Center / Vendor RMA */}
            <div 
              onClick={() => setBacklogStatusFilter(backlogStatusFilter === 'at_service_center' ? 'All' : 'at_service_center')}
              className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
                backlogStatusFilter === 'at_service_center' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              <div>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">At Service Center / RMA</p>
                <p className="text-2xl font-black text-amber-700 mt-0.5 font-mono">{backlogStats.serviceCenterCount}</p>
                <span className="text-[10px] text-amber-600 font-medium">Under warranty or bench repair</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Wrench className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            {/* Card 3: Ready for Site Reinstallation */}
            <div 
              onClick={() => setBacklogStatusFilter(backlogStatusFilter === 'ready_for_reinstall' ? 'All' : 'ready_for_reinstall')}
              className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
                backlogStatusFilter === 'ready_for_reinstall' ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-emerald-200 hover:border-emerald-400'
              }`}
            >
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Ready for Site</p>
                <p className="text-2xl font-black text-emerald-700 mt-0.5 font-mono">{backlogStats.readyCount}</p>
                <span className="text-[10px] text-emerald-600 font-medium">Repaired & ready to reinstall</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            {/* Card 4: Active Standby Units Deployed on Site (Recovery Alert) */}
            <div 
              onClick={() => setBacklogStandbyFilter(backlogStandbyFilter === 'deployed' ? 'All' : 'deployed')}
              className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
                backlogStandbyFilter === 'deployed' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-200 hover:border-purple-400'
              }`}
            >
              <div>
                <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Standby Deployed on Site</p>
                <p className="text-2xl font-black text-purple-700 mt-0.5 font-mono">{backlogStats.activeStandbyCount}</p>
                <span className="text-[10px] text-purple-600 font-medium">Temporary devices awaiting recovery</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <HardDrive className="w-5 h-5 text-purple-600" />
              </div>
            </div>

          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket, customer, device, serial, or standby ID..."
                value={backlogSearch}
                onChange={e => setBacklogSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              
              {/* Action Filter */}
              <select
                value={backlogActionFilter}
                onChange={e => setBacklogActionFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="All">All Actions (Repair / Replace)</option>
                <option value="repair">🔧 Needs Repair</option>
                <option value="replace">🔄 Needs Replacement</option>
              </select>

              {/* Status Filter */}
              <select
                value={backlogStatusFilter}
                onChange={e => setBacklogStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="All">All Office Statuses</option>
                <option value="sitting_in_office">🔴 Sitting in Office Backlog</option>
                <option value="at_service_center">🟡 At Service Center / RMA</option>
                <option value="ready_for_reinstall">🟢 Ready for Site</option>
                <option value="reinstalled">✅ Reinstalled at Site</option>
              </select>

              {/* Standby Filter */}
              <select
                value={backlogStandbyFilter}
                onChange={e => setBacklogStandbyFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="All">All Standby Statuses</option>
                <option value="deployed">⚠️ Standby Deployed on Site</option>
                <option value="recovered">✅ Standby Recovered to Locker</option>
                <option value="none">No Standby Attached</option>
              </select>

              {(backlogActionFilter !== 'All' || backlogStatusFilter !== 'All' || backlogStandbyFilter !== 'All' || backlogSearch) && (
                <button
                  onClick={() => {
                    setBacklogActionFilter('All');
                    setBacklogStatusFilter('All');
                    setBacklogStandbyFilter('All');
                    setBacklogSearch('');
                  }}
                  className="px-2.5 py-2 text-xs text-amber-600 hover:text-amber-800 font-medium underline"
                >
                  Clear
                </button>
              )}
            </div>

          </div>

          {/* Backlog Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
              <div className="flex items-center gap-2">
                <span>Site Equipment Backlog & Standby Devices</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-700">
                  {filteredBacklog.length} records
                </span>
              </div>
              <span className="text-[11px] font-normal text-gray-400 capitalize">
                Click any ticket number to view the complaint in Admin Inbox
              </span>
            </div>

            {filteredBacklog.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
                <RotateCcw className="w-10 h-10 mx-auto text-gray-300" />
                <h3 className="font-bold text-gray-800 text-sm">No Site Equipment Records Found</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  When hardware is brought back from a customer site for repair or replacement, log it here or in Step 2 of the ticket. This keeps the office clear of clutter and tracks loaner devices deployed in the field.
                </p>
                <button
                  onClick={() => {
                    if (complaintTickets.length > 0) {
                      setBacklogFormTicketId(complaintTickets[0].id);
                    }
                    setIsAddBacklogModalOpen(true);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Log Equipment Brought from Site</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBacklog.map(item => {
                  const isSittingInOffice = item.officeStatus === 'sitting_in_office';
                  const isReady = item.officeStatus === 'ready_for_reinstall';
                  const isStandbyActive = item.hasTemporaryDevice && item.tempDeviceRecoveryStatus === 'deployed';

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border bg-white shadow-sm space-y-3.5 transition-all ${
                        isSittingInOffice 
                          ? 'border-red-300 ring-1 ring-red-200' 
                          : isReady 
                          ? 'border-emerald-300 ring-1 ring-emerald-200' 
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {/* Ticket Pill with jump button */}
                          <button
                            type="button"
                            onClick={() => onSelectTicket?.(item.ticketId)}
                            className="font-mono font-bold text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 shadow-sm transition-all"
                            title="Jump directly to this ticket in Inbox"
                          >
                            <span>{item.ticketNo}</span>
                            <ExternalLink className="w-3 h-3 text-blue-500" />
                          </button>

                          {/* Client & Address */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <span className="font-bold text-gray-900">{item.clientName}</span>
                            <span>&bull;</span>
                            <span className="text-gray-500">{item.address}</span>
                          </div>

                          {/* Action Badge */}
                          {item.actionNeeded === 'repair' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <Wrench className="w-3 h-3 text-amber-700" />
                              <span>Needs Repair</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                              <RotateCw className="w-3 h-3 text-purple-700" />
                              <span>Needs Replacement</span>
                            </span>
                          )}
                        </div>

                        {/* Status Dropdown and Delete */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="text-[11px] text-gray-500 font-medium">Office Status:</label>
                          <select
                            value={item.officeStatus}
                            onChange={e => handleUpdateBacklogStatus(item.ticketId, item.id, e.target.value as any)}
                            className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none shadow-sm cursor-pointer ${
                              item.officeStatus === 'sitting_in_office'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : item.officeStatus === 'at_service_center'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : item.officeStatus === 'ready_for_reinstall'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            <option value="sitting_in_office">🔴 Sitting in Office (Backlog / Needs Action)</option>
                            <option value="at_service_center">🟡 Sent to Service Center / Vendor RMA</option>
                            <option value="ready_for_reinstall">🟢 Repaired / Replacement Arrived (Ready for Site)</option>
                            <option value="reinstalled">✅ Reinstalled at Site (Closed)</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteBacklogEquipment(item.ticketId, item.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove equipment entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Equipment Details Card */}
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">
                            Hardware & Serial
                          </span>
                          <div className="font-bold text-gray-900 text-sm">{item.equipmentName}</div>
                          {item.serialNumber ? (
                            <div className="font-mono text-gray-600 text-[11px]">S/N: {item.serialNumber}</div>
                          ) : (
                            <div className="text-gray-400 text-[11px] italic">No serial number logged</div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">
                            Fault Observation
                          </span>
                          <p className="text-gray-800 font-medium text-[11px]">
                            {item.faultDescription || 'No description provided.'}
                          </p>
                          {item.serviceCenterRef && (
                            <div className="text-[10px] font-mono font-bold text-blue-700">
                              Service Ref: {item.serviceCenterRef}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 md:text-right">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">
                            Dates & Assigned Lead
                          </span>
                          <div className="text-gray-600 text-[11px]">
                            Brought to office: <span className="font-mono font-semibold text-gray-900">{item.dateBroughtBack}</span>
                          </div>
                          {item.engineer1 && (
                            <div className="text-[11px] text-gray-700">
                              Lead: <strong className="text-gray-900">{item.engineer1}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Standby Device Row */}
                      {item.hasTemporaryDevice ? (
                        <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                          isStandbyActive
                            ? 'bg-amber-50/70 border-amber-300'
                            : 'bg-emerald-50/40 border-emerald-200'
                        }`}>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[11px]">
                              <HardDrive className={`w-3.5 h-3.5 ${isStandbyActive ? 'text-amber-600' : 'text-emerald-600'}`} />
                              <span>Temporary Standby Device Installed at Site:</span>
                            </div>
                            <div className="text-[11px] text-gray-800">
                              <span className="font-bold">{item.tempDeviceName || 'Standby Loaner'}</span>
                              {item.tempDeviceSerial && (
                                <span className="font-mono text-gray-600 ml-1.5">({item.tempDeviceSerial})</span>
                              )}
                              {item.tempDeviceDeployedDate && (
                                <span className="text-gray-500 ml-2">Deployed on {item.tempDeviceDeployedDate}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isStandbyActive ? (
                              <>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                  ⚠️ Active Standby on Site (Needs Recovery)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRecoverStandbyInBacklog(item.ticketId, item.id)}
                                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-sm transition-all"
                                  title="Click when repaired unit is reinstalled and standby unit is returned to office"
                                >
                                  ✓ Mark Standby Recovered to Office
                                </button>
                              </>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Standby Recovered to Locker {item.tempDeviceRecoveryDate ? `(${item.tempDeviceRecoveryDate})` : ''}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400 italic">
                          No temporary standby device attached for this equipment.
                        </div>
                      )}

                      {/* Direct WhatsApp Action for Engineer */}
                      {item.engineer1 && (
                        <div className="pt-1 flex items-center justify-between text-xs border-t border-gray-100">
                          <span className="text-gray-500 text-[11px]">
                            Assigned Lead: <strong className="text-gray-800">{item.engineer1}</strong> (+91 {getEngineerPhone(item.engineer1)})
                          </span>
                          <a
                            href={getBacklogWhatsAppUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 hover:underline text-xs"
                            title={`Send direct hardware directive to ${item.engineer1} on WhatsApp`}
                          >
                            <Send className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Notify {item.engineer1} on WhatsApp &rarr;</span>
                          </a>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ISSUE COMPANY TOOL TO ENGINEER                  */}
      {/* ======================================================== */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Issue Equipment to Engineer</h2>
                  <p className="text-xs text-rose-100">Track company tools handed over for field duties</p>
                </div>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1 rounded-lg text-rose-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueTool} className="p-6 space-y-4 overflow-y-auto text-xs">
              
              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Equipment / Tool Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bosch Rotary Hammer Drill GBH 220, Optical Power Meter..."
                  value={newToolForm.toolName}
                  onChange={e => setNewToolForm({ ...newToolForm, toolName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Asset Tag / Serial ID
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty (e.g. DT-TL-109)"
                    value={newToolForm.assetTag}
                    onChange={e => setNewToolForm({ ...newToolForm, assetTag: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Tool Category *
                  </label>
                  <select
                    value={newToolForm.category}
                    onChange={e => setNewToolForm({ ...newToolForm, category: e.target.value as ToolCategory })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    <option value="CCTV Tools">CCTV Tools</option>
                    <option value="Fiber Tools">Fiber Tools</option>
                    <option value="Power Tools">Power Tools</option>
                    <option value="Network Testers">Network Testers</option>
                    <option value="Safety & Access">Safety & Access</option>
                    <option value="Measuring & Splicing">Measuring & Splicing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Assign to Field Engineer *
                  </label>
                  <select
                    value={newToolForm.assignedEngineer}
                    onChange={e => setNewToolForm({ ...newToolForm, assignedEngineer: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    {ROSTER_ENGINEERS.map(eng => (
                      <option key={eng} value={eng}>{eng}</option>
                    ))}
                  </select>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Contact: +91 {getEngineerPhone(newToolForm.assignedEngineer)}
                  </span>
                </div>

                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Expected Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newToolForm.expectedReturnDate}
                    onChange={e => setNewToolForm({ ...newToolForm, expectedReturnDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Linked Complaint / Project Ticket
                </label>
                <select
                  value={newToolForm.linkedTicket}
                  onChange={e => setNewToolForm({ ...newToolForm, linkedTicket: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                >
                  <option value="">General Field Operations</option>
                  {complaintTickets.map(t => (
                    <option key={t.id} value={t.ticketNo || `TKT-${t.id}`}>
                      {t.ticketNo || `TKT-${t.id}`} &bull; {t.clientName || 'Client'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Accessories Issued / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Issued with concrete bits, extra battery, carry case..."
                  value={newToolForm.notes}
                  onChange={e => setNewToolForm({ ...newToolForm, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
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

      {/* ======================================================== */}
      {/* MODAL 3: LOG SITE EQUIPMENT FROM CENTRAL BACKLOG VIEW    */}
      {/* ======================================================== */}
      {isAddBacklogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-700 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Log Equipment Brought from Site</h2>
                  <p className="text-xs text-amber-100">Record faulty customer hardware & standby loaner units</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddBacklogModalOpen(false)}
                className="p-1 rounded-lg text-amber-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBacklogEquipment} className="p-6 space-y-4 overflow-y-auto text-xs">
              
              {/* Select Ticket */}
              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Select Complaint Ticket *
                </label>
                <select
                  value={backlogFormTicketId}
                  onChange={e => setBacklogFormTicketId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  {complaintTickets.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.ticketNo || `TKT-${t.id}`} &bull; {t.clientName || 'Client'} ({t.address || 'Address'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hardware Name & Serial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Equipment / Hardware Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CP Plus 8-Ch Turbo DVR, 4MP Dome..."
                    value={backlogEquipmentForm.equipmentName}
                    onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, equipmentName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Serial Number / Asset Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CP-DVR-88129"
                    value={backlogEquipmentForm.serialNumber}
                    onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, serialNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Action Required */}
              <div>
                <label className="text-gray-700 font-bold block mb-1.5">
                  Action Required on Hardware *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBacklogEquipmentForm({ ...backlogEquipmentForm, actionNeeded: 'repair' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center gap-2 transition-all ${
                      backlogEquipmentForm.actionNeeded === 'repair'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-200'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <div>
                      <div>🔧 Needs Repair</div>
                      <div className="text-[10px] font-normal text-gray-500">Service Center / Bench</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBacklogEquipmentForm({ ...backlogEquipmentForm, actionNeeded: 'replace' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center gap-2 transition-all ${
                      backlogEquipmentForm.actionNeeded === 'replace'
                        ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-200'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <RotateCw className="w-4 h-4 text-purple-600" />
                    <div>
                      <div>🔄 Needs Replacement</div>
                      <div className="text-[10px] font-normal text-gray-500">Warranty RMA / New Unit</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Fault description */}
              <div>
                <label className="text-gray-700 font-bold block mb-1">
                  Fault / Problem Observation *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Specify symptom: e.g. Port 3 & 4 video loss, power supply clicking, water in lens..."
                  value={backlogEquipmentForm.faultDescription}
                  onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, faultDescription: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Dates and Office Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Date Brought Back to Office
                  </label>
                  <input
                    type="date"
                    value={backlogEquipmentForm.dateBroughtBack}
                    onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, dateBroughtBack: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Office Handling Status *
                  </label>
                  <select
                    value={backlogEquipmentForm.officeStatus}
                    onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, officeStatus: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    <option value="sitting_in_office">🔴 Sitting in Office (Backlog / Needs Action)</option>
                    <option value="at_service_center">🟡 Sent to Service Center / Vendor RMA</option>
                    <option value="ready_for_reinstall">🟢 Repaired / Replacement Arrived (Ready for Site)</option>
                    <option value="reinstalled">✅ Reinstalled at Site (Closed)</option>
                  </select>
                </div>
              </div>

              {/* Service Center Ref & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Service Center / RMA Job Sheet Ref
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RMA-HK-2026-881"
                    value={backlogEquipmentForm.serviceCenterRef}
                    onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, serviceCenterRef: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-bold block mb-1">
                    Internal Office Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Placed in rack shelf 2"
                    value={backlogEquipmentForm.notes}
                    onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Temporary Standby Device Section */}
              <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={backlogEquipmentForm.hasTemporaryDevice}
                      onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, hasTemporaryDevice: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                    />
                    <span className="font-bold text-gray-900 text-xs">
                      Temporary Standby Device Installed at Site
                    </span>
                  </label>
                  <span className="text-[10px] text-amber-800 font-medium">Prevents client site downtime</span>
                </div>

                {backlogEquipmentForm.hasTemporaryDevice && (
                  <div className="space-y-3 pt-2 border-t border-amber-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-gray-700 font-medium block mb-1 text-[11px]">
                          Temporary Device Model / Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Digitech Loaner 4-Ch DVR"
                          value={backlogEquipmentForm.tempDeviceName}
                          onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, tempDeviceName: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 font-medium block mb-1 text-[11px]">
                          Standby Serial / Asset ID
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. SBY-DVR-02"
                          value={backlogEquipmentForm.tempDeviceSerial}
                          onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, tempDeviceSerial: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-gray-700 font-medium block mb-1 text-[11px]">
                          Date Deployed at Site
                        </label>
                        <input
                          type="date"
                          value={backlogEquipmentForm.tempDeviceDeployedDate}
                          onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, tempDeviceDeployedDate: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 font-medium block mb-1 text-[11px]">
                          Standby Recovery Status
                        </label>
                        <select
                          value={backlogEquipmentForm.tempDeviceRecoveryStatus}
                          onChange={e => setBacklogEquipmentForm({ ...backlogEquipmentForm, tempDeviceRecoveryStatus: e.target.value as any })}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        >
                          <option value="deployed">⚠️ Currently Deployed at Site (Needs Recovery)</option>
                          <option value="recovered">✅ Recovered Back to Office Locker</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBacklogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Equipment Record</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
