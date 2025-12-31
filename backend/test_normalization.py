#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

# Test the normalization query for student 21
student_id = 21

with connection.cursor() as cursor:
    print(f"\nTesting normalization query for student_id = {student_id}\n")
    
    cursor.execute("""
        SELECT 
            CASE 
                WHEN LOWER(TRIM(subject)) LIKE '%math%' OR LOWER(TRIM(subject)) LIKE '%mathematics%' THEN 'Mathematics'
                WHEN LOWER(TRIM(subject)) LIKE '%biology%' OR LOWER(TRIM(subject)) LIKE '%bio%' THEN 'Biology'
                WHEN LOWER(TRIM(subject)) LIKE '%physics%' OR LOWER(TRIM(subject)) LIKE '%phy%' THEN 'Physics'
                WHEN LOWER(TRIM(subject)) LIKE '%english%' OR LOWER(TRIM(subject)) LIKE '%eng%' THEN 'English'
                WHEN LOWER(TRIM(subject)) LIKE '%social%' OR LOWER(TRIM(subject)) LIKE '%history%' OR LOWER(TRIM(subject)) LIKE '%sst%' OR LOWER(TRIM(subject)) LIKE '%studies%' THEN 'History'
                WHEN LOWER(TRIM(subject)) LIKE '%computer%' OR LOWER(TRIM(subject)) LIKE '%comp%' OR LOWER(TRIM(subject)) LIKE '%cs%' THEN 'Computer'
                WHEN LOWER(TRIM(subject)) LIKE '%science%' OR LOWER(TRIM(subject)) LIKE '%sci%' THEN 'Science'
                WHEN LOWER(TRIM(subject)) LIKE '%hindi%' OR LOWER(TRIM(subject)) LIKE '%hin%' THEN 'Hindi'
                WHEN LOWER(TRIM(subject)) LIKE '%telugu%' OR LOWER(TRIM(subject)) LIKE '%tel%' THEN 'Telugu'
                ELSE TRIM(subject)
            END as normalized_subject,
            quarterly_score,
            half_yearly_score,
            annual_score
        FROM (
            SELECT 
                subject,
                quarterly_score,
                half_yearly_score,
                annual_score,
                ROW_NUMBER() OVER (
                    PARTITION BY 
                        CASE 
                            WHEN LOWER(TRIM(subject)) LIKE '%math%' OR LOWER(TRIM(subject)) LIKE '%mathematics%' THEN 'Mathematics'
                            WHEN LOWER(TRIM(subject)) LIKE '%biology%' OR LOWER(TRIM(subject)) LIKE '%bio%' THEN 'Biology'
                            WHEN LOWER(TRIM(subject)) LIKE '%physics%' OR LOWER(TRIM(subject)) LIKE '%phy%' THEN 'Physics'
                            WHEN LOWER(TRIM(subject)) LIKE '%english%' OR LOWER(TRIM(subject)) LIKE '%eng%' THEN 'English'
                            WHEN LOWER(TRIM(subject)) LIKE '%social%' OR LOWER(TRIM(subject)) LIKE '%history%' OR LOWER(TRIM(subject)) LIKE '%sst%' OR LOWER(TRIM(subject)) LIKE '%studies%' THEN 'History'
                            WHEN LOWER(TRIM(subject)) LIKE '%computer%' OR LOWER(TRIM(subject)) LIKE '%comp%' OR LOWER(TRIM(subject)) LIKE '%cs%' THEN 'Computer'
                            WHEN LOWER(TRIM(subject)) LIKE '%science%' OR LOWER(TRIM(subject)) LIKE '%sci%' THEN 'Science'
                            WHEN LOWER(TRIM(subject)) LIKE '%hindi%' OR LOWER(TRIM(subject)) LIKE '%hin%' THEN 'Hindi'
                            WHEN LOWER(TRIM(subject)) LIKE '%telugu%' OR LOWER(TRIM(subject)) LIKE '%tel%' THEN 'Telugu'
                            ELSE TRIM(subject)
                        END
                    ORDER BY updated_at DESC, academic_year DESC
                ) as rn
            FROM school_test_scores
            WHERE student_id = %s
        ) ranked
        WHERE rn = 1
        ORDER BY normalized_subject
    """, [student_id])
    
    rows = cursor.fetchall()
    print(f"Found {len(rows)} normalized records:\n")
    for row in rows:
        print(f"  Normalized Subject: {row[0]}, Q: {row[1]}, HY: {row[2]}, AN: {row[3]}")

