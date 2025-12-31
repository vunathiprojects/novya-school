#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

# Check raju's student_id and if scores exist
with connection.cursor() as cursor:
    # Find raju in student_registration
    cursor.execute("""
        SELECT student_id, student_username, first_name, last_name, school, grade
        FROM student_registration
        WHERE LOWER(first_name) LIKE '%raju%' OR LOWER(last_name) LIKE '%raju%' OR LOWER(student_username) LIKE '%raju%'
    """)
    
    raju_students = cursor.fetchall()
    print("\nRaju students in student_registration:")
    print("=" * 60)
    for row in raju_students:
        print(f"Student ID: {row[0]}, Username: {row[1]}, Name: {row[2]} {row[3]}, School: {row[4]}, Grade: {row[5]}")
    
    # Check if scores exist for any of these student_ids
    if raju_students:
        for row in raju_students:
            student_id = row[0]
            cursor.execute("""
                SELECT COUNT(*)
                FROM school_test_scores
                WHERE student_id = %s
            """, [student_id])
            count = cursor.fetchone()[0]
            print(f"\nStudent ID {student_id}: {count} score records")
            
            if count > 0:
                cursor.execute("""
                    SELECT subject, quarterly_score, half_yearly_score, annual_score
                    FROM school_test_scores
                    WHERE student_id = %s
                """, [student_id])
                scores = cursor.fetchall()
                print(f"  Scores for student_id {student_id}:")
                for score_row in scores:
                    print(f"    - {score_row[0]}: Q={score_row[1]}, HY={score_row[2]}, AN={score_row[3]}")
    
    # Also check all student_ids in school_test_scores to see if any match raju's username pattern
    print("\n" + "=" * 60)
    print("Checking if scores exist with different student_id:")
    print("=" * 60)
    cursor.execute("""
        SELECT DISTINCT sts.student_id, sr.student_username, sr.first_name, sr.last_name
        FROM school_test_scores sts
        LEFT JOIN student_registration sr ON sts.student_id = sr.student_id
        WHERE LOWER(sr.first_name) LIKE '%raju%' OR LOWER(sr.last_name) LIKE '%raju%' OR LOWER(sr.student_username) LIKE '%raju%'
    """)
    
    matching_scores = cursor.fetchall()
    if matching_scores:
        for row in matching_scores:
            print(f"Found scores for student_id {row[0]}: {row[1]} ({row[2]} {row[3]})")
    else:
        print("No scores found for any student matching 'raju'")

