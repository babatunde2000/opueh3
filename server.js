const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  secret: 'demo-session-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-transaction', (req, res) => {
  const transactionData = {
    accountName: req.body.accountName,
    bankName: req.body.bankName,
    accountNumber: req.body.accountNumber,
    phoneNumber: req.body.phoneNumber,
    amount: req.body.amount,
    narration: req.body.narration,
    transactionDate: req.body.transactionDate,
    referenceNumber: generateDemoReferenceNumber(),
    submittedAt: new Date().toISOString()
  };

  // Save to session
  req.session.transactionData = transactionData;

  console.log('✅ Transaction processed:', transactionData);

  // Redirect to receipt page
  res.redirect('/receipt');
});

app.get('/receipt', (req, res) => {
  if (!req.session.transactionData) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'receipt.html'));
});

app.get('/details', (req, res) => {
  if (!req.session.transactionData) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'details.html'));
});

// API endpoint to get transaction data
app.get('/api/transaction-data', (req, res) => {
  if (!req.session.transactionData) {
    return res.status(404).json({ error: 'No transaction data found' });
  }
  res.json(req.session.transactionData);
});

function generateDemoReferenceNumber() {
  return Math.random().toString(36).substr(2, 12).toUpperCase();
}

app.listen(PORT, () => {
  console.log(`🚀 Receipt Generator App running on http://localhost:${PORT}`);
  console.log('📱 Mobile-optimized transaction receipt generator');
});