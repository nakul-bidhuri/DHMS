'use client';
import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    clientName: '',
    contactPerson: '',
    contactNumber: '',
    address: '',
    complaintType: 'CCTV',
    problem: ''
  });
  const [submitted, setSubmitted] = useState(false);
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
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Successfully Registered</h2>
          <p className="text-gray-600 mb-6">Your complaint has been successfully registered. Our administration team will contact you shortly.</p>
          <button onClick={() => setSubmitted(false)} className="px-6 py-2 bg-digitech-red text-white rounded-md font-medium hover:bg-red-700">
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#020617] p-6 text-white text-center">
          <ShieldCheck className="w-12 h-12 text-digitech-red mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Complaint Registration</h2>
          <p className="text-gray-400 text-sm mt-1">Register your service or maintenance request</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client / Company Name *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-md p-2" 
              value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
              <input required type="text" className="w-full border border-gray-300 rounded-md p-2" 
                value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input required type="tel" className="w-full border border-gray-300 rounded-md p-2" 
                value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Address *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-md p-2" 
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Type *</label>
            <select className="w-full border border-gray-300 rounded-md p-2"
              value={formData.complaintType} onChange={e => setFormData({...formData, complaintType: e.target.value})}>
              <option>CCTV</option>
              <option>Access Control System</option>
              <option>Fire Alarm System</option>
              <option>EPABX</option>
              <option>Networking & Data</option>
              <option>Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description *</label>
            <textarea required rows={4} className="w-full border border-gray-300 rounded-md p-2" placeholder="Describe the issue you are facing..."
              value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})}></textarea>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-digitech-red hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors">
            {loading ? 'Submitting...' : 'Register Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
