/**
 * AWS Lambda Handler for StartupBoost
 * This converts the Express app to work with API Gateway + Lambda
 */

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('../src/routes/analyze');
const { initializeAI } = require('../src/services/aiAnalyzer');

const app = express();

// Initialize AI on cold start
let aiInitialized = false;
if (!aiInitialized) {
  initializeAI();
  aiInitialized = true;
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', analyzeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'StartupBoost Lambda is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'StartupBoost API',
    version: '1.0.0',
    endpoints: {
      analyze: '/api/analyze',
      health: '/health'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Export the handler
module.exports.handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});
