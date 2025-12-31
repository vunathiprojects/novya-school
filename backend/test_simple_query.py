#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

# Test simple query for student 21
student_id = 21

with connection.cursor() as cursor:
    print(f"\nTesting simple query for student_id = {student_id}\n")
    
    # First, get raw data
    cursor.execute("""
        SELECT subject, quarterly_score, half_yearly_score, annual_score
        FROM school_test_scores
        WHERE student_id = %s
    """, [student_id])
    
    raw_rows = cursor.fetchall()
    print(f"Raw data ({len(raw_rows)} rows):")
    for row in raw_rows:
        print(f"  Subject: '{row[0]}', Q: {row[1]}, HY: {row[2]}, AN: {row[3]}")
    
    # Now test normalization
    print("\n" + "="*60)
    print("Testing normalization:")
    print("="*60)
    
    cursor.execute("""
        SELECT 
            CASE 
                WHEN LOWER(TRIM(subject)) LIKE '%math%' OR LOWER(TRIM(subject)) LIKE '%mathematics%' THEN 'Mathematics'
                WHEN LOWER(TRIM(subject)) LIKE '%biology%' OR LOWER(TRIM(subject)) LIKE '%bio%' THEN 'Biology'
                WHEN LOWER(TRIM(subject)) LIKE '%physics%' OR LOWER(TRIM(subject)) LIKE '%phy%' THEN 'Physics'
                WHEN LOWER(TRIM(subject)) LIKE '%english%' OR LOWER(TRIM(subject)) LIKE '%eng%' THEN 'English'
                WHEN LOWER(TRIM(subject)) LIKE '%social%' OR LOWER(TRIM(subject)) LIKE '%history%' OR LOWER(TRIM(subject)) LIKE '%sst%' OR LOWER(TRIM(subject)) LIKE '%studies%' THEN 'History'
                WHEN LOWER(TRIM(subject)) LIKE '%hindi%' OR LOWER(TRIM(subject)) LIKE '%hin%' THEN 'Hindi'
                WHEN LOWER(TRIM(subject)) LIKE '%telugu%' OR LOWER(TRIM(subject)) LIKE '%tel%' THEN 'Telugu'
                ELSE TRIM(subject)
            END as normalized_subject,
            quarterly_score,
            half_yearly_score,
            annual_score
        FROM school_test_scores
        WHERE student_id = %s
        ORDER BY normalized_subject
    """, [student_id])
    
    norm_rows = cursor.fetchall()
    print(f"\nNormalized data ({len(norm_rows)} rows):")
    for row in norm_rows:
        print(f"  Normalized: '{row[0]}', Q: {row[1]}, HY: {row[2]}, AN: {row[3]}")

