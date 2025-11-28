require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const analyzeRoutes = require('./routes/analyze');
const { initializeAI } = require('./services/aiAnalyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize AI on startup
initializeAI();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', analyzeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Website analyzer is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Analyze endpoint: http://localhost:${PORT}/api/analyze`);
});
