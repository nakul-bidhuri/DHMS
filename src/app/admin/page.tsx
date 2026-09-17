'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      });
  }, []);

  const updateComplaint = async (id: number, field: string, value: string) => {
    // Optimistic UI update
    const updated = complaints.map(c => c.id === id ? { ...c, [field]: value } : c);
    setComplaints(updated);

    try {
      await fetch('/api/complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-[100vw] mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Actions */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky left-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Admin Complaint Tracker</h2>
            <p className="text-sm text-gray-500">Manage and track engineer assignments and ticket resolutions.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Search tickets..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr>
                <th colSpan={8} className="bg-orange-200 text-orange-900 border-b border-r border-orange-300 py-3 px-4 text-center font-bold text-sm">
                  STEP -01- (Call Registration)
                </th>
                <th colSpan={13} className="bg-green-300 text-green-900 border-b border-green-400 py-3 px-4 text-center font-bold text-sm">
                  STEP -02- (Call Attend Status)
                </th>
              </tr>
              <tr className="bg-gray-50 text-gray-700 font-semibold">
                {/* Step 1 */}
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-orange-50 sticky left-0 z-10">S.No</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-orange-50 sticky left-[60px] z-10">Date</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-orange-50">Type/Nature of Complaint</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-orange-50">Complaint/Ticket No</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-orange-50">Client Name</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-orange-50">Address</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-orange-50">Contact Person</th>
                <th className="border-b border-r border-orange-200 py-3 px-4 bg-orange-50">Contact Number</th>

                {/* Step 2 */}
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Assigned Date</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Assigned to Engineer-01</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Assigned to Engineer-02</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Problem / Reason</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Finding / Observation / Reason</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Solution Provided / Action Taken</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Materials</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Rectification Type</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Used material</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Required Material</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Remarks</th>
                <th className="border-b border-r border-gray-200 py-3 px-4 bg-green-50">Status</th>
                <th className="border-b border-gray-200 py-3 px-4 bg-green-50">Final Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={21} className="py-8 text-center text-gray-500">Loading complaints...</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan={21} className="py-8 text-center text-gray-500">No complaints found.</td></tr>
              ) : (
                complaints.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                    {/* Read-Only Client Data */}
                    <td className="py-2 px-4 border-r border-gray-200 sticky left-0 bg-white z-10">{idx + 1}</td>
                    <td className="py-2 px-4 border-r border-gray-200 sticky left-[60px] bg-white z-10">{item.date}</td>
                    <td className="py-2 px-4 border-r border-gray-200">{item.complaintType}</td>
                    <td className="py-2 px-4 border-r border-gray-200 font-medium text-blue-600">{item.ticketNo}</td>
                    <td className="py-2 px-4 border-r border-gray-200">{item.clientName}</td>
                    <td className="py-2 px-4 border-r border-gray-200">{item.address}</td>
                    <td className="py-2 px-4 border-r border-gray-200">{item.contactPerson}</td>
                    <td className="py-2 px-4 border-r border-gray-200 border-r-orange-200">{item.contactNumber}</td>

                    {/* Editable Admin Data */}
                    <td className="py-2 px-4 border-r border-gray-200">
                      <input type="date" className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1"
                        value={item.assignedDate} onChange={e => updateComplaint(item.id, 'assignedDate', e.target.value)} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <select className="w-full border border-gray-300 rounded p-1 text-sm bg-white"
                        value={item.engineer1} onChange={e => updateComplaint(item.id, 'engineer1', e.target.value)}>
                        <option value="">Select Engineer</option>
                        <option>Abdul</option>
                        <option>Sharukh</option>
                        <option>Govind</option>
                        <option>Himanshu</option>
                        <option>Ashish</option>
                        <option>Zubair</option>
                        <option>Other</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <select className="w-full border border-gray-300 rounded p-1 text-sm bg-white"
                        value={item.engineer2} onChange={e => updateComplaint(item.id, 'engineer2', e.target.value)}>
                        <option value="">Select Engineer</option>
                        <option>Abdul</option>
                        <option>Sharukh</option>
                        <option>Govind</option>
                        <option>Himanshu</option>
                        <option>Ashish</option>
                        <option>Zubair</option>
                        <option>Other</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <select className="w-full border border-gray-300 rounded p-1 text-sm bg-white"
                        value={item.problem} onChange={e => updateComplaint(item.id, 'problem', e.target.value)}>
                        <option value="">Select Problem</option>
                        <option>Camera Not Working</option>
                        <option>Recording issue</option>
                        <option>NVR issue</option>
                        <option>Switch issue</option>
                        <option>Power Supply</option>
                        <option>{item.problem}</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <input type="text" className="w-full border border-gray-300 rounded p-1 text-sm" placeholder="Findings..."
                        value={item.finding} onChange={e => updateComplaint(item.id, 'finding', e.target.value)} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <input type="text" className="w-full border border-gray-300 rounded p-1 text-sm" placeholder="Actions taken..."
                        value={item.actionTaken} onChange={e => updateComplaint(item.id, 'actionTaken', e.target.value)} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <input type="text" className="w-full border border-gray-300 rounded p-1 text-sm" placeholder="Materials..."
                        value={item.materials} onChange={e => updateComplaint(item.id, 'materials', e.target.value)} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <input type="text" className="w-full border border-gray-300 rounded p-1 text-sm" placeholder="Type..."
                        value={item.rectificationType} onChange={e => updateComplaint(item.id, 'rectificationType', e.target.value)} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <input type="text" className="w-full border border-gray-300 rounded p-1 text-sm" placeholder="Used material..."
                        value={item.usedMaterial} onChange={e => updateComplaint(item.id, 'usedMaterial', e.target.value)} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <input type="text" className="w-full border border-gray-300 rounded p-1 text-sm" placeholder="Required..."
                        value={item.requiredMaterial} onChange={e => updateComplaint(item.id, 'requiredMaterial', e.target.value)} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <select className="w-full border border-gray-300 rounded p-1 text-sm bg-white"
                        value={item.remarks} onChange={e => updateComplaint(item.id, 'remarks', e.target.value)}>
                        <option value="">Select Remark</option>
                        <option>U/W</option>
                        <option>U/AMC</option>
                        <option>Chargeable</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      <select className="w-full border border-gray-300 rounded p-1 text-sm bg-white"
                        value={item.status} onChange={e => updateComplaint(item.id, 'status', e.target.value)}>
                        <option value="">Select Status</option>
                        <option>U/P</option>
                        <option>Completed</option>
                        <option>Partially completed</option>
                        <option>Under observation</option>
                        <option>Pending</option>
                        <option>For Approval</option>
                        <option>For Material</option>
                        <option>Under Repair</option>
                      </select>
                    </td>
                    <td className="py-2 px-4">
                      <select className="w-full border border-gray-300 rounded p-1 text-sm bg-white"
                        value={item.finalStatus} onChange={e => updateComplaint(item.id, 'finalStatus', e.target.value)}>
                        <option value="">Final Status</option>
                        <option>Complete</option>
                        <option>Quotation sent</option>
                        <option>Invoice raise</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
