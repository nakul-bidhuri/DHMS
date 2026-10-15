'use client';
import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, MessageCircle, Mail, ArrowRight, ExternalLink } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    contactPerson: '',
    contactNumber: '',
    address: '',
    complaintType: 'CCTV',
    problem: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [registeredComplaint, setRegisteredComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegisteredComplaint(data.complaint);
        setSubmitted(true);
      } else {
        alert('Could not submit complaint. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering complaint. Please check your connection.');
    }
    setLoading(false);
  };

  const getNotificationText = () => {
    if (!registeredComplaint) return '';
    return [
      'New Complaint Registered on Digitech HMS!',
      'Ticket No: ' + registeredComplaint.ticketNo,
      'Client: ' + registeredComplaint.clientName,
      'Contact: ' + registeredComplaint.contactPerson + ' (' + registeredComplaint.contactNumber + ')',
      'Email: ' + (registeredComplaint.clientEmail || 'N/A'),
      'Address: ' + registeredComplaint.address,
      'System Type: ' + registeredComplaint.complaintType,
      'Problem: ' + registeredComplaint.problem
    ].join('\n');
  };

  if (submitted && registeredComplaint) {
    const notifMsg = getNotificationText();
    const whatsappUrl = `https://wa.me/919999760222?text=${encodeURIComponent(notifMsg)}`;
    const emailUrl = `mailto:vineet@digitechservices.net?subject=${encodeURIComponent(
      'New Complaint: ' + registeredComplaint.ticketNo + ' - ' + registeredComplaint.clientName
    )}&body=${encodeURIComponent(notifMsg)}`;

    return (
      <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-[#0b132b] rounded-2xl shadow-2xl border border-white/10 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white mb-1">Complaint Registered!</h2>
            <p className="text-xs text-slate-400">Your complaint has been saved to the Digitech database.</p>
          </div>

          {/* Ticket Information Card */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Ticket Number</span>
              <span className="font-mono font-bold text-sm text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                {registeredComplaint.ticketNo}
              </span>
            </div>
            <div className="text-xs text-slate-200">
              <span className="text-slate-400">Client:</span> <strong>{registeredComplaint.clientName}</strong>
            </div>
            <div className="text-xs text-slate-200">
              <span className="text-slate-400">Issue:</span> {registeredComplaint.problem}
            </div>
          </div>

          {/* Instant Notifications Section */}
          <div className="space-y-2.5 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-left">
              Send Instant Notifications
            </div>

            {/* WhatsApp Notification Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send to WhatsApp (9999760222)</span>
            </a>

            {/* Gmail Notification Button */}
            <a
              href={emailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Send via Gmail (vineet@digitechservices.net)</span>
            </a>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
            <button
              onClick={() => {
                setFormData({
                  clientName: '',
                  clientEmail: '',
                  contactPerson: '',
                  contactNumber: '',
                  address: '',
                  complaintType: 'CCTV',
                  problem: ''
                });
                setSubmitted(false);
              }}
              className="text-slate-400 hover:text-white font-medium"
            >
              Register Another
            </button>
            <a
              href="/admin"
              className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              <span>View in Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#020617] p-6 text-white text-center border-b border-white/10">
          <div className="inline-block mb-2">
            <span className="text-2xl font-black tracking-tight text-white">
              DIGITECH<span className="text-red-500">.</span>
            </span>
          </div>
          <h2 className="text-xl font-bold">Complaint Registration</h2>
          <p className="text-gray-400 text-xs mt-1">Submit your service or maintenance request directly to our dispatch desk</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Client / Company Name *</label>
            <input 
              required 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:ring-2 focus:ring-red-500 focus:outline-none" 
              placeholder="e.g. Acme Corp / Hotel Grand"
              value={formData.clientName} 
              onChange={e => setFormData({...formData, clientName: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Client Email Address *</label>
            <input 
              required 
              type="email" 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:ring-2 focus:ring-red-500 focus:outline-none" 
              placeholder="e.g. client@example.com"
              value={formData.clientEmail} 
              onChange={e => setFormData({...formData, clientEmail: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Person *</label>
              <input 
                required 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:ring-2 focus:ring-red-500 focus:outline-none" 
                placeholder="Name"
                value={formData.contactPerson} 
                onChange={e => setFormData({...formData, contactPerson: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Number *</label>
              <input 
                required 
                type="tel" 
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:ring-2 focus:ring-red-500 focus:outline-none" 
                placeholder="Phone number"
                value={formData.contactNumber} 
                onChange={e => setFormData({...formData, contactNumber: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Site / Facility Address *</label>
            <input 
              required 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:ring-2 focus:ring-red-500 focus:outline-none" 
              placeholder="Location details"
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">System Type *</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.complaintType} 
              onChange={e => setFormData({...formData, complaintType: e.target.value})}
            >
              <option>CCTV</option>
              <option>Access Control System</option>
              <option>Fire Alarm System</option>
              <option>EPABX</option>
              <option>Networking & Data</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Problem Description *</label>
            <textarea 
              required 
              rows={4} 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:ring-2 focus:ring-red-500 focus:outline-none" 
              placeholder="Describe the issue in detail..."
              value={formData.problem} 
              onChange={e => setFormData({...formData, problem: e.target.value})}
            ></textarea>
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-[#E53935] hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Submitting to Dispatch...' : 'Register Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
