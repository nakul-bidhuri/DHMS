import { NextResponse } from 'next/server';

const API_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0b5c1c3213852';

async function getDB() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  const json = await res.json();
  return json?.data?.complaints || [];
}

async function updateDB(complaints: any[]) {
  await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'DHMS_Complaints',
      data: { complaints }
    })
  });
}

export async function GET() {
  const complaints = await getDB();
  return NextResponse.json(complaints);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const complaints = await getDB();
    
    const newComplaint = {
      ...data,
      id: complaints.length > 0 ? Math.max(...complaints.map((c: any) => c.id || 0)) + 1 : 1,
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
    await updateDB(complaints);
    
    return NextResponse.json({ success: true, complaint: newComplaint });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add complaint' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const complaints = await getDB();
    const index = complaints.findIndex((c: any) => c.id === data.id);
    
    if (index !== -1) {
      complaints[index] = { ...complaints[index], ...data };
      await updateDB(complaints);
      return NextResponse.json({ success: true, complaint: complaints[index] });
    }
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 400 });
  }
}
