# Multi-stage Dockerfile for StartupBoost
# Optimized for AWS EC2/ECS deployment

# Stage 1: Python service build
FROM python:3.11-slim as python-builder

WORKDIR /python-service

# Copy Python requirements and install dependencies
COPY python-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python service code
COPY python-service/ .

# Stage 2: Node.js application
FROM node:18-alpine

# Install Python runtime for the microservice
RUN apk add --no-cache python3 py3-pip

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy Python dependencies from builder
COPY --from=python-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=python-builder /python-service /app/python-service

# Copy application code
COPY src/ ./src/
COPY public/ ./public/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start script will be handled by docker-compose or startup script
CMD ["node", "src/server.js"]
