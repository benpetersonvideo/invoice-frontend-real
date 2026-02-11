import React, { useState } from 'react';
import { Calendar, Users, FileText, BarChart3, Settings, Plus, Search, Download, Mail, X, Trash2, DollarSign, TrendingUp } from 'lucide-react';

const AthleticsInvoiceApp = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [freelancers, setFreelancers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '555-0101',
      rate: 250,
      specialty: 'Camera Operator',
      w9: true,
      notes: 'Excellent with multi-cam setups',
      availability: 'Weekends preferred'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '555-0102',
      rate: 300,
      specialty: 'Director',
      w9: true,
      notes: 'Great with live sports',
      availability: 'Available most days'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.d@email.com',
      phone: '555-0103',
      rate: 225,
      specialty: 'Audio Engineer',
      w9: false,
      notes: 'Strong technical skills',
      availability: 'Evenings and weekends'
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      events: [
        { eventName: 'Football vs State U', eventDate: '2026-02-15', sport: 'Football' }
      ],
      crew: [
        { freelancerId: 1, role: 'Camera Operator', rate: 250 },
        { freelancerId: 2, role: 'Director', rate: 300 },
        { freelancerId: 3, role: 'Audio Engineer', rate: 225 }
      ],
      total: 775,
      status: 'Sent',
      invoiceNumber: 'INV-2026-001',
      company: 'University Athletics'
    },
    {
      id: 2,
      events: [
        { eventName: 'Basketball - Women vs Tech', eventDate: '2026-02-20', sport: 'Basketball' },
        { eventName: 'Basketball - Men vs Tech', eventDate: '2026-02-20', sport: 'Basketball' }
      ],
      crew: [
        { freelancerId: 1, role: 'Camera Operator', rate: 250 },
        { freelancerId: 2, role: 'Director', rate: 300 }
      ],
      total: 550,
      status: 'Draft',
      invoiceNumber: 'INV-2026-002',
      company: 'University Athletics'
    }
  ]);

  const [events, setEvents] = useState([
    { id: 1, date: '2026-02-15', sport: 'Football', opponent: 'State U', home: true, invoiced: true },
    { id: 2, date: '2026-02-20', sport: 'Basketball', opponent: 'Tech', home: true, invoiced: true },
    { id: 3, date: '2026-02-25', sport: 'Soccer', opponent: 'City College', home: false, invoiced: false },
    { id: 4, date: '2026-03-01', sport: 'Baseball', opponent: 'Rival U', home: true, invoiced: false },
    { id: 5, date: '2026-03-05', sport: 'Basketball', opponent: 'Eastern State', home: true, invoiced: false }
  ]);

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'University Athletics',
      paymentTerms: 'Net 30',
      bankDetails: 'Bank: First National, Account: ****1234',
      invoicePrefix: 'INV',
      logoUrl: '',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      schoolName: 'State University'
    }
  ]);

  const [branding, setBranding] = useState(() => {
    try {
      const saved = localStorage.getItem('utep_branding');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#3b82f6',
      schoolName: 'State University',
      schoolLogo: '',
      mascot: 'Eagles'
    };
  });

  const saveBranding = (updated) => {
    setBranding(updated);
    try { localStorage.setItem('utep_branding', JSON.stringify(updated)); } catch {}
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFreelancer, setShowAddFreelancer] = useState(false);
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [showEditFreelancer, setShowEditFreelancer] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showEditInvoice, setShowEditInvoice] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showScheduleImport, setShowScheduleImport] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [scheduleUrl, setScheduleUrl] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDate: '',
    sport: 'Football',
    opponent: '',
    isHome: true
  });
  const [importPreview, setImportPreview] = useState([]);
  const [importSelected, setImportSelected] = useState([]);
  const [importFilters, setImportFilters] = useState({ location: 'all', sport: 'all' });

  const roles = ['Camera Operator', 'Director', 'Audio Engineer', 'Graphics Operator', 'Producer', 'Technical Director', 'Replay Operator', 'Lighting Director'];

  const sports = ['Football', 'Basketball', 'Soccer', 'Baseball', 'Volleyball', 'Hockey', 'Softball', 'Lacrosse', 'Track & Field', 'Swimming'];

  // New freelancer form
  const [newFreelancer, setNewFreelancer] = useState({
    name: '', email: '', phone: '', rate: '', specialty: '', w9: false, notes: '', availability: ''
  });

  // New invoice form
  const [newInvoice, setNewInvoice] = useState({
    events: [{ eventName: '', eventDate: '', sport: '' }],
    crew: [],
    company: 'University Athletics',
    invoiceNumber: ''
  });

  // New company form
  const [newCompany, setNewCompany] = useState({
    name: '',
    paymentTerms: 'Net 30',
    bankDetails: '',
    invoicePrefix: 'INV',
    logoUrl: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    schoolName: ''
  });

  // Calculate statistics
  const calculateStats = () => {
    const sportStats = {};
    const monthlyStats = {};
    let totalSpent = 0;
    let totalEvents = invoices.length;

    invoices.forEach(invoice => {
      const invoiceTotal = parseFloat(invoice.total) || 0;
      totalSpent += invoiceTotal;

      // Use first event for sport categorization
      const primaryEvent = invoice.events && invoice.events[0];
      if (!primaryEvent) return;
      const sport = primaryEvent.sport;
      const month = primaryEvent.eventDate ? primaryEvent.eventDate.substring(0, 7) : 'Unknown';

      // Sport stats
      if (!sportStats[sport]) {
        sportStats[sport] = { total: 0, count: 0 };
      }
      sportStats[sport].total += invoiceTotal;
      sportStats[sport].count += 1;

      // Monthly stats
      if (!monthlyStats[month]) {
        monthlyStats[month] = { total: 0, count: 0 };
      }
      monthlyStats[month].total += invoiceTotal;
      monthlyStats[month].count += 1;
    });

    return {
      sportStats,
      monthlyStats,
      totalSpent,
      averagePerEvent: totalEvents > 0 ? totalSpent / totalEvents : 0
    };
  };

  const stats = calculateStats();

  // Load real data from database on startup
  React.useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    if (!apiUrl) return;
    fetch(`${apiUrl}/freelancers`)
      .then(r => r.json())
      .then(data => { if (data.success && data.data.length > 0) setFreelancers(data.data.map(f => ({ ...f, w9: f.w9_on_file }))) })
      .catch(() => {});
    fetch(`${apiUrl}/invoices`)
      .then(r => r.json())
      .then(data => { if (data.success && data.data.length > 0) setInvoices(data.data) })
      .catch(() => {});
    fetch(`${apiUrl}/companies`)
      .then(r => r.json())
      .then(data => { if (data.success && data.data.length > 0) setCompanies(data.data.map(c => ({ ...c, paymentTerms: c.payment_terms, bankDetails: c.bank_details, invoicePrefix: c.invoice_prefix }))) })
      .catch(() => {});
    fetch(`${apiUrl}/events`)
      .then(r => r.json())
      .then(data => { if (data.success && data.data.length > 0) setEvents(data.data.map(e => ({ ...e, date: e.event_date }))) })
      .catch(() => {});
  }, []);

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/events/${id}`, { method: 'DELETE' });
    } catch {}
    setEvents(events.filter(e => e.id !== id));
  };

  const addEvent = async () => {
    if (!newEvent.eventName || !newEvent.eventDate || !newEvent.sport || !newEvent.opponent) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();
      if (data.success) {
        setEvents([...events, {
          id: data.data.id,
          event_name: newEvent.eventName,
          event_date: newEvent.eventDate,
          date: newEvent.eventDate,
          sport: newEvent.sport,
          opponent: newEvent.opponent,
          is_home: newEvent.isHome,
          home: newEvent.isHome,
          invoiced: false,
        }]);
        setNewEvent({ eventName: '', eventDate: '', sport: 'Football', opponent: '', isHome: true });
        setShowAddEvent(false);
        alert('✅ Event added!');
      } else {
        alert('❌ Failed to add event: ' + data.message);
      }
    } catch {
      alert('❌ Could not reach backend');
    }
  };

  const saveEditEvent = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: editingEvent.eventName || editingEvent.event_name,
          eventDate: editingEvent.date || editingEvent.event_date,
          sport: editingEvent.sport,
          opponent: editingEvent.opponent,
          isHome: editingEvent.home !== undefined ? editingEvent.home : editingEvent.is_home,
        }),
      });
    } catch {}
    setEvents(events.map(e => e.id === id ? {
      ...e,
      event_name: editingEvent.eventName || editingEvent.event_name,
      date: editingEvent.date || editingEvent.event_date,
      event_date: editingEvent.date || editingEvent.event_date,
      sport: editingEvent.sport,
      opponent: editingEvent.opponent,
      home: editingEvent.home !== undefined ? editingEvent.home : editingEvent.is_home,
    } : e));
    setEditingEventId(null);
    setEditingEvent(null);
  };

  const createInvoiceFromEvent = (event) => {
    const eventDate = event.date || event.event_date;
    const eventName = event.event_name || event.eventName || `${event.sport} vs ${event.opponent}`;
    setNewInvoice({
      events: [{ eventName, eventDate, sport: event.sport }],
      crew: [],
      company: companies[0]?.name || 'University Athletics',
      invoiceNumber: '',
    });
    setShowAddInvoice(true);
    setActiveTab('invoices');
  };

  const addFreelancer = async () => {
    if (!newFreelancer.name || !newFreelancer.email) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/freelancers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newFreelancer, rate: parseFloat(newFreelancer.rate) || 0 }),
      });
      const data = await res.json();
      if (data.success) {
        setFreelancers([...freelancers, { ...data.data, w9: data.data.w9_on_file }]);
        setNewFreelancer({ name: '', email: '', phone: '', rate: '', specialty: '', w9: false, notes: '', availability: '' });
        setShowAddFreelancer(false);
      } else {
        alert('❌ Failed to save freelancer: ' + data.message);
      }
    } catch {
      setFreelancers([...freelancers, { ...newFreelancer, id: Date.now(), rate: parseFloat(newFreelancer.rate) || 0 }]);
      setNewFreelancer({ name: '', email: '', phone: '', rate: '', specialty: '', w9: false, notes: '', availability: '' });
      setShowAddFreelancer(false);
    }
  };

  const deleteFreelancer = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/freelancers/${id}`, { method: 'DELETE' });
    } catch {}
    setFreelancers(freelancers.filter(f => f.id !== id));
  };

  const saveEditFreelancer = async () => {
    if (!editingFreelancer) return;
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/freelancers/${editingFreelancer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingFreelancer, rate: parseFloat(editingFreelancer.rate) || 0 }),
      });
    } catch {}
    setFreelancers(freelancers.map(f => f.id === editingFreelancer.id
      ? { ...editingFreelancer, rate: parseFloat(editingFreelancer.rate) || 0 }
      : f
    ));
    setShowEditFreelancer(false);
    setEditingFreelancer(null);
  };

  const addInvoice = async () => {
    const validEvents = newInvoice.events.filter(e => e.eventName && e.eventDate && e.sport);
    if (validEvents.length === 0 || newInvoice.crew.length === 0) return;
    const total = newInvoice.crew.reduce((sum, member) => sum + member.rate, 0);
    const company = companies.find(c => c.name === newInvoice.company);
    const invoiceNum = newInvoice.invoiceNumber || `${company.invoicePrefix}-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: validEvents, crew: newInvoice.crew, company: newInvoice.company, invoiceNumber: invoiceNum }),
      });
      const data = await res.json();
      if (data.success) {
        const newInvoiceId = data.data.id;
        setInvoices([...invoices, { id: newInvoiceId, events: validEvents, crew: newInvoice.crew, total, status: 'Draft', invoiceNumber: invoiceNum, company: newInvoice.company }]);
        // Mark matching calendar events as invoiced in state and database
        const updatedEvents = events.map(e => {
          const eDate = (e.date || e.event_date || '').substring(0, 10);
          const matched = validEvents.some(ve => ve.eventDate === eDate && ve.sport === e.sport);
          if (matched) {
            // Update in database
            fetch(`${process.env.REACT_APP_API_BASE_URL}/events/${e.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                eventName: e.event_name || e.eventName,
                eventDate: eDate,
                sport: e.sport,
                opponent: e.opponent,
                isHome: e.home || e.is_home,
                invoiced: true,
                invoiceId: newInvoiceId
              })
            }).catch(() => {});
            return { ...e, invoiced: true, invoice_id: newInvoiceId };
          }
          return e;
        });
        setEvents(updatedEvents);
        alert('✅ Invoice saved!');
      } else {
        alert('❌ Failed to save invoice: ' + data.message);
        return;
      }
    } catch {
      alert('❌ Could not reach backend. Invoice saved locally only.');
      setInvoices([...invoices, { id: Date.now(), events: validEvents, crew: newInvoice.crew, total, status: 'Draft', invoiceNumber: invoiceNum, company: newInvoice.company }]);
    }
    setNewInvoice({ events: [{ eventName: '', eventDate: '', sport: '' }], crew: [], company: 'University Athletics', invoiceNumber: '' });
    setShowAddInvoice(false);
  };

  const deleteInvoice = async (invoice) => {
    if (!window.confirm(`Delete invoice ${invoice.invoiceNumber}? This cannot be undone.`)) return;
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/invoices/${invoice.id}`, { method: 'DELETE' });
    } catch {}
    setInvoices(invoices.filter(inv => inv.id !== invoice.id));
    // Unmark any calendar events linked to this invoice
    setEvents(events.map(e => e.invoice_id === invoice.id ? { ...e, invoiced: false, invoice_id: null } : e));
  };

  const saveEditInvoice = async () => {
    if (!editingInvoice) return;
    const total = editingInvoice.crew.reduce((sum, m) => sum + (parseFloat(m.rate) || 0), 0);
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/invoices/${editingInvoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingInvoice, total }),
      });
    } catch {}
    setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? { ...editingInvoice, total } : inv));
    setShowEditInvoice(false);
    setEditingInvoice(null);
  };

  const addCrewMember = () => {
    setNewInvoice({
      ...newInvoice,
      crew: [...newInvoice.crew, { freelancerId: '', role: '', rate: 0 }]
    });
  };

  const addEventToInvoice = () => {
    setNewInvoice({
      ...newInvoice,
      events: [...newInvoice.events, { eventName: '', eventDate: '', sport: '' }]
    });
  };

  const updateEvent = (index, field, value) => {
    const updatedEvents = [...newInvoice.events];
    updatedEvents[index][field] = value;
    setNewInvoice({ ...newInvoice, events: updatedEvents });
  };

  const removeEvent = (index) => {
    if (newInvoice.events.length > 1) {
      setNewInvoice({
        ...newInvoice,
        events: newInvoice.events.filter((_, i) => i !== index)
      });
    }
  };

  const updateCrewMember = (index, field, value) => {
    const updatedCrew = [...newInvoice.crew];
    updatedCrew[index][field] = value;
    
    if (field === 'freelancerId' && value) {
      const freelancer = freelancers.find(f => f.id === parseInt(value));
      if (freelancer) {
        updatedCrew[index].rate = freelancer.rate;
        updatedCrew[index].role = freelancer.specialty;
      }
    }
    
    setNewInvoice({ ...newInvoice, crew: updatedCrew });
  };

  const removeCrewMember = (index) => {
    setNewInvoice({
      ...newInvoice,
      crew: newInvoice.crew.filter((_, i) => i !== index)
    });
  };

  const addCompany = async () => {
    if (!newCompany.name) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCompany.name,
          paymentTerms: newCompany.paymentTerms,
          bankDetails: newCompany.bankDetails,
          invoicePrefix: newCompany.invoicePrefix,
          logoUrl: newCompany.logoUrl,
          primaryColor: newCompany.primaryColor,
          secondaryColor: newCompany.secondaryColor,
          schoolName: newCompany.schoolName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCompanies([...companies, { ...data.data, paymentTerms: data.data.payment_terms, bankDetails: data.data.bank_details, invoicePrefix: data.data.invoice_prefix }]);
        alert('✅ Company saved!');
      } else {
        alert('❌ Failed to save company: ' + data.message);
        return;
      }
    } catch {
      // Fallback to local if backend unreachable
      setCompanies([...companies, { ...newCompany, id: Date.now() }]);
    }
    setNewCompany({
      name: '',
      paymentTerms: 'Net 30',
      bankDetails: '',
      invoicePrefix: 'INV',
      logoUrl: '',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      schoolName: ''
    });
    setShowAddCompany(false);
  };

  const fetchSchedulePreview = async () => {
    if (!scheduleUrl) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/events/import-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scheduleUrl, previewOnly: true }),
      });
      const data = await res.json();
      if (data.success) {
        const previewed = (data.data.events || []).map((e, i) => ({ ...e, tempId: i }));
        setImportPreview(previewed);
        setImportSelected(previewed.map(e => e.tempId));
        setImportFilters({ location: 'all', sport: 'all' });
        if (previewed.length === 0) alert('No events found at that URL. Try an individual sport schedule page.');
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch {
      alert('❌ Could not reach the server.');
    }
  };

  const importSchedule = async () => {
    const toImport = importPreview.filter(e => importSelected.includes(e.tempId));
    if (toImport.length === 0) return;

    const savedEvents = [];
    let skipped = 0;

    for (const event of toImport) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: event.eventName,
            eventDate: event.eventDate,
            sport: event.sport,
            opponent: event.opponent || 'TBD',
            isHome: event.isHome,
          }),
        });
        const data = await res.json();
        if (data.success) {
          if (data.duplicate) {
            skipped++;
          } else {
            savedEvents.push({
              id: data.data.id,
              date: event.eventDate,
              event_date: event.eventDate,
              event_name: event.eventName,
              sport: event.sport,
              opponent: event.opponent || 'TBD',
              home: event.isHome,
              is_home: event.isHome,
              invoiced: false,
            });
          }
        }
      } catch {}
    }

    if (savedEvents.length > 0) setEvents(prev => [...prev, ...savedEvents]);

    const msg = skipped > 0
      ? `✅ Imported ${savedEvents.length} new event${savedEvents.length !== 1 ? 's' : ''}. Skipped ${skipped} already in your calendar.`
      : `✅ Imported ${savedEvents.length} event${savedEvents.length !== 1 ? 's' : ''} successfully!`;
    alert(msg);

    setScheduleUrl('');
    setImportPreview([]);
    setImportSelected([]);
    setImportFilters({ location: 'all', sport: 'all' });
    setShowScheduleImport(false);
  };

  const exportToPDF = async (invoice) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/invoices/${invoice.id}/export-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('❌ PDF export failed. Please check your backend is running.');
    }
  };

  const sendEmail = async (invoice) => {
    const crewEmails = invoice.crew.map(member => {
      const freelancer = freelancers.find(f => f.id === member.freelancerId);
      return freelancer ? freelancer.email : '';
    }).filter(Boolean);

    if (crewEmails.length === 0) {
      alert('❌ No email addresses found for this crew. Make sure freelancers have emails saved.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/invoices/${invoice.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: crewEmails }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Invoice sent to ${crewEmails.join(', ')}`);
        setInvoices(prev => prev.map(inv =>
          inv.id === invoice.id ? { ...inv, status: 'Sent' } : inv
        ));
      } else {
        alert(`❌ Email failed: ${data.message}`);
      }
    } catch (err) {
      alert('❌ Email failed. Make sure SendGrid is configured and IT has added the DNS records.');
    }
  };

  const copyEmailBody = (invoice) => {
    const company = companies.find(c => c.name === invoice.company) || {};
    const crewLines = invoice.crew && invoice.crew.map(member => {
      const freelancer = freelancers.find(f => f.id === member.freelancerId || f.id === member.freelancer_id);
      const name = freelancer ? freelancer.name : 'Unknown';
      return `  • ${name} — ${member.role} — $${parseFloat(member.rate).toFixed(2)}`;
    }).join('\n');

    const eventLines = invoice.events && invoice.events.map(e =>
      `  • ${e.eventName} on ${e.eventDate}`
    ).join('\n');

    const invoiceNum = invoice.invoiceNumber || invoice.invoice_number;
    const total = parseFloat(invoice.total).toFixed(2);
    const paymentTerms = company.paymentTerms || company.payment_terms || 'Net 30';
    const bankDetails = company.bankDetails || company.bank_details || '';
    const schoolName = company.schoolName || company.school_name || invoice.company || 'UTEP Athletics';

    const body =
`Subject: Invoice ${invoiceNum} — ${schoolName} Broadcast Crew

Hello,

Please find your invoice details below for broadcast crew services rendered.

INVOICE #${invoiceNum}
${schoolName}

EVENTS COVERED:
${eventLines}

CREW & RATES:
${crewLines}

TOTAL DUE: $${total}
PAYMENT TERMS: ${paymentTerms}
${bankDetails ? `\nPAYMENT DETAILS:\n${bankDetails}` : ''}

Please remit payment within the terms stated above. If you have any questions, please don't hesitate to reach out.

Thank you for your work!

— ${schoolName} Broadcast Department`;

    navigator.clipboard.writeText(body).then(() => {
      alert('✅ Email copied to clipboard!\n\nOpen your email client, create a new message, and paste (Ctrl+V) to send.');
    }).catch(() => {
      // Fallback for browsers that block clipboard
      const ta = document.createElement('textarea');
      ta.value = body;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('✅ Email copied to clipboard!\n\nOpen your email client, create a new message, and paste (Ctrl+V) to send.');
    });
  };

  const filteredFreelancers = freelancers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6" style={{ borderTop: `4px solid ${branding.primaryColor}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {branding.schoolLogo && (
                <img src={branding.schoolLogo} alt="School Logo" className="h-16 w-16 object-contain" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{branding.schoolName} Broadcast Invoice Manager</h1>
                <p className="text-slate-600 mt-1">University Broadcast Crew Management System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: branding.primaryColor }}>${stats.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Total Invoiced</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'invoices' 
                  ? 'border-b-2' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              style={activeTab === 'invoices' ? { color: branding.primaryColor, borderColor: branding.primaryColor } : {}}
            >
              <FileText size={20} />
              Invoices
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'calendar' 
                  ? 'border-b-2' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              style={activeTab === 'calendar' ? { color: branding.primaryColor, borderColor: branding.primaryColor } : {}}
            >
              <Calendar size={20} />
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'freelancers' 
                  ? 'border-b-2' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              style={activeTab === 'freelancers' ? { color: branding.primaryColor, borderColor: branding.primaryColor } : {}}
            >
              <Users size={20} />
              Freelancers
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'statistics' 
                  ? 'border-b-2' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              style={activeTab === 'statistics' ? { color: branding.primaryColor, borderColor: branding.primaryColor } : {}}
            >
              <BarChart3 size={20} />
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'settings' 
                  ? 'border-b-2' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              style={activeTab === 'settings' ? { color: branding.primaryColor, borderColor: branding.primaryColor } : {}}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>
        </div>

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Invoices</h2>
              <button
                onClick={() => setShowAddInvoice(true)}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <Plus size={20} />
                Create Invoice
              </button>
            </div>

            <div className="space-y-4">
              {invoices.map(invoice => (
                <div key={invoice.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {invoice.events && invoice.events.length === 1
                            ? invoice.events[0].eventName
                            : `${invoice.events && invoice.events.length} Events - ${invoice.events && invoice.events[0].sport}`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'Sent' ? 'bg-green-100 text-green-700' :
                          invoice.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      {invoice.events && invoice.events.length > 1 && (
                        <div className="mb-3 bg-slate-50 rounded-lg p-3">
                          <div className="text-sm font-semibold text-slate-700 mb-2">Events included:</div>
                          {invoice.events.map((event, idx) => (
                            <div key={idx} className="text-sm text-slate-600 ml-2">
                              • {event.eventName} - {event.eventDate}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                        <div>Invoice #: {invoice.invoiceNumber || invoice.invoice_number}</div>
                        <div>Date: {invoice.events && invoice.events[0] && invoice.events[0].eventDate}</div>
                        <div>Sport: {invoice.events && invoice.events[0] && invoice.events[0].sport}</div>
                        <div>Crew: {invoice.crew && invoice.crew.length} members</div>
                      </div>
                      <div className="text-sm text-slate-700">
                        <strong>Crew:</strong> {invoice.crew && invoice.crew.map(member => {
                          const freelancer = freelancers.find(f => f.id === member.freelancerId || f.id === member.freelancer_id);
                          return freelancer ? `${freelancer.name} (${member.role})` : member.role;
                        }).join(', ')}
                      </div>
                    </div>
                    <div className="text-right ml-4 flex flex-col items-end gap-2">
                      <div className="text-2xl font-bold text-slate-800">${parseFloat(invoice.total).toFixed(2)}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportToPDF(invoice)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Export to PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => copyEmailBody(invoice)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Copy email to clipboard"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => sendEmail(invoice)}
                          className="p-2 text-white rounded-lg transition-colors hover:opacity-90"
                          style={{ backgroundColor: branding.primaryColor }}
                          title="Send Email (requires SendGrid setup)"
                        >
                          <Mail size={18} />
                        </button>
                        <button
                          onClick={() => { setEditingInvoice({ ...invoice, crew: invoice.crew ? [...invoice.crew] : [], events: invoice.events ? [...invoice.events] : [] }); setShowEditInvoice(true); }}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Edit Invoice"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Event Calendar</h2>
              <div className="flex gap-2">
                {events.length > 0 && (
                  <button
                    onClick={async () => {
                      if (!window.confirm(`Are you sure you want to delete all ${events.length} events? This cannot be undone.`)) return;
                      for (const event of events) {
                        try {
                          await fetch(`${process.env.REACT_APP_API_BASE_URL}/events/${event.id}`, { method: 'DELETE' });
                        } catch {}
                      }
                      setEvents([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors font-semibold"
                  >
                    <Trash2 size={16} />
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors font-semibold"
                  style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
                >
                  <Plus size={20} />
                  Add Event
                </button>
                <button
                  onClick={() => setShowScheduleImport(true)}
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <Plus size={20} />
                  Import Schedule
                </button>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold">No events yet</p>
                <p className="text-sm mt-1">Import a schedule using the button above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...events].sort((a, b) => new Date(a.date || a.event_date) - new Date(b.date || b.event_date)).map(event => {
                  const rawDate = event.date || event.event_date || '';
                  const eventDate = rawDate.substring(0, 10); // Always take just YYYY-MM-DD
                  const parsedDate = new Date(eventDate + 'T12:00:00');
                  const isEditing = editingEventId === event.id;
                  return (
                    <div key={event.id} className={`border rounded-lg p-4 transition-shadow ${isEditing ? 'border-blue-400 shadow-md' : 'border-slate-200 hover:shadow-md'}`}>
                      {isEditing ? (
                        /* Edit mode */
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={editingEvent.eventName || editingEvent.event_name || ''}
                              onChange={e => setEditingEvent({ ...editingEvent, eventName: e.target.value, event_name: e.target.value })}
                              placeholder="Event name"
                              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="date"
                              value={(editingEvent.date || editingEvent.event_date || '').substring(0, 10)}
                              onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value, event_date: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                              value={editingEvent.sport || ''}
                              onChange={e => setEditingEvent({ ...editingEvent, sport: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {sports.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editingEvent.opponent || ''}
                              onChange={e => setEditingEvent({ ...editingEvent, opponent: e.target.value })}
                              placeholder="Opponent"
                              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                              value={editingEvent.home !== undefined ? (editingEvent.home ? 'home' : 'away') : (editingEvent.is_home ? 'home' : 'away')}
                              onChange={e => setEditingEvent({ ...editingEvent, home: e.target.value === 'home', is_home: e.target.value === 'home' })}
                              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="home">Home</option>
                              <option value="away">Away</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => saveEditEvent(event.id)} className="px-4 py-2 text-white text-sm rounded-lg font-semibold" style={{ backgroundColor: branding.primaryColor }}>Save</button>
                            <button onClick={() => { setEditingEventId(null); setEditingEvent(null); }} className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        /* View mode */
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center rounded-lg p-3 min-w-[80px]" style={{ backgroundColor: branding.primaryColor + '15' }}>
                              <div className="text-sm font-semibold" style={{ color: branding.primaryColor }}>
                                {parsedDate.toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                              <div className="text-2xl font-bold text-slate-800">
                                {parsedDate.getDate()}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">{event.event_name || event.eventName || `${event.sport} vs ${event.opponent}`}</h3>
                              <p className="text-sm text-slate-600">
                                {event.sport} · vs {event.opponent} · {(event.home || event.is_home) ? 'Home' : 'Away'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(event.invoiced || event.invoice_id) ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Invoiced ✓</span>
                            ) : (
                              <button
                                onClick={() => createInvoiceFromEvent(event)}
                                className="px-3 py-1 text-white rounded-full text-sm font-semibold transition-colors"
                                style={{ backgroundColor: branding.primaryColor }}
                                title="Create invoice for this event"
                              >
                                + Invoice
                              </button>
                            )}
                            <button
                              onClick={() => { setEditingEventId(event.id); setEditingEvent({ ...event }); }}
                              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit event"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete event"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Freelancers Tab */}
        {activeTab === 'freelancers' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Freelancer Database</h2>
              <button
                onClick={() => setShowAddFreelancer(true)}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <Plus size={20} />
                Add Freelancer
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredFreelancers.map(freelancer => (
                <div key={freelancer.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{freelancer.name}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {freelancer.specialty}
                        </span>
                        {freelancer.w9 && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                            W-9 ✓
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-2">
                        <div>📧 {freelancer.email}</div>
                        <div>📱 {freelancer.phone}</div>
                        <div>💰 ${freelancer.rate}/event</div>
                        <div>📅 {freelancer.availability}</div>
                      </div>
                      {freelancer.notes && (
                        <div className="text-sm text-slate-700 italic mt-2">
                          Note: {freelancer.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditingFreelancer({ ...freelancer }); setShowEditFreelancer(true); }}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit freelancer"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteFreelancer(freelancer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete freelancer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-600 font-semibold">Total Spent</h3>
                  <DollarSign className="text-blue-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-slate-800">${stats.totalSpent.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-600 font-semibold">Avg Per Event</h3>
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-slate-800">${stats.averagePerEvent.toFixed(0)}</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-600 font-semibold">Total Events</h3>
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-slate-800">{invoices.length}</div>
              </div>
            </div>

            {/* Cost by Sport */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Average Cost by Sport</h2>
              <div className="space-y-4">
                {Object.entries(stats.sportStats).map(([sport, data]) => (
                  <div key={sport} className="border-b border-slate-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-700">{sport}</span>
                      <span className="text-slate-600">{data.count} events</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full"
                          style={{ width: `${(data.total / stats.totalSpent) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 min-w-[100px] text-right">
                        ${(data.total / data.count).toFixed(0)} avg
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      Total: ${data.total.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Monthly Costs</h2>
              <div className="space-y-4">
                {Object.entries(stats.monthlyStats).sort((a, b) => a[0].localeCompare(b[0])).map(([month, data]) => (
                  <div key={month} className="border-b border-slate-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-700">
                        {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-slate-600">{data.count} events</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: `${(data.total / stats.totalSpent) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 min-w-[100px] text-right">
                        ${data.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Branding Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Branding & Appearance</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">School Name</label>
                  <input
                    type="text"
                    value={branding.schoolName}
                    onChange={(e) => saveBranding({ ...branding, schoolName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mascot</label>
                  <input
                    type="text"
                    value={branding.mascot}
                    onChange={(e) => saveBranding({ ...branding, mascot: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => saveBranding({ ...branding, primaryColor: e.target.value })}
                      className="h-10 w-20 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => saveBranding({ ...branding, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => saveBranding({ ...branding, secondaryColor: e.target.value })}
                      className="h-10 w-20 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => saveBranding({ ...branding, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => saveBranding({ ...branding, accentColor: e.target.value })}
                      className="h-10 w-20 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.accentColor}
                      onChange={(e) => saveBranding({ ...branding, accentColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">School Logo</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (evt) => saveBranding({ ...branding, schoolLogo: evt.target.result });
                        reader.readAsDataURL(file);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {branding.schoolLogo && (
                      <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                        <img src={branding.schoolLogo} alt="Logo preview" className="h-12 w-12 object-contain rounded" />
                        <div className="flex-1 text-sm text-slate-600">Logo uploaded ✓</div>
                        <button
                          onClick={() => saveBranding({ ...branding, schoolLogo: '' })}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-400">PNG, JPG, GIF or SVG. Saved in your browser.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-semibold text-slate-700 mb-2">Preview:</div>
                <div className="flex items-center gap-3">
                  {branding.schoolLogo ? (
                    <img src={branding.schoolLogo} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-slate-200 bg-white p-1" />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      {branding.mascot.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg" style={{ color: branding.primaryColor }}>
                      {branding.schoolName}
                    </div>
                    <div className="text-sm" style={{ color: branding.secondaryColor }}>
                      {branding.mascot}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Company Settings</h2>
                <button
                  onClick={() => setShowAddCompany(true)}
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <Plus size={20} />
                  Add Company
                </button>
              </div>

              <div className="space-y-4">
                {companies.map(company => (
                  <div key={company.id} className="border border-slate-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">{company.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-slate-600">Payment Terms:</span>
                        <div className="text-slate-800 mt-1">{company.paymentTerms}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-600">Invoice Prefix:</span>
                        <div className="text-slate-800 mt-1">{company.invoicePrefix}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold text-slate-600">Bank Details:</span>
                        <div className="text-slate-800 mt-1">{company.bankDetails}</div>
                      </div>
                      {company.primaryColor && (
                        <div className="col-span-2 flex gap-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-600">Brand Colors:</span>
                            <div className="flex gap-2">
                              <div 
                                className="w-8 h-8 rounded border border-slate-300"
                                style={{ backgroundColor: company.primaryColor }}
                                title="Primary"
                              />
                              <div 
                                className="w-8 h-8 rounded border border-slate-300"
                                style={{ backgroundColor: company.secondaryColor }}
                                title="Secondary"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Freelancer Modal */}
      {showEditFreelancer && editingFreelancer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-800">Edit Freelancer</h3>
              <button onClick={() => { setShowEditFreelancer(false); setEditingFreelancer(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingFreelancer.name || ''}
                    onChange={e => setEditingFreelancer({ ...editingFreelancer, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={editingFreelancer.email || ''}
                    onChange={e => setEditingFreelancer({ ...editingFreelancer, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingFreelancer.phone || ''}
                    onChange={e => setEditingFreelancer({ ...editingFreelancer, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Rate ($/event)</label>
                  <input
                    type="number"
                    value={editingFreelancer.rate || ''}
                    onChange={e => setEditingFreelancer({ ...editingFreelancer, rate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Specialty / Role</label>
                  <select
                    value={editingFreelancer.specialty || ''}
                    onChange={e => setEditingFreelancer({ ...editingFreelancer, specialty: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select role</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Availability</label>
                  <input
                    type="text"
                    value={editingFreelancer.availability || ''}
                    onChange={e => setEditingFreelancer({ ...editingFreelancer, availability: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  value={editingFreelancer.notes || ''}
                  onChange={e => setEditingFreelancer({ ...editingFreelancer, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-w9"
                  checked={editingFreelancer.w9 || editingFreelancer.w9_on_file || false}
                  onChange={e => setEditingFreelancer({ ...editingFreelancer, w9: e.target.checked, w9_on_file: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="edit-w9" className="text-sm font-semibold text-slate-700">W-9 on file</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveEditFreelancer}
                  className="flex-1 text-white px-6 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setShowEditFreelancer(false); setEditingFreelancer(null); }}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Freelancer Modal */}
      {showAddFreelancer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-800">Add Freelancer</h3>
              <button onClick={() => setShowAddFreelancer(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newFreelancer.name}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, name: e.target.value })}
                  className="col-span-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={newFreelancer.email}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, email: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newFreelancer.phone}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, phone: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newFreelancer.specialty}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, specialty: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Specialty</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Rate per Event ($)"
                  value={newFreelancer.rate}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, rate: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Availability"
                  value={newFreelancer.availability}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, availability: e.target.value })}
                  className="col-span-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Performance notes"
                  value={newFreelancer.notes}
                  onChange={(e) => setNewFreelancer({ ...newFreelancer, notes: e.target.value })}
                  className="col-span-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <label className="col-span-2 flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={newFreelancer.w9}
                    onChange={(e) => setNewFreelancer({ ...newFreelancer, w9: e.target.checked })}
                    className="w-4 h-4"
                  />
                  W-9 on file
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addFreelancer}
                  className="flex-1 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Add Freelancer
                </button>
                <button
                  onClick={() => setShowAddFreelancer(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-800">Create Invoice</h3>
              <button onClick={() => setShowAddInvoice(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Events Section */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-slate-800">Events</h4>
                  <button
                    onClick={addEventToInvoice}
                    className="flex items-center gap-2 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <Plus size={16} />
                    Add Event
                  </button>
                </div>
                <div className="space-y-3">
                  {newInvoice.events.map((event, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Event Name *"
                            value={event.eventName}
                            onChange={(e) => updateEvent(index, 'eventName', e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="date"
                            value={event.eventDate}
                            onChange={(e) => updateEvent(index, 'eventDate', e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <select
                            value={event.sport}
                            onChange={(e) => updateEvent(index, 'sport', e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Sport *</option>
                            {sports.map(sport => (
                              <option key={sport} value={sport}>{sport}</option>
                            ))}
                          </select>
                        </div>
                        {newInvoice.events.length > 1 && (
                          <button
                            onClick={() => removeEvent(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company and Invoice Details */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newInvoice.company}
                  onChange={(e) => setNewInvoice({ ...newInvoice, company: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.name}>{company.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Invoice Number (auto-generated if blank)"
                  value={newInvoice.invoiceNumber}
                  onChange={(e) => setNewInvoice({ ...newInvoice, invoiceNumber: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-slate-800">Crew Members</h4>
                  <button
                    onClick={addCrewMember}
                    className="flex items-center gap-2 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <Plus size={16} />
                    Add Crew
                  </button>
                </div>
                <div className="space-y-3">
                  {newInvoice.crew.map((member, index) => (
                    <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg">
                      <select
                        value={member.freelancerId}
                        onChange={(e) => updateCrewMember(index, 'freelancerId', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Freelancer</option>
                        {freelancers.map(f => (
                          <option key={f.id} value={f.id}>{f.name} - {f.specialty}</option>
                        ))}
                      </select>
                      <select
                        value={member.role}
                        onChange={(e) => updateCrewMember(index, 'role', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={member.rate}
                        onChange={(e) => updateCrewMember(index, 'rate', parseFloat(e.target.value))}
                        placeholder="Rate"
                        className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeCrewMember(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                {newInvoice.crew.length > 0 && (
                  <div className="mt-4 text-right">
                    <span className="text-lg font-semibold text-slate-800">
                      Total: ${newInvoice.crew.reduce((sum, m) => sum + m.rate, 0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={addInvoice}
                  className="flex-1 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Create Invoice
                </button>
                <button
                  onClick={() => setShowAddInvoice(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {showEditInvoice && editingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-800">Edit Invoice</h3>
              <button onClick={() => { setShowEditInvoice(false); setEditingInvoice(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">

              {/* Invoice Number & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={editingInvoice.invoiceNumber || editingInvoice.invoice_number || ''}
                    onChange={e => setEditingInvoice({ ...editingInvoice, invoiceNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={editingInvoice.status}
                    onChange={e => setEditingInvoice({ ...editingInvoice, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              {/* Events */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Events</label>
                {editingInvoice.events.map((event, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Event name"
                      value={event.eventName || ''}
                      onChange={e => {
                        const updated = [...editingInvoice.events];
                        updated[idx] = { ...updated[idx], eventName: e.target.value };
                        setEditingInvoice({ ...editingInvoice, events: updated });
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={(event.eventDate || '').substring(0, 10)}
                      onChange={e => {
                        const updated = [...editingInvoice.events];
                        updated[idx] = { ...updated[idx], eventDate: e.target.value };
                        setEditingInvoice({ ...editingInvoice, events: updated });
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={event.sport || ''}
                      onChange={e => {
                        const updated = [...editingInvoice.events];
                        updated[idx] = { ...updated[idx], sport: e.target.value };
                        setEditingInvoice({ ...editingInvoice, events: updated });
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Crew */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Crew</label>
                {editingInvoice.crew.map((member, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      value={member.freelancerId || member.freelancer_id || ''}
                      onChange={e => {
                        const updated = [...editingInvoice.crew];
                        const freelancer = freelancers.find(f => f.id === parseInt(e.target.value));
                        updated[idx] = { ...updated[idx], freelancerId: parseInt(e.target.value), rate: freelancer?.rate || updated[idx].rate, role: freelancer?.specialty || updated[idx].role };
                        setEditingInvoice({ ...editingInvoice, crew: updated });
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select freelancer</option>
                      {freelancers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <select
                      value={member.role || ''}
                      onChange={e => {
                        const updated = [...editingInvoice.crew];
                        updated[idx] = { ...updated[idx], role: e.target.value };
                        setEditingInvoice({ ...editingInvoice, crew: updated });
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select role</option>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={member.rate || ''}
                        onChange={e => {
                          const updated = [...editingInvoice.crew];
                          updated[idx] = { ...updated[idx], rate: parseFloat(e.target.value) || 0 };
                          setEditingInvoice({ ...editingInvoice, crew: updated });
                        }}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Rate"
                      />
                      <button onClick={() => setEditingInvoice({ ...editingInvoice, crew: editingInvoice.crew.filter((_, i) => i !== idx) })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setEditingInvoice({ ...editingInvoice, crew: [...editingInvoice.crew, { freelancerId: '', role: '', rate: 0 }] })}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  + Add crew member
                </button>
              </div>

              {/* Total preview */}
              <div className="bg-slate-50 rounded-lg p-3 text-right">
                <span className="text-sm text-slate-600">New Total: </span>
                <span className="text-lg font-bold" style={{ color: branding.primaryColor }}>
                  ${editingInvoice.crew.reduce((sum, m) => sum + (parseFloat(m.rate) || 0), 0).toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveEditInvoice}
                  className="flex-1 text-white px-6 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setShowEditInvoice(false); setEditingInvoice(null); }}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-800">Add Company</h3>
              <button onClick={() => setShowAddCompany(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Company Name *"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="School Name"
                value={newCompany.schoolName}
                onChange={(e) => setNewCompany({ ...newCompany, schoolName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Payment Terms (e.g., Net 30)"
                value={newCompany.paymentTerms}
                onChange={(e) => setNewCompany({ ...newCompany, paymentTerms: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Bank Details"
                value={newCompany.bankDetails}
                onChange={(e) => setNewCompany({ ...newCompany, bankDetails: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Invoice Prefix (e.g., INV, BCST)"
                value={newCompany.invoicePrefix}
                onChange={(e) => setNewCompany({ ...newCompany, invoicePrefix: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newCompany.primaryColor}
                      onChange={(e) => setNewCompany({ ...newCompany, primaryColor: e.target.value })}
                      className="h-10 w-16 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newCompany.primaryColor}
                      onChange={(e) => setNewCompany({ ...newCompany, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newCompany.secondaryColor}
                      onChange={(e) => setNewCompany({ ...newCompany, secondaryColor: e.target.value })}
                      className="h-10 w-16 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newCompany.secondaryColor}
                      onChange={(e) => setNewCompany({ ...newCompany, secondaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <input
                type="url"
                placeholder="Logo URL (optional)"
                value={newCompany.logoUrl}
                onChange={(e) => setNewCompany({ ...newCompany, logoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addCompany}
                  className="flex-1 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Add Company
                </button>
                <button
                  onClick={() => setShowAddCompany(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Add Event Manually</h3>
              <button onClick={() => { setShowAddEvent(false); setNewEvent({ eventName: '', eventDate: '', sport: 'Football', opponent: '', isHome: true }); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Football vs NMSU"
                  value={newEvent.eventName}
                  onChange={e => setNewEvent({ ...newEvent, eventName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newEvent.eventDate}
                    onChange={e => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Sport *</label>
                  <select
                    value={newEvent.sport}
                    onChange={e => setNewEvent({ ...newEvent, sport: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sports.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Opponent *</label>
                  <input
                    type="text"
                    placeholder="e.g., NMSU"
                    value={newEvent.opponent}
                    onChange={e => setNewEvent({ ...newEvent, opponent: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location *</label>
                  <select
                    value={newEvent.isHome ? 'home' : 'away'}
                    onChange={e => setNewEvent({ ...newEvent, isHome: e.target.value === 'home' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="home">Home</option>
                    <option value="away">Away</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={addEvent}
                  className="flex-1 text-white px-6 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Add Event
                </button>
                <button
                  onClick={() => { setShowAddEvent(false); setNewEvent({ eventName: '', eventDate: '', sport: 'Football', opponent: '', isHome: true }); }}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Schedule Modal */}
      {showScheduleImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Import Athletics Schedule</h3>
              <button onClick={() => { setShowScheduleImport(false); setImportFilters({ location: 'all', sport: 'all' }); setImportPreview([]); setImportSelected([]); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">

              {/* Step 1 - URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Step 1 — Paste Schedule URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://utepminers.com/sports/mens-basketball/schedule"
                    value={scheduleUrl}
                    onChange={(e) => setScheduleUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={fetchSchedulePreview}
                    className="px-4 py-2 text-white rounded-lg font-semibold whitespace-nowrap"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    Fetch Events
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Use individual sport schedule pages for best results</p>
              </div>

              {/* Step 2 - Filters (shown after fetch) */}
              {importPreview.length > 0 && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Step 2 — Filter Events
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Location</label>
                        <select
                          value={importFilters.location}
                          onChange={e => {
                            const loc = e.target.value;
                            setImportFilters(f => ({ ...f, location: loc }));
                            setImportSelected(
                              importPreview
                                .filter(ev => loc === 'all' || (loc === 'home' ? ev.isHome : !ev.isHome))
                                .filter(ev => importFilters.sport === 'all' || ev.sport === importFilters.sport)
                                .map(ev => ev.tempId)
                            );
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Games (Home + Away)</option>
                          <option value="home">Home Games Only</option>
                          <option value="away">Away Games Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Sport</label>
                        <select
                          value={importFilters.sport}
                          onChange={e => {
                            const sp = e.target.value;
                            setImportFilters(f => ({ ...f, sport: sp }));
                            setImportSelected(
                              importPreview
                                .filter(ev => importFilters.location === 'all' || (importFilters.location === 'home' ? ev.isHome : !ev.isHome))
                                .filter(ev => sp === 'all' || ev.sport === sp)
                                .map(ev => ev.tempId)
                            );
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Sports</option>
                          {[...new Set(importPreview.map(e => e.sport))].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 - Select individual events */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Step 3 — Select Events to Import
                      </label>
                      <div className="flex gap-2 text-xs">
                        <button onClick={() => setImportSelected(importPreview.map(e => e.tempId))} className="text-blue-600 hover:underline">Select all</button>
                        <span className="text-slate-300">|</span>
                        <button onClick={() => setImportSelected([])} className="text-blue-600 hover:underline">Clear</button>
                      </div>
                    </div>
                    <div className="border border-slate-200 rounded-lg max-h-56 overflow-y-auto">
                      {importPreview
                        .filter(ev => importFilters.location === 'all' || (importFilters.location === 'home' ? ev.isHome : !ev.isHome))
                        .filter(ev => importFilters.sport === 'all' || ev.sport === importFilters.sport)
                        .map(ev => (
                          <label key={ev.tempId} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0">
                            <input
                              type="checkbox"
                              checked={importSelected.includes(ev.tempId)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setImportSelected(prev => [...prev, ev.tempId]);
                                } else {
                                  setImportSelected(prev => prev.filter(id => id !== ev.tempId));
                                }
                              }}
                              className="rounded"
                            />
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ev.isHome ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                              {ev.isHome ? 'Home' : 'Away'}
                            </span>
                            <span className="text-sm font-medium text-slate-800 flex-1">{ev.eventName}</span>
                            <span className="text-xs text-slate-500">{ev.eventDate}</span>
                          </label>
                        ))
                      }
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{importSelected.length} event{importSelected.length !== 1 ? 's' : ''} selected</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={importSchedule}
                  disabled={importSelected.length === 0}
                  className="flex-1 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Import {importSelected.length > 0 ? `${importSelected.length} Event${importSelected.length !== 1 ? 's' : ''}` : 'Schedule'}
                </button>
                <button
                  onClick={() => { setShowScheduleImport(false); setImportFilters({ location: 'all', sport: 'all' }); setImportPreview([]); setImportSelected([]); }}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleticsInvoiceApp;
