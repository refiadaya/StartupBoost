"""
Python Microservice for Advanced Text Analysis
Provides readability scoring and keyword analysis for StartupBoost
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from collections import Counter
import textstat

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'StartupBoost Python Analysis Service',
        'version': '1.0.0'
    })

@app.route('/analyze/readability', methods=['POST'])
def analyze_readability():
    """
    Analyze text readability using multiple metrics:
    - Flesch Reading Ease (0-100, higher = easier)
    - Flesch-Kincaid Grade Level
    - Average sentence length
    - Average word length
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text or len(text) < 50:
            return jsonify({
                'success': False,
                'error': 'Text too short for analysis (minimum 50 chars)'
            }), 400
        
        # Calculate readability metrics
        flesch_reading_ease = textstat.flesch_reading_ease(text)
        flesch_kincaid_grade = textstat.flesch_kincaid_grade(text)
        
        # Calculate basic statistics
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        words = text.split()
        
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        
        # Interpret Flesch Reading Ease
        if flesch_reading_ease >= 80:
            difficulty = "Very Easy"
            recommendation = "Perfect for general audience"
        elif flesch_reading_ease >= 60:
            difficulty = "Easy"
            recommendation = "Good for most readers"
        elif flesch_reading_ease >= 50:
            difficulty = "Fairly Difficult"
            recommendation = "Requires some concentration"
        elif flesch_reading_ease >= 30:
            difficulty = "Difficult"
            recommendation = "Consider simplifying language"
        else:
            difficulty = "Very Difficult"
            recommendation = "Too complex - simplify significantly"
        
        # Score out of 10 for our system (60-80 is ideal for startups)
        if 60 <= flesch_reading_ease <= 80:
            readability_score = 10
        elif 50 <= flesch_reading_ease < 60:
            readability_score = 8
        elif 80 < flesch_reading_ease <= 90:
            readability_score = 8
        elif 40 <= flesch_reading_ease < 50:
            readability_score = 6
        elif 90 < flesch_reading_ease <= 100:
            readability_score = 7
        elif 30 <= flesch_reading_ease < 40:
            readability_score = 4
        else:
            readability_score = 2
        
        return jsonify({
            'success': True,
            'metrics': {
                'fleschReadingEase': round(flesch_reading_ease, 1),
                'fleschKincaidGrade': round(flesch_kincaid_grade, 1),
                'avgSentenceLength': round(avg_sentence_length, 1),
                'avgWordLength': round(avg_word_length, 1),
                'difficulty': difficulty,
                'recommendation': recommendation,
                'readabilityScore': readability_score
            },
            'analysis': {
                'sentenceCount': len(sentences),
                'wordCount': len(words),
                'isOptimal': 60 <= flesch_reading_ease <= 80
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/analyze/keywords', methods=['POST'])
def analyze_keywords():
    """
    Analyze keyword usage and density:
    - Top keywords by frequency
    - Keyword density percentages
    - SEO recommendations
    """
    try:
        data = request.get_json()
        text = data.get('text', '').lower()
        target_keywords = data.get('targetKeywords', [])
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
        
        # Remove common stop words
        stop_words = {
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
            'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'is'
        }
        
        # Extract words (alphanumeric only)
        words = re.findall(r'\b[a-z]{3,}\b', text)
        words = [w for w in words if w not in stop_words]
        
        total_words = len(words)
        
        # Count keyword frequencies
        word_counts = Counter(words)
        top_keywords = word_counts.most_common(20)
        
        # Calculate densities
        keyword_density = []
        for word, count in top_keywords:
            density = (count / total_words * 100) if total_words > 0 else 0
            keyword_density.append({
                'keyword': word,
                'count': count,
                'density': round(density, 2)
            })
        
        # Check target keywords if provided
        target_keyword_analysis = []
        if target_keywords:
            for kw in target_keywords:
                kw_lower = kw.lower()
                count = text.count(kw_lower)
                density = (count / total_words * 100) if total_words > 0 else 0
                target_keyword_analysis.append({
                    'keyword': kw,
                    'count': count,
                    'density': round(density, 2),
                    'isOptimal': 0.5 <= density <= 2.5  # SEO best practice
                })
        
        # SEO recommendations
        recommendations = []
        if not keyword_density:
            recommendations.append("Add more descriptive content")
        elif keyword_density[0]['density'] > 3:
            recommendations.append(f"Keyword '{keyword_density[0]['keyword']}' may be overused (density: {keyword_density[0]['density']}%)")
        
        return jsonify({
            'success': True,
            'topKeywords': keyword_density[:10],
            'targetKeywords': target_keyword_analysis,
            'statistics': {
                'totalWords': total_words,
                'uniqueWords': len(word_counts),
                'vocabularyRichness': round(len(word_counts) / total_words * 100, 1) if total_words > 0 else 0
            },
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print('🐍 Python Analysis Service starting...')
    print('📊 Readability endpoint: http://localhost:5000/analyze/readability')
    print('🔍 Keywords endpoint: http://localhost:5000/analyze/keywords')
    app.run(host='0.0.0.0', port=5000, debug=True)
