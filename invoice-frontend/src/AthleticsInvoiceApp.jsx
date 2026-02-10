import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, BarChart3, Settings, Plus, Search, Download, Mail, X, Edit2, Trash2, DollarSign, Clock, TrendingUp } from 'lucide-react';

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

  const [branding, setBranding] = useState({
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    schoolName: 'State University',
    schoolLogo: '',
    mascot: 'Eagles'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFreelancer, setShowAddFreelancer] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showScheduleImport, setShowScheduleImport] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [scheduleUrl, setScheduleUrl] = useState('');

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
      totalSpent += invoice.total;
      
      // Use first event for sport categorization
      const primaryEvent = invoice.events[0];
      const sport = primaryEvent.sport;
      const month = primaryEvent.eventDate.substring(0, 7);
      
      // Sport stats
      if (!sportStats[sport]) {
        sportStats[sport] = { total: 0, count: 0 };
      }
      sportStats[sport].total += invoice.total;
      sportStats[sport].count += 1;

      // Monthly stats
      if (!monthlyStats[month]) {
        monthlyStats[month] = { total: 0, count: 0 };
      }
      monthlyStats[month].total += invoice.total;
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

  const addFreelancer = () => {
    if (newFreelancer.name && newFreelancer.email) {
      setFreelancers([...freelancers, { ...newFreelancer, id: Date.now(), rate: parseFloat(newFreelancer.rate) || 0 }]);
      setNewFreelancer({ name: '', email: '', phone: '', rate: '', specialty: '', w9: false, notes: '', availability: '' });
      setShowAddFreelancer(false);
    }
  };

  const deleteFreelancer = (id) => {
    setFreelancers(freelancers.filter(f => f.id !== id));
  };

  const addInvoice = () => {
    const validEvents = newInvoice.events.filter(e => e.eventName && e.eventDate && e.sport);
    if (validEvents.length > 0 && newInvoice.crew.length > 0) {
      const total = newInvoice.crew.reduce((sum, member) => sum + member.rate, 0);
      const company = companies.find(c => c.name === newInvoice.company);
      const invoiceNum = newInvoice.invoiceNumber || `${company.invoicePrefix}-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
      
      setInvoices([...invoices, {
        id: Date.now(),
        events: validEvents,
        crew: newInvoice.crew,
        total,
        status: 'Draft',
        invoiceNumber: invoiceNum,
        company: newInvoice.company
      }]);
      
      setNewInvoice({
        events: [{ eventName: '', eventDate: '', sport: '' }],
        crew: [],
        company: 'University Athletics',
        invoiceNumber: ''
      });
      setShowAddInvoice(false);
    }
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

  const addCompany = () => {
    if (newCompany.name) {
      setCompanies([...companies, { ...newCompany, id: Date.now() }]);
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
    }
  };

  const importSchedule = () => {
    // Simulate schedule import
    alert(`Importing schedule from: ${scheduleUrl}\n\nNote: In a production app, this would scrape the athletics website and parse the schedule data.`);
    setScheduleUrl('');
    setShowScheduleImport(false);
  };

  const exportToPDF = (invoice) => {
    alert(`Exporting invoice ${invoice.invoiceNumber} to PDF\n\nNote: In a production app, this would generate a professional PDF with company letterhead and all invoice details.`);
  };

  const sendEmail = (invoice) => {
    const crewEmails = invoice.crew.map(member => {
      const freelancer = freelancers.find(f => f.id === member.freelancerId);
      return freelancer ? freelancer.email : '';
    }).filter(Boolean).join(', ');
    
    alert(`Sending invoice ${invoice.invoiceNumber} via email\n\nTo: ${crewEmails}\n\nNote: In a production app, this would send the PDF invoice via email with a school watermark.`);
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
                          {invoice.events.length === 1 
                            ? invoice.events[0].eventName 
                            : `${invoice.events.length} Events - ${invoice.events[0].sport}`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      {invoice.events.length > 1 && (
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
                        <div>Invoice #: {invoice.invoiceNumber}</div>
                        <div>Date: {invoice.events[0].eventDate}</div>
                        <div>Sport: {invoice.events[0].sport}</div>
                        <div>Crew: {invoice.crew.length} members</div>
                      </div>
                      <div className="text-sm text-slate-700">
                        <strong>Crew:</strong> {invoice.crew.map(member => {
                          const freelancer = freelancers.find(f => f.id === member.freelancerId);
                          return freelancer ? `${freelancer.name} (${member.role})` : member.role;
                        }).join(', ')}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-slate-800 mb-3">${invoice.total}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportToPDF(invoice)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Export to PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => sendEmail(invoice)}
                          className="p-2 hover:bg-blue-200 text-white rounded-lg transition-colors"
                          style={{ backgroundColor: branding.primaryColor }}
                          title="Send Email"
                        >
                          <Mail size={18} />
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
              <button
                onClick={() => setShowScheduleImport(true)}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <Plus size={20} />
                Import Schedule
              </button>
            </div>

            <div className="space-y-3">
              {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => (
                <div key={event.id} className="flex items-center justify-between border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="text-center bg-blue-50 rounded-lg p-3 min-w-[80px]">
                      <div className="text-sm font-semibold text-blue-600">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-2xl font-bold text-slate-800">
                        {new Date(event.date).getDate()}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{event.sport}</h3>
                      <p className="text-sm text-slate-600">
                        vs {event.opponent} {event.home ? '(Home)' : '(Away)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {event.invoiced ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Invoiced
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                    <button
                      onClick={() => deleteFreelancer(freelancer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete freelancer"
                    >
                      <Trash2 size={18} />
                    </button>
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
                    onChange={(e) => setBranding({ ...branding, schoolName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mascot</label>
                  <input
                    type="text"
                    value={branding.mascot}
                    onChange={(e) => setBranding({ ...branding, mascot: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="h-10 w-20 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
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
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="h-10 w-20 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
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
                      onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                      className="h-10 w-20 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.accentColor}
                      onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">School Logo URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={branding.schoolLogo}
                    onChange={(e) => setBranding({ ...branding, schoolLogo: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-semibold text-slate-700 mb-2">Preview:</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {branding.mascot.charAt(0)}
                  </div>
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

      {/* Import Schedule Modal */}
      {showScheduleImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Import Athletics Schedule</h3>
              <button onClick={() => setShowScheduleImport(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  University Athletics Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://university.edu/athletics/schedule"
                  value={scheduleUrl}
                  onChange={(e) => setScheduleUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-slate-600 mt-2">
                  Enter the URL of your university's athletics schedule page. The app will scrape and import upcoming events.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={importSchedule}
                  className="flex-1 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Import Schedule
                </button>
                <button
                  onClick={() => setShowScheduleImport(false)}
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