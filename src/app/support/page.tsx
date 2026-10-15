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
        // Guaranteed automatic email notification to vineet@digitechservices.net
        try {
          fetch('https://formsubmit.co/ajax/vineet@digitechservices.net', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              _subject: `New Service Complaint: ${data.complaint.ticketNo} - ${data.complaint.clientName}`,
              ticketNo: data.complaint.ticketNo,
              clientName: data.complaint.clientName,
              clientEmail: data.complaint.clientEmail,
              contactPerson: `${data.complaint.contactPerson} (${data.complaint.contactNumber})`,
              siteAddress: data.complaint.address,
              systemType: data.complaint.complaintType,
              problem: data.complaint.problem
            })
          }).catch(() => {});
        } catch (e) {}
      } else {
        alert('Could not submit complaint. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering complaint. Please check your connection.');
    }
    setLoading(false);
  };

  if (submitted && registeredComplaint) {
    return (
      <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-[#0b132b] rounded-2xl shadow-2xl border border-white/10 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white mb-1.5">
              Complaint Registered Successfully!
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your service request has been logged into the Digitech system. Our technical team has been notified via email and will reach out to you shortly.
            </p>
          </div>

          {/* Ticket Information Card */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Ticket Number</span>
              <span className="font-mono font-bold text-sm text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                {registeredComplaint.ticketNo}
              </span>
            </div>
            <div className="text-xs text-slate-200">
              <span className="text-slate-400">Client:</span> <strong>{registeredComplaint.clientName}</strong>
            </div>
            <div className="text-xs text-slate-200">
              <span className="text-slate-400">System:</span> {registeredComplaint.complaintType}
            </div>
            <div className="text-xs text-slate-200">
              <span className="text-slate-400">Issue:</span> {registeredComplaint.problem}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Dispatch Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Logged & Notified
              </span>
            </div>
          </div>

          {/* Bottom Action: Client Register Another */}
          <div className="pt-2">
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
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-all shadow-sm"
            >
              Register Another Complaint
            </button>
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
          <div className="flex justify-center mb-3">
            <img 
              src="/digitech-logo.png" 
              alt="Digitech" 
              className="h-9 w-auto max-w-[190px] object-contain"
            />
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
