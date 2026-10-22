import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const REGISTRY_ID = 'ff808181a09d98f701a140e1cc136b38';
const OBJECTS_API = 'https://api.restful-api.dev/objects';

// In-memory fallback dataset
let memoryComplaints: any[] = [
  {
    id: 4,
    ticketNo: 'TKT-1004',
    clientName: 'nakul',
    clientEmail: 'nakul@example.com',
    contactPerson: 'Nakul Bidhuri',
    contactNumber: '9999760222',
    address: 'Delhi NCR',
    complaintType: 'CCTV',
    problem: 'Camera offline and recording failure',
    priority: 'P1',
    channel: 'WhatsApp',
    status: 'Open',
    date: '2026-10-15',
    objId: 'ff808181a09d98f701a140e68c6f6b3a'
  },
  {
    id: 3,
    ticketNo: 'TKT-1003',
    clientName: 'Test',
    clientEmail: 'test@example.com',
    contactPerson: 'Tester',
    contactNumber: '9876543210',
    address: 'Noida Sec 62',
    complaintType: 'CCTV',
    problem: 'DVR not powering on',
    priority: 'P2',
    channel: 'Email',
    status: 'Open',
    date: '2026-10-15',
    objId: 'ff808181a09d98f701a140e68d966b3b'
  },
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
    status: 'Pending',
    remarks: 'U/AMC',
    objId: 'ff808181a09d98f701a140e68e466b3c'
  },
  {
    id: 1,
    date: '18/09/2026',
    ticketNo: 'TKT-1000',
    clientName: 'Demo Client (Digitech)',
    clientEmail: 'demo@digitech.net',
    contactPerson: 'Mr. Nakul',
    contactNumber: '9999999999',
    address: 'New Delhi HQ',
    complaintType: 'CCTV',
    problem: 'Camera 2 Offline',
    priority: 'P1',
    channel: 'WhatsApp',
    status: 'Open',
    objId: 'ff808181a09d98f701a140e68ef76b3d'
  }
];

let lastFetchTime = 0;
const CACHE_DURATION_MS = 3000; // 3-second cache to prevent repeat request lag

// Read all complaints from the Registry and individual objects
async function getComplaintsFromCloud(): Promise<any[]> {
  const now = Date.now();
  if (memoryComplaints.length > 0 && now - lastFetchTime < CACHE_DURATION_MS) {
    return memoryComplaints;
  }

  try {
    const regRes = await fetch(`${OBJECTS_API}/${REGISTRY_ID}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(1500)
    });

    if (!regRes.ok) return memoryComplaints;

    const regData = await regRes.json();
    const idsString = regData?.data?.ids;
    if (!idsString || typeof idsString !== 'string') return memoryComplaints;

    const ids = idsString.split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length === 0) return memoryComplaints;

    // Fetch up to 50 objects in a single batch query
    const query = ids.slice(0, 50).map(id => `id=${encodeURIComponent(id)}`).join('&');
    const objectsRes = await fetch(`${OBJECTS_API}?${query}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(2000)
    });

    if (objectsRes.ok) {
      const items = await objectsRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const loaded = items.map((item: any) => ({
          ...item.data,
          objId: item.id
        }));

        // Sort descending by ID or creation
        loaded.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        memoryComplaints = loaded;
        lastFetchTime = now;
        return loaded;
      }
    }
  } catch (err) {
    console.warn('Could not read from cloud objects store, using cached/memory complaints:', err);
  }

  lastFetchTime = now;
  return memoryComplaints;
}

export async function GET() {
  const complaints = await getComplaintsFromCloud();
  return NextResponse.json(complaints, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const currentList = await getComplaintsFromCloud();

    const maxId = currentList.reduce((max: number, c: any) => Math.max(max, Number(c.id) || 0), 0);
    const newId = maxId + 1;
    const ticketNo = 'TKT-' + (1000 + newId);

    const newComplaint = {
      ...data,
      id: newId,
      ticketNo,
      date: new Date().toISOString().split('T')[0],
      priority: data.priority || (data.problem?.toLowerCase().includes('offline') ? 'P1' : 'P2'),
      channel: data.channel || (data.contactNumber ? 'WhatsApp' : 'Email'),
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

    // 1. Create individual object in cloud store
    let objId = '';
    try {
      const createRes = await fetch(OBJECTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `DHMS_Complaint_${ticketNo}`,
          data: newComplaint
        }),
        signal: AbortSignal.timeout(3500)
      });

      if (createRes.ok) {
        const createdObj = await createRes.json();
        objId = createdObj.id;
      }
    } catch (e) {
      console.warn('Failed to create single object:', e);
    }

    // 2. Append new object ID to registry
    if (objId) {
      newComplaint.objId = objId;
      try {
        const regRes = await fetch(`${OBJECTS_API}/${REGISTRY_ID}`, { cache: 'no-store' });
        if (regRes.ok) {
          const regData = await regRes.json();
          const existingIds = (regData?.data?.ids || '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);

          const updatedIds = [objId, ...existingIds].slice(0, 80).join(',');

          await fetch(`${OBJECTS_API}/${REGISTRY_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'DHMS_Registry',
              data: { ids: updatedIds }
            }),
            signal: AbortSignal.timeout(3000)
          });
        }
      } catch (e) {
        console.warn('Failed to update registry:', e);
      }
    }

    // Update memory cache immediately
    memoryComplaints.unshift(newComplaint);

    // 3. Trigger Automatic Notification to vineet@digitechservices.net
    const notificationMessage = [
      'New Complaint Registered on Digitech!',
      'Ticket No: ' + newComplaint.ticketNo,
      'Client: ' + (newComplaint.clientName || 'N/A'),
      'Email: ' + (newComplaint.clientEmail || 'N/A'),
      'Contact: ' + (newComplaint.contactPerson || '') + ' (' + (newComplaint.contactNumber || '') + ')',
      'Address: ' + (newComplaint.address || 'N/A'),
      'System Type: ' + (newComplaint.complaintType || 'CCTV'),
      'Problem: ' + (newComplaint.problem || 'N/A')
    ].join('\n');

    // Background email dispatch
    try {
      fetch('https://formsubmit.co/ajax/vineet@digitechservices.net', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': 'https://digitechservices.net'
        },
        body: JSON.stringify({
          subject: `New Complaint Registered: ${newComplaint.ticketNo} - ${newComplaint.clientName}`,
          message: notificationMessage
        }),
        signal: AbortSignal.timeout(3000)
      }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({ success: true, complaint: newComplaint }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Failed to create complaint:', error);
    return NextResponse.json({ success: false, error: 'Failed to add complaint' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const currentList = await getComplaintsFromCloud();
    const index = currentList.findIndex((c: any) => c.id === data.id);

    if (index !== -1) {
      const updated = { ...currentList[index], ...data };
      currentList[index] = updated;
      memoryComplaints = currentList;

      // If we have objId, update the object directly in cloud store
      const targetObjId = updated.objId;
      if (targetObjId) {
        try {
          await fetch(`${OBJECTS_API}/${targetObjId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `DHMS_Complaint_${updated.ticketNo || updated.id}`,
              data: updated
            }),
            signal: AbortSignal.timeout(3000)
          });
        } catch (e) {
          console.warn('Could not update individual cloud object:', e);
        }
      }

      return NextResponse.json({ success: true, complaint: updated }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 400 });
  }
}
