import { NextResponse } from 'next/server';

const complaints = [
  {
    id: 1,
    date: new Date().toISOString().split('T')[0],
    complaintType: 'CCTV',
    ticketNo: 'TKT-1001',
    clientName: 'Demo Client',
    address: 'Demo Address',
    contactPerson: 'Demo Person',
    contactNumber: '9999999999',
    assignedDate: '',
    engineer1: '',
    engineer2: '',
    problem: 'Camera Not Working',
    finding: '',
    actionTaken: '',
    materials: '',
    rectificationType: '',
    usedMaterial: '',
    requiredMaterial: '',
    remarks: '',
    status: 'Pending',
    finalStatus: ''
  }
];

export async function GET() {
  return NextResponse.json(complaints);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newComplaint = {
      ...data,
      id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
      ticketNo: 'TKT-' + (1000 + complaints.length + 1),
      assignedDate: '',
      engineer1: '',
      engineer2: '',
      finding: '',
      actionTaken: '',
      materials: '',
      rectificationType: '',
      usedMaterial: '',
      requiredMaterial: '',
      remarks: '',
      status: 'Pending',
      finalStatus: ''
    };
    
    complaints.unshift(newComplaint);
    return NextResponse.json({ success: true, complaint: newComplaint });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add complaint' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const index = complaints.findIndex(c => c.id === data.id);
    if (index !== -1) {
      complaints[index] = { ...complaints[index], ...data };
      return NextResponse.json({ success: true, complaint: complaints[index] });
    }
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 400 });
  }
}
