#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

# Query school_test_scores table
with connection.cursor() as cursor:
    # Get all records
    cursor.execute("""
        SELECT student_id, subject, quarterly_score, half_yearly_score, annual_score, class_name, academic_year
        FROM school_test_scores
        ORDER BY student_id, subject
        LIMIT 50
    """)
    
    rows = cursor.fetchall()
    print(f"\nTotal records in school_test_scores: {len(rows)}\n")
    
    if rows:
        print("=" * 80)
        print("SCHOOL TEST SCORES DATA:")
        print("=" * 80)
        for row in rows:
            student_id, subject, q, hy, an, class_name, academic_year = row
            print(f"Student ID: {student_id:3d} | Subject: {subject:15s} | Q: {str(q):5s} | HY: {str(hy):5s} | AN: {str(an):5s} | Class: {str(class_name):10s} | Year: {str(academic_year)}")
        
        # Check specific student IDs
        print("\n" + "=" * 80)
        print("CHECKING SPECIFIC STUDENT IDs (18, 21, 23):")
        print("=" * 80)
        for student_id in [18, 21, 23]:
            cursor.execute("""
                SELECT COUNT(*)
                FROM school_test_scores
                WHERE student_id = %s
            """, [student_id])
            count = cursor.fetchone()[0]
            print(f"Student ID {student_id}: {count} records")
            
            if count > 0:
                cursor.execute("""
                    SELECT subject, quarterly_score, half_yearly_score, annual_score
                    FROM school_test_scores
                    WHERE student_id = %s
                """, [student_id])
                scores = cursor.fetchall()
                for score_row in scores:
                    print(f"  - Subject: {score_row[0]}, Q: {score_row[1]}, HY: {score_row[2]}, AN: {score_row[3]}")
    else:
        print("❌ No records found in school_test_scores table!")
    
    # Check total count
    cursor.execute("SELECT COUNT(*) FROM school_test_scores")
    total_count = cursor.fetchone()[0]
    print(f"\nTotal records in entire table: {total_count}")

