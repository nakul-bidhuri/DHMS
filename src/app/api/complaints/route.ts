import { NextResponse } from 'next/server';

const PRIMARY_API = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0b5c1c3213852';
const BACKUP_KEY = 'ny3g4gp2';

// In-memory cache for speed and resilience
let cachedComplaints: any[] = [
  {
    id: 2,
    date: '2026-09-18',
    ticketNo: 'TKT-1002',
    clientName: 'mishra',
    clientEmail: 'mishra@example.com',
    contactPerson: 'dhms',
    contactNumber: '1234567890',
    address: 'New Delhi',
    complaintType: 'CCTV',
    problem: 'Connector Fault',
    priority: 'P2',
    channel: 'WhatsApp',
    assignedDate: '2026-09-27',
    engineer1: 'Sharukh',
    engineer2: 'Abdul',
    finding: 'connector fault',
    actionTaken: 'repaired',
    materials: '',
    rectificationType: '',
    usedMaterial: '',
    requiredMaterial: '',
    remarks: 'U/AMC',
    status: 'Pending',
    finalStatus: ''
  },
  {
    id: 1,
    date: '18/09/2026',
    clientName: 'Demo Client (Digitech)',
    clientEmail: 'demo@digitech.net',
    contactPerson: 'Mr. Nakul',
    contactNumber: '9999999999',
    address: 'New Delhi HQ',
    complaintType: 'CCTV',
    problem: 'Camera 2 Offline',
    priority: 'P1',
    channel: 'WhatsApp',
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
    status: 'Open',
    finalStatus: ''
  }
];

async function getDB() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(PRIMARY_API, { cache: 'no-store', signal: controller.signal });
    clearTimeout(timer);
    
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.complaints;
      if (Array.isArray(list) && list.length > 0) {
        cachedComplaints = list;
        return list;
      }
    }
  } catch (err) {
    console.warn('Primary DB read timed out or failed, checking backup...');
  }

  // Backup check
  try {
    const backupRes = await fetch('https://keyvalue.immanuel.co/api/KeyVal/GetValue/' + BACKUP_KEY + '/complaints', { cache: 'no-store' });
    if (backupRes.ok) {
      const data = await backupRes.json();
      if (Array.isArray(data) && data.length > 0) {
        cachedComplaints = data;
        return data;
      }
    }
  } catch (e) {
    // ignore
  }

  return cachedComplaints;
}

async function updateDB(complaints: any[]) {
  cachedComplaints = complaints;

  // 1. Primary write
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    await fetch(PRIMARY_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'DHMS_Complaints',
        data: { complaints }
      }),
      signal: controller.signal
    });
    clearTimeout(timer);
  } catch (err) {
    console.warn('Primary DB write error, falling back to backup store:', err);
  }

  // 2. Backup write asynchronously
  try {
    fetch('https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/' + BACKUP_KEY + '/complaints/' + encodeURIComponent(JSON.stringify(complaints)), {
      method: 'POST'
    }).catch(() => {});
  } catch (e) {}
}

export async function GET() {
  const complaints = await getDB();
  return NextResponse.json(complaints);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const complaints = await getDB();
    
    const maxId = complaints.reduce((max: number, c: any) => Math.max(max, Number(c.id) || 0), 0);
    const newComplaint = {
      ...data,
      id: maxId + 1,
      date: new Date().toISOString().split('T')[0],
      ticketNo: 'TKT-' + (1000 + complaints.length + 1),
      priority: data.priority || 'P2',
      channel: data.channel || 'WhatsApp',
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
      status: 'Open',
      finalStatus: ''
    };
    
    complaints.unshift(newComplaint);
    await updateDB(complaints);

    // ==========================================
    // NON-BLOCKING ASYNC NOTIFICATIONS
    // (Never block the user's request!)
    // ==========================================
    const notificationMessage = [
      'New Complaint Registered!',
      'Ticket No: ' + (newComplaint.ticketNo || ''),
      'Client: ' + (newComplaint.clientName || ''),
      'Email: ' + (newComplaint.clientEmail || 'N/A'),
      'Contact: ' + (newComplaint.contactPerson || '') + ' (' + (newComplaint.contactNumber || '') + ')',
      'Address: ' + (newComplaint.address || 'N/A'),
      'Type: ' + (newComplaint.complaintType || 'CCTV'),
      'Problem: ' + (newComplaint.problem || '')
    ].join('\n');

    // 1. Send Email Notification in background (non-blocking)
    try {
      fetch('https://formsubmit.co/ajax/vineet@digitechservices.net', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': 'https://digitechhms.net'
        },
        body: JSON.stringify({
          subject: 'New Complaint: ' + newComplaint.ticketNo + ' - ' + newComplaint.clientName,
          message: notificationMessage
        }),
        signal: AbortSignal.timeout(3000)
      }).catch(() => {});
    } catch (e) {}

    // 2. WhatsApp Notification (CallMeBot)
    try {
      const encodedMsg = encodeURIComponent(notificationMessage);
      fetch('https://api.callmebot.com/whatsapp.php?phone=9999760222&text=' + encodedMsg + '&apikey=9999760222', {
        signal: AbortSignal.timeout(3000)
      }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true, complaint: newComplaint });
  } catch (error) {
    console.error('Failed to create complaint:', error);
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
