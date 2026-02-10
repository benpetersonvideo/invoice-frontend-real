// Backend Server - Express.js with PostgreSQL
// server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const cheerio = require('cheerio');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('combined'));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.school_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== FREELANCER ROUTES ====================

// Get all freelancers
app.get('/api/freelancers', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM freelancers WHERE school_id = $1 ORDER BY name ASC',
      [req.user.schoolId]
    );
    
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create freelancer
app.post('/api/freelancers', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, rate, specialty, w9, notes, availability } = req.body;
    
    const result = await pool.query(
      `INSERT INTO freelancers (school_id, name, email, phone, rate, specialty, w9_on_file, notes, availability)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.schoolId, name, email, phone, rate, specialty, w9, notes, availability]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create freelancer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update freelancer
app.put('/api/freelancers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, rate, specialty, w9, notes, availability } = req.body;
    
    const result = await pool.query(
      `UPDATE freelancers 
       SET name = $1, email = $2, phone = $3, rate = $4, specialty = $5, 
           w9_on_file = $6, notes = $7, availability = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND school_id = $10
       RETURNING *`,
      [name, email, phone, rate, specialty, w9, notes, availability, id, req.user.schoolId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Freelancer not found' });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update freelancer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete freelancer
app.delete('/api/freelancers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM freelancers WHERE id = $1 AND school_id = $2 RETURNING id',
      [id, req.user.schoolId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Freelancer not found' });
    }
    
    res.json({
      success: true,
      message: 'Freelancer deleted successfully',
    });
  } catch (error) {
    console.error('Delete freelancer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== INVOICE ROUTES ====================

// Get all invoices
app.get('/api/invoices', authenticateToken, async (req, res) => {
  try {
    const { status, startDate, endDate, sport } = req.query;
    
    let query = `
      SELECT i.*, 
             json_agg(DISTINCT jsonb_build_object(
               'eventName', ie.event_name,
               'eventDate', ie.event_date,
               'sport', ie.sport
             )) as events,
             json_agg(DISTINCT jsonb_build_object(
               'freelancerId', ic.freelancer_id,
               'freelancerName', f.name,
               'role', ic.role,
               'rate', ic.rate
             )) as crew
      FROM invoices i
      LEFT JOIN invoice_events ie ON i.id = ie.invoice_id
      LEFT JOIN invoice_crew ic ON i.id = ic.invoice_id
      LEFT JOIN freelancers f ON ic.freelancer_id = f.id
      WHERE i.school_id = $1
    `;
    
    const params = [req.user.schoolId];
    let paramIndex = 2;
    
    if (status) {
      query += ` AND i.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ' GROUP BY i.id ORDER BY i.created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create invoice
app.post('/api/invoices', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { events, crew, company, invoiceNumber } = req.body;
    const total = crew.reduce((sum, member) => sum + parseFloat(member.rate), 0);
    
    // Get company_id
    const companyResult = await client.query(
      'SELECT id FROM companies WHERE name = $1 AND school_id = $2',
      [company, req.user.schoolId]
    );
    
    if (companyResult.rows.length === 0) {
      throw new Error('Company not found');
    }
    
    const companyId = companyResult.rows[0].id;
    
    // Create invoice
    const invoiceResult = await client.query(
      `INSERT INTO invoices (school_id, invoice_number, company_id, total, status)
       VALUES ($1, $2, $3, $4, 'Draft')
       RETURNING *`,
      [req.user.schoolId, invoiceNumber, companyId, total]
    );
    
    const invoiceId = invoiceResult.rows[0].id;
    
    // Insert events
    for (const event of events) {
      await client.query(
        `INSERT INTO invoice_events (invoice_id, event_name, event_date, sport)
         VALUES ($1, $2, $3, $4)`,
        [invoiceId, event.eventName, event.eventDate, event.sport]
      );
    }
    
    // Insert crew
    for (const member of crew) {
      await client.query(
        `INSERT INTO invoice_crew (invoice_id, freelancer_id, role, rate)
         VALUES ($1, $2, $3, $4)`,
        [invoiceId, member.freelancerId, member.role, member.rate]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: invoiceResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create invoice error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  } finally {
    client.release();
  }
});

// Export invoice to PDF
app.post('/api/invoices/:id/export-pdf', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get invoice with all related data
    const invoiceResult = await pool.query(
      `SELECT i.*, c.name as company_name, c.payment_terms, c.bank_details,
              c.primary_color, c.school_name,
              json_agg(DISTINCT jsonb_build_object(
                'eventName', ie.event_name,
                'eventDate', ie.event_date::text,
                'sport', ie.sport
              )) as events,
              json_agg(DISTINCT jsonb_build_object(
                'freelancerName', f.name,
                'role', ic.role,
                'rate', ic.rate
              )) as crew
       FROM invoices i
       LEFT JOIN companies c ON i.company_id = c.id
       LEFT JOIN invoice_events ie ON i.id = ie.invoice_id
       LEFT JOIN invoice_crew ic ON i.id = ic.invoice_id
       LEFT JOIN freelancers f ON ic.freelancer_id = f.id
       WHERE i.id = $1 AND i.school_id = $2
       GROUP BY i.id, c.name, c.payment_terms, c.bank_details, c.primary_color, c.school_name`,
      [id, req.user.schoolId]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const invoice = invoiceResult.rows[0];
    const brandColor = invoice.primary_color || '#2563eb';

    // Helper to convert hex color to RGB for PDFKit
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [37, 99, 235];
    };
    const [r, g, b] = hexToRgb(brandColor);

    // Build PDF in memory
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));

    // ── Header bar
    doc.rect(0, 0, doc.page.width, 80).fill(`rgb(${r},${g},${b})`);
    doc.fillColor('white').fontSize(24).font('Helvetica-Bold')
       .text(invoice.school_name || 'Athletics', 50, 25);
    doc.fontSize(11).font('Helvetica')
       .text('Broadcast Crew Invoice', 50, 52);

    // ── Invoice meta
    doc.fillColor('#1e293b').fontSize(20).font('Helvetica-Bold')
       .text('INVOICE', 370, 25);
    doc.fontSize(10).font('Helvetica')
       .text(`Invoice #: ${invoice.invoice_number}`, 370, 52)
       .text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 370, 66);

    // ── Divider
    doc.moveTo(50, 100).lineTo(545, 100).strokeColor(`rgb(${r},${g},${b})`).lineWidth(2).stroke();

    // ── Company / Bill To
    doc.fillColor('#64748b').fontSize(9).font('Helvetica-Bold')
       .text('BILL TO', 50, 115);
    doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold')
       .text(invoice.company_name || 'University Athletics', 50, 128);
    doc.fontSize(9).font('Helvetica').fillColor('#475569')
       .text(`Payment Terms: ${invoice.payment_terms || 'Net 30'}`, 50, 143);

    // ── Events section
    let y = 180;
    doc.fillColor(`rgb(${r},${g},${b})`).fontSize(10).font('Helvetica-Bold')
       .text('EVENTS', 50, y);
    y += 16;

    const events = invoice.events || [];
    events.forEach(event => {
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica')
         .text(`• ${event.eventName}`, 60, y)
         .text(event.eventDate, 400, y);
      y += 16;
    });

    // ── Crew table header
    y += 10;
    doc.rect(50, y, 495, 24).fill(`rgb(${r},${g},${b})`);
    doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
       .text('CREW MEMBER', 60, y + 7)
       .text('ROLE', 250, y + 7)
       .text('RATE', 470, y + 7, { align: 'right', width: 65 });
    y += 24;

    // ── Crew rows
    const crew = invoice.crew || [];
    crew.forEach((member, i) => {
      const rowColor = i % 2 === 0 ? '#f8fafc' : '#ffffff';
      doc.rect(50, y, 495, 22).fill(rowColor);
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica')
         .text(member.freelancerName || '—', 60, y + 6)
         .text(member.role || '—', 250, y + 6)
         .text(`$${parseFloat(member.rate).toFixed(2)}`, 470, y + 6, { align: 'right', width: 65 });
      y += 22;
    });

    // ── Total
    y += 10;
    doc.rect(370, y, 175, 36).fill(`rgb(${r},${g},${b})`);
    doc.fillColor('white').fontSize(12).font('Helvetica-Bold')
       .text('TOTAL DUE', 380, y + 10)
       .text(`$${parseFloat(invoice.total).toFixed(2)}`, 470, y + 10, { align: 'right', width: 65 });

    // ── Payment details
    y += 55;
    doc.fillColor('#64748b').fontSize(9).font('Helvetica-Bold').text('PAYMENT DETAILS', 50, y);
    y += 14;
    doc.fillColor('#475569').fontSize(9).font('Helvetica')
       .text(invoice.bank_details || 'Contact accounting for payment details.', 50, y, { width: 400 });

    // ── Watermark
    doc.save();
    doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] });
    doc.fillColor(`rgb(${r},${g},${b})`).opacity(0.06).fontSize(72).font('Helvetica-Bold')
       .text(invoice.school_name || 'ATHLETICS', 80, doc.page.height / 2 - 40);
    doc.restore();

    // ── Footer
    doc.opacity(1).fillColor('#94a3b8').fontSize(8).font('Helvetica')
       .text(`Generated by ${invoice.school_name || 'Athletics'} Invoice Manager`, 50, doc.page.height - 40, {
         align: 'center', width: doc.page.width - 100
       });

    doc.end();

    // Wait for PDF to finish generating then send it
    await new Promise(resolve => doc.on('end', resolve));
    const pdfBuffer = Buffer.concat(chunks);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({ success: false, message: 'Server error generating PDF' });
  }
});

