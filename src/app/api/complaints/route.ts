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

    // ==========================================
    // NOTIFICATION LOGIC (Email & WhatsApp)
    // ==========================================
    
    const notificationMessage = \New Complaint Received!
Ticket: \
Client: \
Phone: \
Email: \
Problem: \\;

    // 1. Send Email via FormSubmit (Requires one-time activation click on first run)
    try {
      await fetch('https://formsubmit.co/ajax/vineet@digitechservices.net', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': 'https://digitechhms.net'
        },
        body: JSON.stringify({
          subject: 'New Complaint Registered: ' + newComplaint.ticketNo,
          message: notificationMessage
        })
      });
      console.log('Email trigger sent via FormSubmit.');
    } catch (e) {
      console.error('Email failed', e);
    }

    // 2. Send WhatsApp via CallMeBot
    // NOTE: You must get an API Key from CallMeBot by sending a WhatsApp message to them.
    // Replace 'YOUR_API_KEY_HERE' with your actual key once you get it.
    try {
      const whatsappKey = 'YOUR_API_KEY_HERE';
      const encodedMessage = encodeURIComponent(notificationMessage);
      const whatsappUrl = \https://api.callmebot.com/whatsapp.php?phone=9999760222&text=\&apikey=\\;
      
      if (whatsappKey !== 'YOUR_API_KEY_HERE') {
        await fetch(whatsappUrl);
        console.log('WhatsApp notification sent!');
      } else {
        console.log('WhatsApp notification skipped: API Key is missing.');
      }
    } catch (e) {
      console.error('WhatsApp failed', e);
    }
    
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
