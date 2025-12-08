"""
AWS Lambda Handler for Python Analysis Service
Standalone Lambda function for text analysis
"""

import json
import re
from collections import Counter
import textstat


def analyze(event, context):
    """
    Lambda handler for readability analysis
    Can be triggered via API Gateway or direct invocation
    """
    try:
        # Parse request body
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        text = body.get('text', '')
        
        if not text or len(text) < 50:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Text too short for analysis (minimum 50 chars)'
                })
            }
        
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
        
        # Score out of 10
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
        
        result = {
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
                'characterCount': len(text)
            }
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(result)
        }
        
    except Exception as e:
        print(f"Error in Lambda handler: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