// Send invoice via email
app.post('/api/invoices/:id/send-email', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { to } = req.body;

    // Get invoice data
    const invoiceResult = await pool.query(
      `SELECT i.*, c.name as company_name, c.payment_terms, c.school_name,
              json_agg(DISTINCT jsonb_build_object(
                'eventName', ie.event_name,
                'eventDate', ie.event_date::text,
                'sport', ie.sport
              )) as events
       FROM invoices i
       LEFT JOIN companies c ON i.company_id = c.id
       LEFT JOIN invoice_events ie ON i.id = ie.invoice_id
       WHERE i.id = $1 AND i.school_id = $2
       GROUP BY i.id, c.name, c.payment_terms, c.school_name`,
      [id, req.user.schoolId]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const invoice = invoiceResult.rows[0];
    const schoolName = invoice.school_name || 'University Athletics';
    const eventList = (invoice.events || [])
      .map(e => `<li>${e.eventName} — ${e.eventDate}</li>`)
      .join('');

    // Generate PDF to attach
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));

    doc.fontSize(20).font('Helvetica-Bold').text(`INVOICE — ${invoice.invoice_number}`, 50, 50);
    doc.fontSize(12).font('Helvetica').text(`${schoolName}`, 50, 80);
    doc.text(`Total: $${parseFloat(invoice.total).toFixed(2)}`, 50, 100);
    doc.text(`Payment Terms: ${invoice.payment_terms || 'Net 30'}`, 50, 120);
    doc.end();

    await new Promise(resolve => doc.on('end', resolve));
    const pdfBuffer = Buffer.concat(chunks);

    // Build and send email via SendGrid
    const msg = {
      to: Array.isArray(to) ? to : [to],
      from: process.env.FROM_EMAIL,
      subject: `Invoice ${invoice.invoice_number} — ${schoolName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">${schoolName}</h1>
            <p style="color: #bfdbfe; margin: 4px 0 0;">Broadcast Crew Invoice</p>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Please find your invoice attached for the following event(s):</p>
            <ul>${eventList}</ul>
            <p style="font-size: 18px; font-weight: bold;">
              Total Due: $${parseFloat(invoice.total).toFixed(2)}
            </p>
            <p style="color: #64748b; font-size: 13px;">
              Payment Terms: ${invoice.payment_terms || 'Net 30'}<br>
              Invoice #: ${invoice.invoice_number}
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #94a3b8; font-size: 11px; text-align: center;">
              This is an automated message from ${schoolName} Invoice Manager.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `${invoice.invoice_number}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);

    // Update invoice status to Sent
    await pool.query(
      'UPDATE invoices SET status = $1, sent_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['Sent', id]
    );

    res.json({
      success: true,
      data: {
        sentTo: msg.to.length,
        sentAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// ==================== STATISTICS ROUTES ====================

// Get overview statistics
app.get('/api/statistics/overview', authenticateToken, async (req, res) => {
  try {
    // Total spent
    const totalResult = await pool.query(
      'SELECT COALESCE(SUM(total), 0) as total_spent, COUNT(*) as total_events FROM invoices WHERE school_id = $1',
      [req.user.schoolId]
    );
    
    // By sport
    const sportResult = await pool.query(
      `SELECT ie.sport, SUM(i.total) as total, COUNT(DISTINCT i.id) as count
       FROM invoices i
       JOIN invoice_events ie ON i.id = ie.invoice_id
       WHERE i.school_id = $1
       GROUP BY ie.sport`,
      [req.user.schoolId]
    );
    
    // By month
    const monthResult = await pool.query(
      `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(total) as total, COUNT(*) as count
       FROM invoices
       WHERE school_id = $1
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY month DESC`,
      [req.user.schoolId]
    );
    
    const totalSpent = parseFloat(totalResult.rows[0].total_spent);
    const totalEvents = parseInt(totalResult.rows[0].total_events);
    
    const sportStats = {};
    sportResult.rows.forEach(row => {
      sportStats[row.sport] = {
        total: parseFloat(row.total),
        count: parseInt(row.count),
        average: parseFloat(row.total) / parseInt(row.count),
      };
    });
    
    const monthlyStats = {};
    monthResult.rows.forEach(row => {
      monthlyStats[row.month] = {
        total: parseFloat(row.total),
        count: parseInt(row.count),
      };
    });
    
    res.json({
      success: true,
      data: {
        totalSpent,
        averagePerEvent: totalEvents > 0 ? totalSpent / totalEvents : 0,
        totalEvents,
        sportStats,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== SCHEDULE IMPORT ====================

// Import schedule from university athletics URL
app.post('/api/events/import-schedule', authenticateToken, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    // Fetch the page
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // Strategy 1: Look for common athletics schedule table patterns
    $('table tr, .schedule-item, .game-row, .event-row, [class*="schedule"], [class*="game"]').each((i, el) => {
      const text = $(el).text().trim();
      if (!text || text.length < 5) return;

      // Try to find a date pattern in the row
      const dateMatch = text.match(
        /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s*\d{0,4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
      );

      if (dateMatch) {
        // Try to parse the opponent — look for "vs" or "at" patterns
        const vsMatch = text.match(/(?:vs\.?|vs\s|@|at\s)\s*([A-Z][^,\n\t]+?)(?:\s{2,}|$|\t)/i);
        const opponent = vsMatch ? vsMatch[1].trim() : 'Opponent TBD';
        const isHome = /\bvs\.?\b/i.test(text);

        // Try to detect sport from context
        let sport = 'TBD';
        const sportKeywords = {
          Football: /football/i,
          Basketball: /basketball/i,
          Soccer: /soccer/i,
          Baseball: /baseball/i,
          Softball: /softball/i,
          Volleyball: /volleyball/i,
          Hockey: /hockey/i,
          Lacrosse: /lacrosse/i,
        };
        for (const [name, pattern] of Object.entries(sportKeywords)) {
          if (pattern.test(url) || pattern.test(text)) {
            sport = name;
            break;
          }
        }

        // Parse and format the date
        let eventDate = null;
        try {
          const parsed = new Date(dateMatch[1]);
          if (!isNaN(parsed)) {
            // Default to current year if year missing
            if (parsed.getFullYear() < 2000) {
              parsed.setFullYear(new Date().getFullYear());
            }
            eventDate = parsed.toISOString().split('T')[0];
          }
        } catch {}

        if (eventDate) {
          events.push({
            eventName: `${sport} vs ${opponent}`,
            eventDate,
            sport,
            opponent,
            isHome,
            invoiced: false,
          });
        }
      }
    });

    // Remove duplicates by date + opponent
    const unique = events.filter((e, index, self) =>
      index === self.findIndex(t => t.eventDate === e.eventDate && t.opponent === e.opponent)
    );

    // Save to database
    let saved = 0;
    for (const event of unique) {
      try {
        await pool.query(
          `INSERT INTO events (school_id, event_name, event_date, sport, opponent, is_home, invoiced)
           VALUES ($1, $2, $3, $4, $5, $6, false)
           ON CONFLICT DO NOTHING`,
          [req.user.schoolId, event.eventName, event.eventDate, event.sport, event.opponent, event.isHome]
        );
        saved++;
      } catch {}
    }

    res.json({
      success: true,
      data: {
        found: unique.length,
        saved,
        events: unique,
        message: unique.length === 0
          ? 'No events found. The schedule page may require a different format — try pasting the schedule manually.'
          : `Successfully imported ${saved} events.`
      },
    });

  } catch (error) {
    console.error('Schedule import error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Could not fetch that URL. Make sure it is a public page and try again.'
    });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end();
  process.exit(0);
});
