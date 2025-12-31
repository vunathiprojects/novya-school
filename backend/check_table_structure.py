#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

# Check table structure
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'school_test_scores'
        ORDER BY ordinal_position
    """)
    
    columns = cursor.fetchall()
    print("\nTable structure for school_test_scores:")
    print("=" * 50)
    for col in columns:
        print(f"  {col[0]}: {col[1]}")

