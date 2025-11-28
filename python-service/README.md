# Python Analysis Service for StartupBoost

This microservice provides advanced text analysis capabilities:
- **Readability Analysis**: Flesch-Kincaid readability scoring
- **Keyword Analysis**: Keyword density and SEO optimization

## Installation

```bash
cd python-service
pip install -r requirements.txt
```

## Running the Service

```bash
python app.py
```

Service runs on `http://localhost:5000`

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### Readability Analysis
```bash
POST http://localhost:5000/analyze/readability
Content-Type: application/json

{
  "text": "Your website content here..."
}
```

**Response:**
```json
{
  "success": true,
  "metrics": {
    "fleschReadingEase": 65.2,
    "fleschKincaidGrade": 8.1,
    "avgSentenceLength": 15.3,
    "avgWordLength": 4.8,
    "difficulty": "Easy",
    "recommendation": "Good for most readers",
    "readabilityScore": 10
  }
}
```

### Keyword Analysis
```bash
POST http://localhost:5000/analyze/keywords
Content-Type: application/json

{
  "text": "Your website content...",
  "targetKeywords": ["payment", "stripe", "processing"]
}
```

**Response:**
```json
{
  "success": true,
  "topKeywords": [
    {"keyword": "payment", "count": 15, "density": 2.1},
    {"keyword": "business", "count": 12, "density": 1.8}
  ],
  "targetKeywords": [
    {"keyword": "payment", "count": 15, "density": 2.1, "isOptimal": true}
  ]
}
```

## Integration with Node.js

The Node.js backend calls this service via HTTP requests to enhance readability and SEO scoring.
