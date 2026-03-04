const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to serve the PDF file
app.get('/api/pdf', (req, res) => {
  const pdfPath = path.join(__dirname, 'NguyenHuuThai_CV.pdf');
  
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: 'PDF file not found' });
  }
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="NguyenHuuThai_CV.pdf"');
  
  const stream = fs.createReadStream(pdfPath);
  stream.pipe(res);
});

// Download endpoint
app.get('/api/download', (req, res) => {
  const pdfPath = path.join(__dirname, 'NguyenHuuThai_CV.pdf');
  
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: 'PDF file not found' });
  }
  
  res.download(pdfPath, 'NguyenHuuThai_CV.pdf');
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🚀 CV Showcase is running!`);
  console.log(`  📄 Open http://localhost:${PORT} in your browser\n`);
});
